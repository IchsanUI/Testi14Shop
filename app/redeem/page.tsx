import Link from "next/link";
import Image from "next/image";
import RedeemForm from "@/components/RedeemForm";

export const metadata = {
  title: "Redeem Voucher - 14Group",
  description: "Tukarkan kode redeem voucher di 14Group",
};

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top accent bar */}
      {/* <div className="h-1 bg-black" /> */}

      <div className="max-w-md mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-8"
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

          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo-saja.png"
              alt="14Group"
              width={120}
              height={43}
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Tukar Kode Redeem
          </h1>
          <p className="text-gray-500">
            Masukkan kode 6 digit yang diberikan oleh admin untuk mendapatkan
            voucher Anda
          </p>
        </div>

        {/* Form */}
        <RedeemForm />
      </div>
    </div>
  );
}
