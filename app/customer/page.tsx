"use client";

import { useState } from "react";
import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";

type FormData = {
  name: string;
  whatsapp: string;
  services: string[];
  rating: number;
  message: string;
  photo: string | null;
};

export default function CustomerPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitData, setSubmitData] = useState<FormData | null>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setSubmitError(result.error || "Gagal mengirim testimoni");
        return;
      }
      setSubmitData(data);
      setSubmitResult(result);
      setIsSubmitted(true);
      setSubmitError(null);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Terjadi kesalahan",
      );
    }
  };

  if (isSubmitted && submitResult) {
    return (
      <div className="h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-yellow-400/30">
            <svg
              className="w-8 h-8 text-black"
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
          <h2 className="text-2xl font-black text-white mb-2">Terima Kasih!</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Testimoni Anda berhasil dikirim. Kami akan memverifikasi dan
            menghubungi Anda via WhatsApp.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmitData(null);
                setSubmitResult(null);
              }}
              className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-colors text-sm"
            >
              Kirim Testimoni Lain
            </button>
            <Link
              href="/"
              className="block w-full px-6 py-3 rounded-xl border-2 border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20 transition-colors font-medium text-center text-sm"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* ── HEADER ── */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-yellow-400 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </Link>
          {/* <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <svg
              className="w-3.5 h-3.5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-semibold text-gray-400">14Group</span>
          </div> */}
        </div>
      </header>

      {/* ── HERO TEXT ── */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Ceritakan <span className="text-yellow-400">Pengalamanmu</span>
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Dapatkan kesempatan memenangkan voucher diskon spesial!
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <div className="max-w-xl mx-auto h-full flex flex-col">
          {submitError && (
            <div className="mb-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-red-300">{submitError}</p>
              <button
                onClick={() => setSubmitError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TestimonialForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
