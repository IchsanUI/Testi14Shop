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

// ── Harga Daftar Service ──────────────────────────────────
type PriceRow = {
  service: string;
  note?: string;
  iphone: string;
  samsung: string;
  xiaomi: string;
  oppo: string;
};

const priceList: PriceRow[] = [
  { service: "Ganti LCD / AMOLED", note: "OEM vs Original", iphone: "Rp 800rb - 2.5jt", samsung: "Rp 600rb - 2jt", xiaomi: "Rp 400rb - 1.2jt", oppo: "Rp 400rb - 1.2jt" },
  { service: "Ganti Baterai", iphone: "Rp 250rb - 500rb", samsung: "Rp 150rb - 350rb", xiaomi: "Rp 100rb - 250rb", oppo: "Rp 100rb - 250rb" },
  { service: "Perbaikan Water Damage", note: "Depends on severity", iphone: "Rp 300rb - 1jt", samsung: "Rp 250rb - 800rb", xiaomi: "Rp 200rb - 600rb", oppo: "Rp 200rb - 600rb" },
  { service: "Ganti Charging Port", iphone: "Rp 200rb - 400rb", samsung: "Rp 150rb - 300rb", xiaomi: "Rp 100rb - 200rb", oppo: "Rp 100rb - 200rb" },
  { service: "Ganti Speaker / Mic", iphone: "Rp 200rb - 350rb", samsung: "Rp 150rb - 300rb", xiaomi: "Rp 100rb - 250rb", oppo: "Rp 100rb - 250rb" },
  { service: "Ganti Kamera", iphone: "Rp 300rb - 1.5jt", samsung: "Rp 250rb - 800rb", xiaomi: "Rp 200rb - 500rb", oppo: "Rp 200rb - 500rb" },
  { service: "Ganti Tombol Power", iphone: "Rp 150rb - 300rb", samsung: "Rp 100rb - 250rb", xiaomi: "Rp 100rb - 200rb", oppo: "Rp 100rb - 200rb" },
  { service: "Install Ulang / Upgrade OS", iphone: "Rp 150rb", samsung: "Rp 100rb", xiaomi: "Rp 100rb", oppo: "Rp 100rb" },
  { service: "Unlock Bootloader / Root", iphone: "-", samsung: "Rp 200rb", xiaomi: "Rp 150rb", oppo: "Rp 150rb" },
];

// ── Workshop Photos ──────────────────────────────────────
const workshopPhotos = [
  { src: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=600&q=80", alt: "Teknisi memperbaiki HP dengan alat专业的", label: "Proses Pengerjaan" },
  { src: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80", alt: "Berbagai spare part HP yang tersedia", label: "Spare Part Lengkap" },
  { src: "https://images.unsplash.com/photo-1601784551447-50cc10f5c9fa?w=600&q=80", alt: "HP yang sedang di servis di meja kerja", label: "Quality Control" },
];

// ── Jadwal Service ────────────────────────────────────────
const schedule = [
  { day: "Senin", hours: "08.00 - 21.00", status: "open" },
  { day: "Selasa", hours: "08.00 - 21.00", status: "open" },
  { day: "Rabu", hours: "08.00 - 21.00", status: "open" },
  { day: "Kamis", hours: "08.00 - 21.00", status: "open" },
  { day: "Jumat", hours: "08.00 - 21.00", status: "open" },
  { day: "Sabtu", hours: "08.00 - 21.00", status: "open" },
  { day: "Minggu", hours: "09.00 - 20.00", status: "open" },
];

const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
const dayMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const currentDayName = dayMap[today];

const address = "Jl. Panglima Sudirman No.134, Kramatandap, Gapurosukolilo, Gresik, Jawa Timur 61111";
const coords = { lat: -7.170131155428334, lng: 112.65387677384109 };

export default function ServicePhonePage() {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-black" ref={containerRef}>

      {/* ─── HERO ─── */}
      <section className="relative py-16 px-4 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 via-transparent to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="reveal">
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-3 block">
                iFourteen Service
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Service HP Profesional
                <br />
                <span className="text-yellow-400">iPhone & Android</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Tukar component baru, perbaikan total, upgrade — semua ditangani
                teknisi berpengalaman. Konsultasi gratis, garansi setiap perbaikan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20service%20HP`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-400 transition-colors"
                >
                  <WaIcon className="w-4 h-4" />
                  Chat via WhatsApp
                </a>
                <a
                  href="#harga"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Lihat Daftar Harga
                </a>
              </div>
            </div>

            {/* Hero image */}
            <div className="reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image
                  src="https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&q=80"
                  alt="iFourteen Service - Teknisi memperbaiki HP"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-xs font-bold">Teknisi berpengalaman</p>
                  <p className="text-gray-300 text-xs">7+ tahun di bidang service HP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── JADWAL SERVICE ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jadwal */}
          <div className="lg:col-span-1 reveal">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-black text-white">Jadwal Service</h2>
              </div>

              <div className="space-y-2">
                {schedule.map((s) => {
                  const isToday = s.day === currentDayName;
                  return (
                    <div
                      key={s.day}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                        isToday ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <span className="text-[9px] font-black text-yellow-400 bg-yellow-400/20 px-1.5 py-0.5 rounded uppercase">
                            Hari ini
                          </span>
                        )}
                        <span className={`text-sm font-bold ${isToday ? "text-white" : "text-gray-400"}`}>
                          {s.day}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-300">{s.hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-green-400 text-xs font-bold">Sedang Buka Sekarang</p>
              </div>
            </div>
          </div>

          {/* Info penting */}
          <div className="lg:col-span-2 reveal reveal-delay-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-black text-white mb-5">Informasi Penting</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "🔍",
                    title: "Konsultasi Gratis",
                    desc: "Cek kondisi HP tanpa biaya. Kami kasih tahu masalah dan estimasi harga di awal.",
                  },
                  {
                    icon: "⏱️",
                    title: "Estimasi Pengerjaan",
                    desc: "LCD / Baterai: 1-2 jam. Water damage / perbaikan kompleks: 1-3 hari.",
                  },
                  {
                    icon: "🛡️",
                    title: "Garansi Service",
                    desc: "Setiap perbaikan mendapat garansi 7-30 hari. Komplain? Tanpa ribet.",
                  },
                  {
                    icon: "📦",
                    title: "Spare Part Ready",
                    desc: "Stok spare part lengkap untuk iPhone, Samsung, Xiaomi, Oppo, Vivo dll.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DAFTAR HARGA ─── */}
      <section id="harga" className="max-w-5xl mx-auto px-4 pb-14">
        <div className="text-center mb-8 reveal">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Daftar Harga
          </span>
          <h2 className="text-2xl font-black text-white mb-1">
            Estimasi Harga Service
          </h2>
          <p className="text-gray-500 text-xs">Harga bisa berubah tergantung kondisi HP dan stok part</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden reveal">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left text-gray-400 font-semibold px-4 py-3 text-xs uppercase tracking-widest w-2/5">
                    Jenis Service
                  </th>
                  <th className="text-center px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    iPhone
                  </th>
                  <th className="text-center px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Samsung
                  </th>
                  <th className="text-center px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Xiaomi
                  </th>
                  <th className="text-center px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Oppo
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceList.map((row, i) => (
                  <tr key={row.service} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-200 text-xs font-bold">{row.service}</p>
                      {row.note && <p className="text-gray-600 text-[10px] mt-0.5">{row.note}</p>}
                    </td>
                    <td className="text-center px-3 py-3.5">
                      <span className="text-yellow-400 text-xs font-bold">{row.iphone}</span>
                    </td>
                    <td className="text-center px-3 py-3.5">
                      <span className="text-blue-400 text-xs font-bold">{row.samsung}</span>
                    </td>
                    <td className="text-center px-3 py-3.5">
                      <span className="text-orange-400 text-xs font-bold">{row.xiaomi}</span>
                    </td>
                    <td className="text-center px-3 py-3.5">
                      <span className="text-green-400 text-xs font-bold">{row.oppo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/5 px-4 py-3 bg-white/5 flex items-center gap-3">
            <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-xs">
              Harga sudah termasuk spare part dan ongkos pasang. Untuk model spesifik, silakan{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20tanya%20harga%20service%20HP`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 font-bold hover:underline"
              >
                chat langsung
              </a>{" "}
              untuk estimasi yang lebih akurat.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOTO WORKSHOP ─── */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="text-center mb-8 reveal">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Workshop
          </span>
          <h2 className="text-2xl font-black text-white">Di Tempat Kami</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {workshopPhotos.map((photo, i) => (
            <div key={photo.label} className="relative rounded-2xl overflow-hidden aspect-square reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">{photo.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LOKASI ─── */}
      <section className="max-w-5xl mx-auto px-4 pb-14 reveal">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-56 md:h-auto">
              <iframe
                title="14Group Location"
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                <MapPinIcon /> Lokasi Toko
              </p>
              <h3 className="text-xl font-black text-white mb-3">Temukan Kami</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">{address}</p>
              <p className="text-yellow-400 text-xs font-bold mb-5">Dekat lampu merah, Gresik</p>

              <div className="space-y-2 mb-5">
                {[
                  { icon: "📱", label: "HP Service", value: "08.00 - 21.00" },
                  { icon: "🛒", label: "Buka Jual Beli HP", value: "08.00 - 21.00" },
                  { icon: "☕", label: "Barbershop & Cafe", value: "10.00 - 22.00" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 text-xs">
                    <span>{l.icon}</span>
                    <span className="text-gray-400 w-28">{l.label}</span>
                    <span className="text-white font-bold">{l.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20service%20HP`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-400 transition-colors"
                >
                  <WaIcon className="w-4 h-4" />
                  Chat Sekarang
                </a>
                <a
                  href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                >
                  <MapPinIcon />
                  Buka Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="bg-yellow-400 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto reveal">
          <h2 className="text-3xl font-black text-black mb-3">
            HP Rusak? Servis Sekarang!
          </h2>
          <p className="text-black/60 text-sm mb-6 leading-relaxed">
            Jangan ditunda — semakin cepat ditangani, semakin murah dan semakin bagus hasilnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Sobat14%2C%20saya%20ingin%20service%20HP`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <WaIcon className="w-4 h-4" />
              Chat via WhatsApp
            </a>
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              Isi Testimoni
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}