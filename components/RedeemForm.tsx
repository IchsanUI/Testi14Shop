"use client";

import { useState, useRef } from "react";
import DownloadableVoucher from "@/components/DownloadableVoucher";
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
  const inputRef = useRef<HTMLInputElement>(null);
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

  // ── Unlucky State ──
  if (unlucky) {
    return (
      <div className="px-6 pt-8 pb-6 flex flex-col items-center">
        {/* Top icon */}
        <div className="w-14 h-14 bg-white/5 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-lg font-black text-white mb-1">Mohon Maaf</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Kode tidak ditemukan atau belum diaktifkan oleh admin.
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-2">
          <button
            onClick={() => {
              setUnlucky(false);
              setError(null);
              setCode("");
            }}
            className="w-full px-6 py-3.5 bg-yellow-400 text-black text-sm font-bold rounded-xl hover:bg-yellow-300 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="block w-full px-6 py-3 text-center text-sm font-medium text-gray-500 hover:text-white transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // ── Success State ──
  if (success && result) {
    return (
      <div className="px-4 pt-5 pb-4">
        {/* Success header */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-black text-white">Voucher Berhasil!</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Simpan voucher di bawah
            </p>
          </div>
        </div>

        {/* Voucher card */}
        <div className="mb-4">
          <DownloadableVoucher
            code={result.barcode}
            name={result.name}
            value={result.value}
            valueType={result.valueType}
            expiryDate={result.expiryDate}
            customerName={result.customerName}
          />
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          <Link
            href="/"
            className="block w-full px-5 py-3 bg-yellow-400 text-black text-sm font-bold rounded-xl hover:bg-yellow-300 transition-colors text-center"
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
            className="w-full px-5 py-2.5 text-xs font-medium text-gray-500 hover:text-white transition-colors"
          >
            Tukar Kode Lain
          </button>
        </div>
      </div>
    );
  }

  // ── Form State ──
  return (
    <div className="px-6 pt-6 pb-5">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Kode Redeem
          </label>

          {/* Digit boxes — visual display */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.focus()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.focus() }}
            className="flex gap-2 justify-center cursor-text select-none"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-12 h-14 border-2 rounded-xl text-center flex items-center justify-center text-2xl font-black transition-all select-none ${
                  code.length === 6 && !error
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : error
                    ? "border-red-500 bg-red-500/10 text-red-400 animate-pulse"
                    : "border-white/20 bg-white/5 text-white"
                }`}
              >
                {code[i] || (
                  <span className="text-gray-600 font-normal text-3xl leading-none">·</span>
                )}
              </div>
            ))}
          </div>

          {/* Hidden input — captures actual keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => {
              const val = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "");
              setCode(val.slice(0, 6));
              setError(null);
            }}
            maxLength={6}
            autoComplete="off"
            autoCapitalize="characters"
            className="sr-only"
          />

          <p className="text-xs text-gray-600 mt-3 text-center">
            Ketuk kotak di atas, lalu ketik 6 karakter kode dari admin
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full px-6 py-4 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold text-base flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black" />
              Memproses...
            </>
          ) : (
            <>
              Tukar Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
