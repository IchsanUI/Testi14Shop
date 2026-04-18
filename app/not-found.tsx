"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />

      <div className="relative">
        {/* 404 large */}
        <div className="mb-6">
          <p className="text-[140px] md:text-[180px] font-black leading-none text-white/5 select-none">
            404
          </p>
          <div className="-mt-16 md:-mt-20">
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-yellow-400/20">
              <svg
                className="w-10 h-10 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-8">
          Sepertinya halaman yang kamu cari tidak tersedia atau sudah
          dipindahkan. Yuk kembali ke beranda!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white/5 text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
}
