import { prisma } from './prisma'

// Generate a unique barcode identifier
export function generateBarcode(code: string): string {
  // Combine code with timestamp and random string for uniqueness
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `VC-${code}-${timestamp}-${random}`.toUpperCase()
}

export async function assignRandomVoucher(customerMaxSpend?: number): Promise<{
  code: string
  barcode: string
  id: string
  name: string
  value: number
  valueType: string
  minPurchase: number
  expiryDays: number
} | { noMatch: true; reason: string; customerSpend: number; lowestMinPurchase: number } | null> {
  // Get all active vouchers with available quota
  const availableVouchers = await prisma.voucher.findMany({
    where: {
      active: true,
    },
  })

  // Filter vouchers by quota AND by minPurchase matching customer spend
  let vouchersWithQuota = availableVouchers.filter(
    (v) => v.used < v.quota
  )

  // If customer spend info is provided, only show vouchers whose minPurchase <= customer spend
  if (customerMaxSpend !== undefined && customerMaxSpend > 0) {
    const matchingVouchers = vouchersWithQuota.filter(
      (v) => Number(v.minPurchase) <= customerMaxSpend
    )
    if (matchingVouchers.length === 0) {
      // Find the lowest minPurchase among all vouchers to give helpful guidance
      const allMinPurchases = availableVouchers
        .filter((v) => v.used < v.quota)
        .map((v) => Number(v.minPurchase))
      const lowestMinPurchase = allMinPurchases.length > 0
        ? Math.min(...allMinPurchases)
        : 0
      return {
        noMatch: true,
        reason: `Belanja terakhir Anda Rp ${customerMaxSpend.toLocaleString('id-ID')}. Voucher yang tersedia memerlukan min. belanja Rp ${lowestMinPurchase.toLocaleString('id-ID')}.`,
        customerSpend: customerMaxSpend,
        lowestMinPurchase,
      }
    }
    vouchersWithQuota = matchingVouchers
  }

  if (vouchersWithQuota.length === 0) {
    return null
  }

  // Calculate total probability
  const totalProbability = vouchersWithQuota.reduce(
    (sum, v) => sum + v.probability,
    0
  )

  if (totalProbability === 0) {
    return null
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

  // Generate unique barcode
  const barcode = generateBarcode(selectedVoucher.code)

  // Atomic increment with quota check to prevent race condition
  const result = await prisma.$executeRaw`
    UPDATE Voucher
    SET used = used + 1
    WHERE id = ${selectedVoucher.id} AND used < ${selectedVoucher.quota}
  `

  if (result === 0) {
    // Race condition: another request claimed the last slot
    return null
  }

  return {
    code: selectedVoucher.code,
    barcode,
    id: selectedVoucher.id,
    name: selectedVoucher.name,
    value: selectedVoucher.value,
    valueType: selectedVoucher.valueType,
    minPurchase: Number(selectedVoucher.minPurchase),
    expiryDays: selectedVoucher.expiryDays,
  }
}

// Check if any discount event is currently active
export async function hasActiveEvent(): Promise<boolean> {
  const activeVouchers = await prisma.voucher.findMany({
    where: {
      active: true,
    },
  })
  const vouchersWithQuota = activeVouchers.filter((v) => v.used < v.quota)
  return vouchersWithQuota.length > 0
}

export async function createVoucher(data: {
  name: string
  code: string
  value: number
  quota: number
  probability: number
  expiryDays?: number
}) {
  return await prisma.voucher.create({
    data: {
      ...data,
      expiryDays: data.expiryDays || 7,
    },
  })
}

export async function getAllVouchers() {
  return await prisma.voucher.findMany({
    orderBy: { probability: 'desc' },
  })
}

export async function getAvailableVouchers() {
  const vouchers = await prisma.voucher.findMany({
    where: {
      active: true,
    },
  })
  // Filter vouchers that still have available quota
  return vouchers.filter((v) => v.used < v.quota)
}

export async function verifyVoucher(barcode: string) {
  // Find the testimonial with this barcode
  const testimonial = await prisma.testimonial.findFirst({
    where: { barcode },
  })

  if (!testimonial) {
    return { valid: false, message: 'Voucher tidak ditemukan' }
  }

  if (testimonial.voucherUsed) {
    return { valid: false, message: 'Voucher sudah digunakan' }
  }

  if (!testimonial.voucherId) {
    return { valid: false, message: 'Voucher tidak valid' }
  }

  // Get the voucher details
  const voucher = await prisma.voucher.findUnique({
    where: { id: testimonial.voucherId },
  })

  if (!voucher) {
    return { valid: false, message: 'Voucher tidak ditemukan' }
  }

  if (!voucher.active) {
    return { valid: false, message: 'Voucher tidak aktif' }
  }

  // Check if expired
  const expiryDate = new Date(testimonial.createdAt)
  expiryDate.setDate(expiryDate.getDate() + voucher.expiryDays)
  const now = new Date()

  if (now > expiryDate) {
    return { valid: false, message: 'Voucher sudah kadaluarsa' }
  }

  return {
    valid: true,
    voucher: {
      id: testimonial.id,
      name: voucher.name,
      code: voucher.code,
      value: voucher.value,
      expiryDate: expiryDate.toISOString(),
      customerName: testimonial.name,
    },
  }
}
