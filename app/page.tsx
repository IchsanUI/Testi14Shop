"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import TestimonialsDisplay from "@/components/TestimonialsDisplay";
import CustomerCarousel from "@/components/CustomerCarousel";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "6281234567890";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    const reveals = el.querySelectorAll(".reveal");
    reveals.forEach((r) => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return ref;
}

const facilities = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    title: "Tukar Tambah",
    desc: "Tukarkan HP lama dengan HP baru lebih hemat",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "COD",
    desc: "Bayar langsung saat barang sampai di tangan",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Garansi",
    desc: "Garansi after sales untuk ketenangan pikiran",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Service HP",
    desc: "Layanan service profesional semua tipe HP",
  },
];

export default function Home() {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* ─── HERO ─── */}
      <section className="relative h-screen flex items-center bg-black overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
            {/* Left: Text */}
              <div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                <span className="hero-line"><span className="hero-line-inner">Find Your</span></span>
                <span className="hero-line"><span className="hero-line-inner">Journey</span></span>
                <span className="hero-line relative">
                  <span className="hero-line-inner text-yellow-400">Here</span>
                  <span className="hero-underline absolute -bottom-2 left-0 w-full h-1.5 bg-yellow-400/30 rounded-full" />
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md hero-subtitle">
                Ceritakan pengalaman Anda dengan layanan kami dan dapatkan
                kesempatan voucher diskon spesial!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 hero-cta">
                <Link
                  href="/customer"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-yellow-400 text-black font-bold text-base rounded-xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20"
                >
                  Isi Testimoni
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-bold text-base rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Hubungi Kami
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 hero-stats">
                {[
                  { num: "10rb+", label: "Pelanggan" },
                  { num: "4.9", label: "Rating" },
                  { num: "7th", label: "Pengalaman" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-white">{stat.num}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero visual card */}
            <div className="hidden lg:flex justify-center hero-card">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center w-full max-w-sm">
                <Image
                  src="/logo-full.png"
                  alt="14Group"
                  width={160}
                  height={54}
                  className="h-14 w-auto mx-auto mb-6 brightness-0 invert"
                />
                <p className="text-sm text-gray-400 font-medium">
                  Dekat Lampu Merah, Jl. Panglima Sudirman No.134
                </p>
                <p className="text-xs text-gray-600 mt-1">Gresik, Jawa Timur</p>
                <div className="mt-6 flex justify-center">
                  <svg
                    className="w-10 h-10 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Kunjungi kami hari ini
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ─── USAHA LOGOS ─── */}
      <section className="bg-black py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10 reveal">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              Ekosistem Kami
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Berbagai Usaha
              <br />
              dalam Satu Kelompok
            </h2>
          </div>
          <div className="flex justify-center reveal reveal-delay-2">
            <div className="rounded-2xl overflow-hidden w-full max-w-3xl bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-logo-14group.png"
                alt="Logo-logo 14Group - Usaha di 14Group"
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8 max-w-md mx-auto reveal reveal-delay-3">
            Mulai dari penjualan HP, tukar tambah, service, barbershop, hingga
            cafe — semua dalam naungan 14Group
          </p>
        </div>
      </section>

      {/* divider */}
      <div className="h-px bg-gray-800" />

      {/* ─── FACILITIES ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 reveal">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
              Layanan Kami
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
              Fasilitas Lengkap
              <br />
              untuk Anda
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {facilities.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all hover:border-black hover:shadow-lg hover:-translate-y-0.5 cursor-default group`}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-black rounded-2xl mx-auto mb-5 group-hover:bg-yellow-400 transition-colors">
                  <div className="text-white group-hover:text-black transition-colors">
                    {f.icon}
                  </div>
                </div>
                <h3 className="font-bold text-sm text-black mb-1.5">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="h-px bg-gray-100" />

      {/* ─── CUSTOMER PHOTOS CAROUSEL ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 reveal">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
              Galeri
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
              Momen
              <br />
              Pelanggan
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <CustomerCarousel />
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="h-px bg-gray-100" />

      {/* ─── LOCATION ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Info */}
            <div className="lg:col-span-2 reveal">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                Lokasi
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-black mb-6 leading-tight">
                Kunjungi
                <br />
                Toko Kami
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg
                      className="w-5 h-5 text-black flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">14Group</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Dekat Lampu Merah,
                      <br />
                      Jl. Panglima Sudirman No.134,
                      <br />
                      Kramatandap, Gapurosukolilo,
                      <br />
                      Gresik, Jawa Timur 61111
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg
                      className="w-5 h-5 text-black flex-shrink-0"
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
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jam Operasional</p>
                    <p className="text-gray-500 text-sm">
                      Setiap hari, 09.00 – 21.00 WIB
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=-7.170131155428334,112.65387677384109"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Buka di Google Maps
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-3 reveal reveal-delay-2">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 h-72 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d112.6518!3d-7.1701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTAnMTMuOCJTIDExMsKwMzknMDQuOCJF!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="14Group Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="h-px bg-gray-100" />

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
              Testimoni
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
              Apa Kata
              <br />
              Pelanggan Kami?
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <TestimonialsDisplay />
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="h-px bg-gray-100" />

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-black py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="reveal">
            <Image
              src="/logo-saja.png"
              alt="14Group"
              width={120}
              height={43}
              className="h-12 w-auto mx-auto mb-6 opacity-90 brightness-0 invert"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight reveal reveal-delay-1">
            Puas dengan Layanan Kami?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto reveal reveal-delay-2">
            Bagikan pengalaman Anda dan dapatkan kesempatan memenangkan voucher
            diskon menarik!
          </p>
          <div className="reveal reveal-delay-3">
            <Link
              href="/customer"
              className="inline-flex items-center justify-center px-10 py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Isi Testimoni Sekarang
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Col 1: Brand & Contact */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logo-saja.png"
                  alt="14Group"
                  width={100}
                  height={36}
                  className="h-9 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Ekosistem terlengkap untuk kebutuhan HP, barber, dan cafe — semua dalam satu kelompok usaha.
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
                Tautan Cepat
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/customer", label: "Form Testimoni" },
                  { href: "/redeem", label: "Redeem Kode Voucher" },
                  { href: "/admin", label: "Login Admin" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
                Hubungi Kami
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400 text-sm leading-relaxed">
                    Jl. Panglima Sudirman No.134,
                    <br />
                    Kramatandap, Gapurosukolilo,
                    <br />
                    Gresik, Jawa Timur 61111
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400 text-sm">+62 8xx-xxxx-xxxx</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-400 text-sm">Setiap hari, 09.00 – 21.00 WIB</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} 14Group. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">Dekat Lampu Merah, Gresik</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50 hover:scale-110"
        aria-label="Chat WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
