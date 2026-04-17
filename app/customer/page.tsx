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
        headers: {
          "Content-Type": "application/json",
        },
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
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

          <h2 className="text-3xl font-bold text-black mb-3">Terima Kasih!</h2>
          <p className="text-gray-500 mb-8">
            Testimoni Anda berhasil dikirim. Kami akan memverifikasi dan
            menghubungi Anda via WhatsApp untuk kode redeem voucher.
          </p>

          {/* Info Box */}
          {/* <div className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Setelah admin memverifikasi testimoni Anda, Anda akan mendapat kode redeem voucher via WhatsApp. Buka halaman <strong>/redeem</strong> untuk menukarkan kode Anda.
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmitData(null);
                setSubmitResult(null);
              }}
              className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold"
            >
              Kirim Testimoni Lain
            </button>
            <Link
              href="/"
              className="block w-full px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-red-800">
                Gagal mengirim testimoni
              </p>
              <p className="text-sm text-red-700 mt-1">{submitError}</p>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
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
        <h1 className="text-3xl md:text-4xl font-bold text-black mt-4">
          Form Testimoni Pelanggan
        </h1>
        <p className="text-gray-500 mt-2">
          Bagikan pengalaman Anda dengan layanan 14Group
        </p>
      </div>

      <TestimonialForm onSubmit={handleSubmit} />
    </div>
  );
}
