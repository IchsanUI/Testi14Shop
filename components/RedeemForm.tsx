"use client";

import { useState } from "react";
import { formatDiscount, formatRupiahWithZero } from "@/lib/format";
import BarcodeDisplay from "./BarcodeDisplay";
import Link from "next/link";

type RedeemResult = {
  code: string;
  barcode: string;
  name: string;
  value: number;
  valueType: string;
  minPurchase?: bigint | number;
  expiryDate: string;
  customerName: string;
};

export default function RedeemForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [success, setSuccess] = useState(false);
  const [unlucky, setUnlucky] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const normalizedCode = code.toUpperCase().trim();

    if (normalizedCode.length !== 6) {
      setError("Kode redeem harus 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: normalizedCode }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // noMatch = user didn't get lucky — show friendly unlucky screen
        if (data.noMatch) {
          setUnlucky(true);
          return;
        }
        setError(data.message || "Gagal menukarkan kode");
        return;
      }

      setResult(data.voucher);
      setSuccess(true);
      setUnlucky(false);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Unlucky State
  if (unlucky) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          {/* Sad Face Icon */}
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Mohon Maaf</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Anda kurang beruntung kali ini.
            <br />
            Silakan coba lagi lain waktu atau hubungi admin 14Group untuk info
            lebih lanjut.
          </p>
        </div>

        {/* <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-500">
              Setelah testimoni Anda disetujui oleh admin, Anda akan mendapatkan kode redeem untuk menukar voucher.
            </p>
          </div>
        </div> */}

        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              setUnlucky(false);
              setError(null);
              setCode("");
            }}
            className="block w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-center"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="block w-full px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (success && result) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        {/* Success Icon */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black">Selamat!</h2>
          <p className="text-gray-500 text-sm mt-1">
            Voucher berhasil disimpan
          </p>
        </div>

        {/* Voucher Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-5 mb-5">
          {/* Diskon Value */}
          <div className="text-center mb-4">
            <p className="text-4xl font-black text-black mb-1">
              {formatDiscount(
                result.value,
                result.valueType as "percentage" | "fixed",
              )}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Diskon
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300 my-4" />

          {/* Barcode Section */}
          {result.barcode && (
            <div className="mb-4">
              <BarcodeDisplay value={result.barcode} width={2} height={60} />
            </div>
          )}

          {/* Expiry */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Berlaku sampai{" "}
              {new Date(result.expiryDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-400 text-center mb-5">
          Tunjukkan barcode ini ke kasir saat checkout untuk menggunakan voucher
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-center"
          >
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => {
              setSuccess(false);
              setResult(null);
              setUnlucky(false);
              setCode("");
            }}
            className="block w-full px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Tukar Kode Lain
          </button>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kode Redeem
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const val = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "");
              setCode(val.slice(0, 6));
              setError(null);
            }}
            placeholder="XXXXXX"
            maxLength={6}
            className="w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 bg-white uppercase"
            required
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Masukkan kode 6 digit dari admin
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Memproses...
            </>
          ) : (
            "Tukar Sekarang"
          )}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          Tidak punya kode redeem? Silakan hubungi admin 14Group untuk
          mendapatkan kode setelah testimoni Anda disetujui.
        </p>
      </div>
    </div>
  );
}
