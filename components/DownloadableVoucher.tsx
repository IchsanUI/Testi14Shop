"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

type DownloadableVoucherProps = {
  code: string;
  name: string;
  value: number;
  valueType: string;
  expiryDate: string;
  customerName: string;
  terms?: string[];
};

export default function DownloadableVoucher({
  code,
  name,
  value,
  valueType,
  expiryDate,
  customerName,
  terms = [],
}: DownloadableVoucherProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!code || !imgRef.current) return;

    // Create a detached canvas — qrcode touches this directly,
    // never touches the React-managed DOM, so no conflict.
    const canvas = document.createElement("canvas");

    QRCode.toCanvas(canvas, code, {
      width: 280,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(() => {
        imgRef.current!.src = canvas.toDataURL();
      })
      .catch((err) => {
        console.error("QR generation error:", err);
      });
  }, [code]);

  const formattedExpiry = new Date(expiryDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatDiscountValue = (val: number, type: string) => {
    if (type === "percentage") return `${val}%`;
    return `Rp${val.toLocaleString("id-ID")}`;
  };

  const discountLabel = valueType === "percentage" ? "Diskon" : "Potongan Harga";

  const defaultTerms = [
    "Hanya berlaku untuk satu kali penggunaan",
    "Tidak dapat digabungkan dengan promo lain",
    "Berlaku untuk semua layanan 14Group",
    "Wajib menunjukkan QR Code saat checkout",
  ];

  const allTerms = terms.length > 0 ? terms : defaultTerms;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Voucher Card */}
      <div
        style={{
          width: "340px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Top bar — bold yellow accent */}
        <div
          style={{
            height: "8px",
            background: "linear-gradient(90deg, #000000 0%, #facc15 50%, #000000 100%)",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "18px 24px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f3f3f3",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: "#000000",
                fontWeight: 800,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              14Group
            </p>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "#9ca3af",
                fontWeight: 500,
                textTransform: "uppercase",
                marginTop: "2px",
              }}
            >
              Testimoni
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "8px",
              padding: "5px 10px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: "#facc15",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {name}
            </p>
          </div>
        </div>

        {/* Discount display */}
        <div
          style={{
            padding: "20px 24px 16px",
            textAlign: "center",
            background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              color: "#9ca3af",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            {discountLabel}
          </p>
          <p
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#000000",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {formatDiscountValue(value, valueType)}
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "#d1d5db",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            Eksklusif untuk Anda
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffffff", border: "2px solid #e5e7eb", flexShrink: 0 }} />
          <div style={{ flex: 1, borderTop: "2px dashed #e5e7eb" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffffff", border: "2px solid #e5e7eb", flexShrink: 0 }} />
        </div>

        {/* QR Code */}
        <div
          style={{
            padding: "18px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "14px",
              border: "2px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} alt="QR Code" width={160} height={160} style={{ display: "block" }} />
          </div>
          <p style={{ fontSize: "13px", color: "#374151", marginTop: "10px", letterSpacing: "0.25em", fontFamily: "monospace", fontWeight: 700 }}>
            {code}
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>
            Tunjukkan QR ini saat checkout
          </p>
        </div>

        {/* Info rows */}
        <div
          style={{
            padding: "0 24px 14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {[
            { label: "Nama", value: customerName, limit: 16 },
            { label: "Berlaku sampai", value: formattedExpiry, limit: 20 },
          ].map((row, i) => (
            <div key={i} style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "8px 10px", border: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: "8px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                {row.label}
              </p>
              <p style={{ fontSize: "11px", color: "#111827", fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {row.value.length > row.limit ? row.value.slice(0, row.limit) + "…" : row.value}
              </p>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div style={{ padding: "0 24px 16px" }}>
          <div style={{ backgroundColor: "#fafafa", borderRadius: "12px", padding: "10px 12px", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
              Syarat &amp; Ketentuan
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
              {allTerms.slice(0, 3).map((term, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                  <span style={{ color: "#facc15", fontWeight: 800, fontSize: "10px", lineHeight: "1.5", flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: "9px", color: "#6b7280", lineHeight: 1.5 }}>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#000000", padding: "10px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.08em" }}>
            14GROUP · Bagikan Pengalamanmu di 14GROUP
          </p>
        </div>
      </div>

      {/* Reminder text */}
      <div
        style={{
          borderLeft: "4px solid #ef4444",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "10px 14px",
          width: "100%",
          maxWidth: "320px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#fef2f2",
              border: "1.5px solid #fca5a5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            <svg style={{ width: "10px", height: "10px" }} fill="#ef4444" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#111827", lineHeight: 1.6, fontWeight: 600 }}>
              Jangan menutup halaman ini!
            </p>
            <p style={{ fontSize: "10px", color: "#6b7280", lineHeight: 1.5, marginTop: "2px" }}>
              Screenshot voucher Anda sekarang. Redeem hanya berlaku 1x.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}