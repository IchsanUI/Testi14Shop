import Link from "next/link";
import RedeemForm from "@/components/RedeemForm";

export const metadata = {
  title: "Redeem Voucher - 14Group",
  description: "Tukarkan kode redeem voucher di 14Group",
};

export default function RedeemPage() {
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* ── HEADER ── */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
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
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Tukar <span className="text-yellow-400">Kode Voucher</span>
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Masukkan kode 6 digit dari admin untuk klaim voucher spesial
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 flex flex-col justify-start">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
            <RedeemForm />
          </div>
          <p className="text-center text-gray-600 text-xs mt-6 leading-relaxed">
            Tidak punya kode? Hubungi admin setelah testimoni Anda disetujui
          </p>
        </div>
      </div>
    </div>
  );
}
