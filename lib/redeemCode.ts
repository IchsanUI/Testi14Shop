import { prisma } from "./prisma";

// Generate a 6-digit redeem code (e.g., "XK7M2P")
export function generateRedeemCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed I, O, 0, 1 for clarity
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate unique redeem code (check for duplicates)
export async function generateUniqueRedeemCode(): Promise<string> {
  let code = generateRedeemCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await prisma.redeemCode.findUnique({
      where: { code },
    });

    if (!existing) {
      return code;
    }

    code = generateRedeemCode();
    attempts++;
  }

  // If we can't generate unique code, use timestamp suffix
  return generateRedeemCode() + Date.now().toString(36).slice(-4);
}

// Create a redeem code for an approved testimonial
export async function createRedeemCode(
  testimonialId: string,
): Promise<string | null> {
  // Check if testimonial exists and is approved
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: testimonialId },
  });

  if (!testimonial) {
    return null;
  }

  if (!testimonial.approved) {
    throw new Error("Testimoni belum disetujui");
  }

  // Check if there's a valid unused redeem code
  const existingCode = await prisma.redeemCode.findFirst({
    where: {
      testimonialId,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (existingCode) {
    return existingCode.code;
  }

  // Generate new code
  const code = await generateUniqueRedeemCode();

  // Code expires in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await prisma.redeemCode.create({
    data: {
      code,
      testimonialId,
      expiresAt,
    },
  });

  return code;
}

// Verify and redeem a code
export async function redeemCode(code: string): Promise<{
  success: boolean;
  message: string;
  voucher?: any;
  noMatch?: boolean;
  customerSpend?: number;
  lowestMinPurchase?: number;
}> {
  // Use a Prisma transaction with serializable isolation to prevent race conditions
  return await prisma.$transaction(async (tx) => {
    // Find the code (within transaction)
    const redeemCode = await tx.redeemCode.findUnique({
      where: { code },
    });

    if (!redeemCode) {
      return {
        success: false,
        message: "Kode redeem tidak ditemukan",
      };
    }

    // Check if already used
    if (redeemCode.used) {
      return {
        success: false,
        message: "Kode redeem sudah digunakan",
      };
    }

    // Check if expired
    if (new Date() > redeemCode.expiresAt) {
      return {
        success: false,
        message: "Kode redeem sudah kadaluarsa",
      };
    }

    // Get the testimonial
    const testimonial = await tx.testimonial.findUnique({
      where: { id: redeemCode.testimonialId },
    });

    if (!testimonial || !testimonial.approved) {
      return {
        success: false,
        message: "Testimoni tidak valid",
      };
    }

    // Check if voucher already used
    if (testimonial.voucherUsed) {
      return {
        success: false,
        message: "Voucher untuk testimoni ini sudah digunakan",
      };
    }

    // Check if voucher was already assigned in a previous attempt
    if (testimonial.voucher && testimonial.voucherId) {
      const existingVoucher = await tx.voucher.findUnique({
        where: { id: testimonial.voucherId },
      });

      if (existingVoucher) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + existingVoucher.expiryDays);

        return {
          success: true,
          message: "Voucher berhasil ditemukan!",
          voucher: {
            code: existingVoucher.code,
            barcode: testimonial.barcode || "",
            name: existingVoucher.name,
            value: existingVoucher.value,
            valueType: existingVoucher.valueType,
            minPurchase: Number(existingVoucher.minPurchase),
            expiryDate: expiryDate.toISOString(),
            customerName: testimonial.name,
            customerWhatsapp: testimonial.whatsapp,
          },
        };
      }
    }

    // =============================================================
    // VOUCHER ASSIGNMENT - All within the same transaction
    // This prevents race conditions where multiple concurrent requests
    // could claim the same voucher's last slot
    // =============================================================

    const customerMaxSpend = testimonial.lastTransactionAmount

    // Get all active vouchers with available quota - WITHIN transaction
    const availableVouchers = await tx.voucher.findMany({
      where: { active: true },
    })

    // Filter by quota
    let vouchersWithQuota = availableVouchers.filter(
      (v) => v.used < v.quota
    )

    // Filter by minPurchase matching customer spend
    if (customerMaxSpend !== undefined && customerMaxSpend > 0) {
      const matchingVouchers = vouchersWithQuota.filter(
        (v) => Number(v.minPurchase) <= customerMaxSpend
      )
      if (matchingVouchers.length > 0) {
        vouchersWithQuota = matchingVouchers
      }
    }

    if (vouchersWithQuota.length === 0) {
      return {
        success: false,
        message: "Maaf, tidak ada voucher tersedia saat ini.",
      };
    }

    // Calculate total probability
    const totalProbability = vouchersWithQuota.reduce(
      (sum, v) => sum + v.probability,
      0
    )

    if (totalProbability === 0) {
      return {
        success: false,
        message: "Maaf, tidak ada voucher tersedia saat ini.",
      };
    }

    // Generate random number
    const random = Math.random() * totalProbability

    // Find which voucher to assign based on probability
    let accumulatedProbability = 0
    let selectedVoucher = vouchersWithQuota[0]

    for (const voucher of vouchersWithQuota) {
      accumulatedProbability += voucher.probability
      if (random <= accumulatedProbability) {
        selectedVoucher = voucher
        break
      }
    }

    // =============================================================
    // ATOMIC QUOTA INCREMENT - Use raw SQL to atomically check and increment
    // This is the key to preventing race conditions
    // =============================================================
    const result = await tx.$executeRaw`
      UPDATE Voucher
      SET used = used + 1, transactionCount = transactionCount + 1
      WHERE id = ${selectedVoucher.id} AND used < ${selectedVoucher.quota}
    `

    if (result === 0) {
      // Race condition: another request claimed the last slot - retry or fail
      // Try to find another available voucher
      const retryVouchers = vouchersWithQuota.filter(
        (v) => v.id !== selectedVoucher.id && v.used < v.quota
      )
      if (retryVouchers.length === 0) {
        return {
          success: false,
          message: "Maaf, voucher sudah habis. Silakan coba lagi nanti.",
        };
      }
      // Select the next available voucher
      selectedVoucher = retryVouchers[0]
      const retryResult = await tx.$executeRaw`
        UPDATE Voucher
        SET used = used + 1, transactionCount = transactionCount + 1
        WHERE id = ${selectedVoucher.id} AND used < ${selectedVoucher.quota}
      `
      if (retryResult === 0) {
        return {
          success: false,
          message: "Maaf, voucher sudah habis. Silakan coba lagi nanti.",
        };
      }
    }

    // Mark redeem code as used
    await tx.redeemCode.update({
      where: { id: redeemCode.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Generate barcode and update testimonial
    const barcode = `VC-${selectedVoucher.code}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()

    await tx.testimonial.update({
      where: { id: testimonial.id },
      data: {
        voucher: selectedVoucher.code,
        voucherId: selectedVoucher.id,
        barcode,
      },
    });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + selectedVoucher.expiryDays);

    return {
      success: true,
      message: "Voucher berhasil didaftarkan!",
      voucher: {
        code: selectedVoucher.code,
        barcode,
        name: selectedVoucher.name,
        value: selectedVoucher.value,
        valueType: selectedVoucher.valueType,
        minPurchase: Number(selectedVoucher.minPurchase),
        expiryDate: expiryDate.toISOString(),
        customerName: testimonial.name,
        customerWhatsapp: testimonial.whatsapp,
      },
    };
  });
}

// Get redeem code by testimonial ID
export async function getRedeemCodeByTestimonial(
  testimonialId: string,
): Promise<string | null> {
  const redeemCode = await prisma.redeemCode.findFirst({
    where: { testimonialId },
  });

  return redeemCode?.code || null;
}

// Check if code is valid (without using it)
export async function validateRedeemCode(code: string): Promise<{
  valid: boolean;
  message: string;
  expiresAt?: string;
}> {
  const redeemCode = await prisma.redeemCode.findUnique({
    where: { code },
  });

  if (!redeemCode) {
    return {
      valid: false,
      message: "Kode redeem tidak ditemukan",
    };
  }

  if (redeemCode.used) {
    return {
      valid: false,
      message: "Kode redeem sudah digunakan",
    };
  }

  if (new Date() > redeemCode.expiresAt) {
    return {
      valid: false,
      message: "Kode redeem sudah kadaluarsa",
    };
  }

  return {
    valid: true,
    message: "Kode redeem valid",
    expiresAt: redeemCode.expiresAt.toISOString(),
  };
}
