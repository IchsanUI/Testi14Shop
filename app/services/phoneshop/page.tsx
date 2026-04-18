"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { phones, brands, comparisonCategories, specLabels, type PhoneSpec } from "@/lib/phoneSpecs";

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

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

// ── Jadwal ─────────────────────────────────────────────
const schedule = [
  { day: "Senin", hours: "08.00 - 21.00" },
  { day: "Selasa", hours: "08.00 - 21.00" },
  { day: "Rabu", hours: "08.00 - 21.00" },
  { day: "Kamis", hours: "08.00 - 21.00" },
  { day: "Jumat", hours: "08.00 - 21.00" },
  { day: "Sabtu", hours: "08.00 - 21.00" },
  { day: "Minggu", hours: "09.00 - 20.00" },
];
const today = new Date().getDay();
const dayMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const currentDayName = dayMap[today];

const address = "Jl. Comandante Sudirman No.134, Kramatandap, Gapurosukolilo, Gresik, Jawa Timur 61111";
const coords = { lat: -7.170131155428334, lng: 112.65387677384109 };

// ── Toko Photo ──────────────────────────────────────────
const storePhotos = [
  { src: "https://images.unsplash.com/photo-1592750475338-5f1d4a2e6f6b?w=600&q=80", alt: "Toko iPhoneshop.14 - Apple Products", label: "iPhoneshop.14" },
  { src: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80", alt: "Toko Empatbelas Cell - HP Android", label: "Empatbelas Cell" },
  { src: "https://images.unsplash.com/photo-1563191911-e65f4c9e80b2?w=600&q=80", alt: "Koleksi HP di etalase toko", label: "Etalase Toko" },
];

// ── Perbandingan Brand ──────────────────────────────────
const brandComparison = [
  { brand: "iPhone", color: "text-white", bg: "bg-white", icon: <AppleIcon /> },
  { brand: "Samsung", color: "text-blue-400", bg: "bg-blue-500", icon: <AndroidIcon /> },
  { brand: "Xiaomi", color: "text-orange-400", bg: "bg-orange-500", icon: <AndroidIcon /> },
  { brand: "Oppo", color: "text-green-400", bg: "bg-green-500", icon: <AndroidIcon /> },
  { brand: "Vivo", color: "text-cyan-400", bg: "bg-cyan-500", icon: <AndroidIcon /> },
  { brand: "Realme", color: "text-yellow-400", bg: "bg-yellow-500", icon: <AndroidIcon /> },
];

const comparisonData = [
  { feature: "Jenis Device", iphone: "iPhone, iPad, Mac, Watch", android: "Samsung, Xiaomi, Oppo, Vivo, Realme + lainnya" },
  { feature: "Kisaran Harga", iphone: "Rp 2jt - 30jt+", android: "Rp 500rb - 15jt" },
  { feature: "OS", iphone: "iOS", android: "Android (One UI, MIUI, ColorOS, dll)" },
  { feature: "Tukar Tambah", iphone: "Apple Trade In", android: "Semua brand diterima" },
  { feature: "Garansi", iphone: "Resmi Apple + AppleCare+", android: "Garansi toko / distributor" },
  { feature: "Pembayaran", iphone: "COD, transfer, cicilan", android: "COD, transfer, cash" },
  { feature: "Demo Unit", iphone: "Ya — bisa langsung coba", android: "Ya — langsung cek fisik" },
];

// ── HP Comparison Feature ────────────────────────────────
function CompareSection() {
  const [selected, setSelected] = useState<[PhoneSpec | null, PhoneSpec | null]>([null, null]);
  const [activeCategory, setActiveCategory] = useState<string>(comparisonCategories[0].label);
  const [search, setSearch] = useState<[string, string]>(["", ""]);
  const [showPicker, setShowPicker] = useState<0 | 1 | null>(null);

  const filtered = (slot: 0 | 1) => {
    const q = search[slot].toLowerCase();
    return phones.filter(
      (p) =>
        (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) &&
        (slot === 0 ? p.id !== selected[1]?.id : p.id !== selected[0]?.id)
    );
  };

  const pickPhone = (phone: PhoneSpec, slot: 0 | 1) => {
    const next: [PhoneSpec | null, PhoneSpec | null] = [...selected];
    next[slot] = phone;
    setSelected(next);
    setShowPicker(null);
    setSearch(["", ""]);
  };

  const clearSlot = (slot: 0 | 1) => {
    const next: [PhoneSpec | null, PhoneSpec | null] = [...selected];
    next[slot] = null;
    setSelected(next);
  };

  const isDifferent = (specKey: keyof PhoneSpec["specs"]) => {
    if (!selected[0] || !selected[1]) return false;
    return selected[0].specs[specKey] !== selected[1].specs[specKey];
  };

  const catSpecs = comparisonCategories.find((c) => c.label === activeCategory)?.specs ?? [];

  return (
    <section className="max-w-5xl mx-auto px-4 pb-12">
      <div className="reveal">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-base font-black text-white">Bandingkan HP</h2>
        </div>
        <p className="text-gray-500 text-xs mb-5">Pilih 2 HP untuk melihat perbedaan spesifikasi secara langsung</p>

        {/* Phone Slots */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[0, 1].map((slot) => {
            const phone = selected[slot];
            return (
              <div key={slot}>
                {phone ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group">
                    <button
                      onClick={() => clearSlot(slot as 0 | 1)}
                      className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-500 transition-colors"
                    >
                      ✕
                    </button>
                    <div className="relative h-32">
                      <Image src={phone.imageUrl} alt={phone.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className="p-3">
                      <span className="text-[9px] font-black text-yellow-400 uppercase">{phone.brand}</span>
                      <p className="text-white text-xs font-bold leading-tight">{phone.name}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{phone.specs.screenSize} · {phone.specs.processor}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowPicker(slot as 0 | 1); setSearch(["", ""]); }}
                    className="w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-yellow-400/60 hover:bg-yellow-400/5 transition-all text-gray-500 hover:text-yellow-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs font-bold">Pilih HP {slot === 0 ? "1" : "2"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* VS Badge */}
        {selected[0] && selected[1] && (
          <div className="flex justify-center mb-3">
            <span className="bg-yellow-400 text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
              vs · Bandingkan
            </span>
          </div>
        )}

        {/* Phone Picker Dropdown */}
        {showPicker !== null && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari nama HP..."
                  value={search[showPicker]}
                  onChange={(e) => {
                    const next = [...search] as [string, string];
                    next[showPicker] = e.target.value;
                    setSearch(next);
                  }}
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-yellow-400/60"
                />
              </div>
              <button
                onClick={() => setShowPicker(null)}
                className="text-gray-500 hover:text-white text-xs px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
            </div>

            {/* Brand filter chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Semua", ...brands].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    const q = b === "Semua" ? "" : b.toLowerCase();
                    const next = [...search] as [string, string];
                    next[showPicker] = q;
                    setSearch(next);
                  }}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors ${search[showPicker] === (b === "Semua" ? "" : b.toLowerCase())
                      ? "bg-yellow-400 text-black"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                    }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Phone list */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filtered(showPicker as 0 | 1).length === 0 ? (
                <p className="text-center text-gray-500 text-xs py-4">Tidak ada HP yang cocok</p>
              ) : (
                filtered(showPicker as 0 | 1).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => pickPhone(p, showPicker as 0 | 1)}
                    className="w-full flex items-center gap-3 bg-white/5 hover:bg-yellow-400/10 border border-white/5 hover:border-yellow-400/30 rounded-xl px-3 py-2.5 transition-all text-left"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate">{p.name}</p>
                      <p className="text-gray-500 text-[10px]">{p.brand} · {p.priceRange}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selected[0] && selected[1] && (
          <>
            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {comparisonCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-xl transition-colors ${activeCategory === cat.label
                      ? "bg-yellow-400 text-black"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                    }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Spec rows */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-white/10">
                <div className="px-4 py-3 bg-white/3" />
                {[selected[0], selected[1]].map((p, i) => (
                  <div key={p.id} className={`px-4 py-3 text-center border-l border-white/10 ${i === 1 ? "bg-white/3" : ""}`}>
                    <p className="text-[9px] font-black text-yellow-400 uppercase">{p.brand}</p>
                    <p className="text-white text-xs font-bold leading-tight">{p.name}</p>
                  </div>
                ))}
              </div>

              {/* Spec rows */}
              {catSpecs.map((specKey) => {
                const diff = isDifferent(specKey);
                return (
                  <div
                    key={specKey}
                    className={`grid grid-cols-3 border-b border-white/5 last:border-0 ${diff ? "bg-yellow-400/5" : ""}`}
                  >
                    <div className="px-4 py-2.5 flex items-center">
                      <p className="text-gray-500 text-xs">{specLabels[specKey]}</p>
                    </div>
                    {[0, 1].map((i) => (
                      <div key={i} className={`px-4 py-2.5 text-center border-l border-white/10 ${i === 1 ? "" : ""}`}>
                        <p className={`text-xs font-medium leading-snug ${diff ? "text-white" : "text-gray-300"}`}>
                          {selected[i]?.specs[specKey]}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Highlight diff count */}
            {(() => {
              const diffCount = (comparisonCategories.find((c) => c.label === activeCategory)?.specs ?? []).filter(isDifferent).length;
              return (
                <p className="text-center text-gray-600 text-[10px] mt-2">
                  {diffCount} perbedaan ditemukan di kategori "{activeCategory}"
                </p>
              );
            })()}
          </>
        )}

        {!selected[0] && !selected[1] && (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-gray-400 text-sm font-bold">Pilih 2 HP untuk memulai perbandingan</p>
            <p className="text-gray-600 text-xs mt-1">Bandingkan spesifikasi, kamera, baterai, dan fitur lainnya</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Store info ──────────────────────────────────────────
const stores = [
  {
    id: "iphoneshop",
    name: "iPhoneshop.14",
    tagline: "Spesialis Apple",
    color: "white",
    accentBg: "bg-white",
    accentText: "text-black",
    waMsg: "Halo%20Sobat14%2C%20saya%20tertarik%20dengan%20iPhone%20di%20iPhoneshop.14",
    cta: "Chat iPhoneshop.14",
    description:
      "Fokus pada produk Apple — iPhone, iPad, Mac, AirPods, Apple Watch, dan aksesoris resmi. Cocok untuk Sobat14 yang menginginkan ekosistem Apple dengan layanan lengkap dan support resmi.",
    products: [
      "iPhone (semua seri)",
      "iPad & iPad Air / Pro",
      "MacBook & iMac",
      "AirPods & Apple Watch",
      "Aksesoris resmi Apple",
      "Apple Trade In",
    ],
    highlights: [
      "Konsultasi produk gratis",
      "Garansi resmi Apple",
      "Demo unit tersedia",
      "COD & cicilan tersedia",
    ],
    heroImage: "https://images.unsplash.com/photo-1592750475338-5f1d4a2e6f6b?w=800&q=80",
  },
  {
    id: "empatbelas-cell",
    name: "Empatbelas Cell",
    tagline: "Spesialis Android",
    color: "text-green-400",
    accentBg: "bg-green-500",
    accentText: "text-white",
    waMsg: "Halo%20Sobat14%2C%20saya%20tertarik%20dengan%20HP%20Android%20di%20Empatbelas%20Cell",
    cta: "Chat Empatbelas Cell",
    description:
      "HP Android lengkap — Samsung, Xiaomi, Oppo, Vivo, Realme, dan lainnya. Harga bersahabat, cocok untuk Sobat14 yang butuh HP berkualitas dengan budget smart dan banyak pilihan.",
    products: [
      "Samsung Galaxy series",
      "Xiaomi & Redmi / POCO",
      "Oppo & Realme",
      "Vivo & iQOO",
      "Feature phone",
      "Aksesoris semua brand",
    ],
    highlights: [
      "Semua brand tersedia",
      "Pilih sesuai budget",
      "Garansi after sales",
      "COD & transfer tersedia",
    ],
    heroImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
  },
];

export default function PhoneShopPage() {
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
                Jual Beli Handphone
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Dua Toko HP dalam
                <br />
                <span className="text-yellow-400">Satu Kelompok</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                iPhoneshop.14 untuk Apple, Empatbelas Cell untuk Android — lokasi
                sama, jam buka sama, servis sama. Pilih sesuai kebutuhan!
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-400 transition-colors"
              >
                <WaIcon className="w-4 h-4" />
                Chat Sekarang
              </a>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image
                  src="https://images.unsplash.com/photo-1563191911-e65f4c9e80b2?w=800&q=80"
                  alt="Toko HP 14Group"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-sm font-bold">Etalase Lengkap</p>
                  <p className="text-gray-300 text-xs">HP baru & bekas berkualitas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── JADWAL + PERBANDINGAN ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Jadwal */}
          <div className="lg:col-span-1 reveal">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${isToday ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-white/5"}`}
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

          {/* Perbandingan Brand */}
          <div className="lg:col-span-2 reveal reveal-delay-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-base font-black text-white">Perbandingan Brand</h2>
              </div>

              {/* Brand chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {brandComparison.map((b) => (
                  <span key={b.brand} className={`flex items-center gap-1.5 ${b.bg} ${b.color} text-[10px] font-black px-3 py-1.5 rounded-full`}>
                    {b.icon}
                    {b.brand}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                {comparisonData.map((row) => (
                  <div key={row.feature} className="bg-white/5 rounded-xl px-4 py-3 grid grid-cols-3 gap-4">
                    <p className="text-gray-500 text-xs font-semibold">{row.feature}</p>
                    <p className="text-gray-200 text-xs font-medium border-l border-white/10 pl-3">{row.iphone}</p>
                    <p className="text-gray-200 text-xs font-medium border-l border-white/10 pl-3">{row.android}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HP COMPARISON ─── */}
      <CompareSection />

      {/* ─── DUA TOKO ─── */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="text-center mb-8 reveal">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Toko Kami
          </span>
          <h2 className="text-2xl font-black text-white">Pilih Toko sesuai Kebutuhan</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <div key={store.id} id={store.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              {/* Hero image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={store.heroImage}
                  alt={store.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className={`${store.accentBg} ${store.accentText} text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                    {store.tagline}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1 leading-tight">{store.name}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{store.description}</p>

                {/* Products */}
                <div className="mb-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Produk</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {store.products.map((p) => (
                      <div key={p} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-2">
                        <span className="text-green-400 text-xs flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-gray-300 text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {store.highlights.map((h) => (
                    <span key={h} className="bg-yellow-400/10 text-yellow-400 text-[10px] font-bold px-3 py-1.5 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${store.waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full ${store.accentBg} ${store.accentText} font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <WaIcon className="w-4 h-4" />
                  {store.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOTO TOKO ─── */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="text-center mb-8 reveal">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Galeri Toko
          </span>
          <h2 className="text-2xl font-black text-white">Lihat Langsung Toko Kami</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {storePhotos.map((photo, i) => (
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
                  { label: "📱 Jual Beli HP", value: "08.00 - 21.00" },
                  { label: "🔧 Service HP", value: "08.00 - 21.00" },
                  { label: "✂️ Barbershop & Cafe", value: "10.00 - 22.00" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-28">{l.label}</span>
                    <span className="text-white font-bold">{l.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
            Puas dengan Layanan Kami?
          </h2>
          <p className="text-black/60 text-sm mb-6 leading-relaxed">
            Ceritakan pengalamanmu dan dapatkan voucher diskon spesial!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Isi Testimoni
              <ArrowRightIcon />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              <WaIcon className="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}