"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "6282245000939";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    el.querySelectorAll(".reveal").forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function WaIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

// ── Jadwal ─────────────────────────────────────────────
const schedule = [
  { day: "Senin", hours: "10.00 - 21.00" },
  { day: "Selasa", hours: "10.00 - 21.00" },
  { day: "Rabu", hours: "10.00 - 21.00" },
  { day: "Kamis", hours: "10.00 - 21.00" },
  { day: "Jumat", hours: "10.00 - 21.00" },
  { day: "Sabtu", hours: "10.00 - 21.00" },
  { day: "Minggu", hours: "10.00 - 20.00" },
];
const today = new Date().getDay();
const dayMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const currentDayName = dayMap[today];

const address = "Jl. Comandante Sudirman No.134, Kramatandap, Gapurosukolilo, Gresik, Jawa Timur 61111";

// ── Gallery Photos ──────────────────────────────────────
const galleryPhotos = [
  { src: "https://images.unsplash.com/photo-1621605815971-fbc1da59fc16?w=600&q=80", alt: "Interior barbershop modern dengan pencahayaan warm", label: "Interior Toko" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80", alt: "Pelanggan sedang potongan rambut pria", label: "Proses Potongan" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162a0f6a1?w=600&q=80", alt: "Alat-alat barbershop profesional", label: "Tools & Equipment" },
];

// ── Daftar Harga ───────────────────────────────────────
type ServiceRow = {
  name: string;
  duration: string;
  price: string;
  note?: string;
};

const services: ServiceRow[] = [
  { name: "Haircut Biasa", duration: "30 menit", price: "Rp 25.000" },
  { name: "Haircut + Cuci", duration: "45 menit", price: "Rp 35.000" },
  { name: "Haircut + Creambath", duration: "60 menit", price: "Rp 50.000" },
  { name: "Fade / Taper Cut", duration: "45 menit", price: "Rp 35.000" },
  { name: "Shave / Cukur Botak", duration: "20 menit", price: "Rp 15.000" },
  { name: "Shave + Steaming", duration: "40 menit", price: "Rp 30.000" },
  { name: "Beard Trim", duration: "15 menit", price: "Rp 10.000" },
  { name: "Beard Sculpt / Bentuk Jenggot", duration: "25 menit", price: "Rp 20.000" },
  { name: "Full Service (Cut + Beard + Wash)", duration: "75 menit", price: "Rp 60.000" },
  { name: "Paket Lengkap (Full Service + Creambath)", duration: "90 menit", price: "Rp 80.000" },
  { name: "Coloring / Pewarnaan Rambut", duration: "60 menit", price: "Rp 75.000", note: "Depends on type" },
  { name: "Hair Treatment / Spa Rambut", duration: "45 menit", price: "Rp 50.000" },
];

// ── Highlights ─────────────────────────────────────────
const highlights = [
  { icon: "✂️", text: "Crew berpengalaman & terlatih" },
  { icon: "🪒", text: "Alat-alat steril & disposable" },
  { icon: "☕", text: "Tersedia kopi & teh Gratis" },
  { icon: "🎵", text: "Musik & suasana nyaman" },
  { icon: "⏱️", text: "On-time, tidak molor" },
  { icon: "💯", text: "Garansi potongan puas" },
];

export default function BarbershopPage() {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-black" ref={containerRef}>

      {/* ─── HERO ─── */}
      <section className="relative py-16 px-4 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="reveal">
              <span className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3 block">
                Barbershop & Coffee
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Gaya Rambut & Kopi —
                <br />
                <span className="text-orange-400">Semua di Sini</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Barbershop 14Coffe bukan sekadar tempat potong rambut. Di sini
                kamu dapat layanan cukur profesional, suasana nyaman, dan kopi
                gratis. Datang, nikmati, keluar dengan percaya diri.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20booking%20di%20Barbershop%2014Coffe`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-400 transition-colors"
              >
                <WaIcon className="w-4 h-4" />
                Book via WhatsApp
              </a>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image
                  src="https://images.unsplash.com/photo-1621605815971-fbc1da59fc16?w=800&q=80"
                  alt="Interior Barbershop 14Coffe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-sm font-bold">Barbershop 14Coffe</p>
                  <p className="text-gray-300 text-xs">Gaya, nyaman, dan penuh gaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIGHLIGHTS ─── */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 reveal">
          {highlights.map((h) => (
            <div key={h.text} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <span className="text-2xl mb-1 block">{h.icon}</span>
              <p className="text-white/80 text-xs font-medium leading-tight">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── JADWAL + DAFTAR HARGA ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Jadwal */}
          <div className="lg:col-span-1 reveal">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-black text-white">Jadwal Toko</h2>
              </div>

              <div className="space-y-1.5">
                {schedule.map((s) => {
                  const isToday = s.day === currentDayName;
                  return (
                    <div
                      key={s.day}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${isToday ? "bg-orange-400/10 border border-orange-400/30" : "bg-white/5"}`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <span className="w-2 h-2 bg-orange-400 rounded-full" />
                        )}
                        <span className={`text-sm font-medium ${isToday ? "text-orange-400" : "text-white/70"}`}>
                          {s.day}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${isToday ? "text-orange-400" : "text-white/90"}`}>
                          {s.hours}
                        </span>
                        {isToday && (
                          <span className="ml-2 text-xs bg-orange-400/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                            Hari ini
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-bold">Sedang Buka Sekarang</span>
              </div>
            </div>
          </div>

          {/* Daftar Harga */}
          <div className="lg:col-span-2 reveal reveal-delay-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-base font-black text-white">Daftar Harga</h2>
              </div>

              <div className="space-y-2">
                {services.map((s) => (
                  <div key={s.name} className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckIcon />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{s.name}</p>
                        {s.note && <p className="text-gray-500 text-xs mt-0.5">{s.note}</p>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-orange-400 text-sm font-black">{s.price}</p>
                      <p className="text-gray-500 text-xs">{s.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20tanya%20tentang%20harga%20layanan%20di%20Barbershop%2014Coffe`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-400 text-sm font-bold hover:underline"
                >
                  Tanya harga via WhatsApp
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8 reveal">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Galeri
          </span>
          <h2 className="text-3xl font-black text-white leading-tight">
            Suasana & Momen
            <br />
            di Barbershop
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal reveal-delay-2">
          {galleryPhotos.map((photo, i) => (
            <div key={photo.label} className="relative rounded-2xl overflow-hidden group aspect-[4/3]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white text-sm font-bold">{photo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LOKASI ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 reveal">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest mb-2 block">
              Lokasi
            </span>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Kunjungi
              <br />
              Barbershop Kami
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-orange-400">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">14Coffe</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Jl. Comandante Sudirman No.134,
                    <br />
                    Kramatandap, Gapurosukolilo,
                    <br />
                    Gresik, Jawa Timur 61111
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-orange-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Jam Operasional</p>
                  <p className="text-gray-500 text-xs">Setiap hari, 10.00 – 21.00 WIB</p>
                </div>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/acAiQap4fxuyMdTQA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Buka di Google Maps
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 reveal reveal-delay-2">
            <div className="rounded-2xl overflow-hidden border-2 border-white/10 h-64 md:h-72">
              <iframe
                src="https://maps.google.com/maps?q=-7.1700976255156075,112.6537869682405&hl=id&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="14Coffe Barbershop Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center reveal">
          <span className="text-4xl mb-3 block">✂️</span>
          <h2 className="text-2xl font-black text-white mb-3">
            Siap Ganti Gaya?
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
            Book sekarang via WhatsApp dan keluar dengan tampang baru!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20booking%20di%20Barbershop%2014Coffe`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-green-400 transition-colors"
            >
              <WaIcon className="w-4 h-4" />
              Book via WhatsApp
            </a>
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Kirim Testimoni
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}