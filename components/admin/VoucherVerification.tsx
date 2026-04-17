'use client'

import { useState } from 'react'
import { formatDiscount, formatRupiah } from '@/lib/format'

type VoucherResult = {
  valid: boolean
  message: string
  voucher?: {
    id: string
    name: string
    code: string
    value: number
    valueType?: string
    minPurchase?: number
  }
  customer?: {
    name: string
    whatsapp: string
    services: string
    rating: number
    message: string
    photo: string | null
    submittedAt: string
  }
  expiresAt?: string
  usedAt?: string
}

export default function VoucherVerification() {
  const [barcode, setBarcode] = useState('')
  const [result, setResult] = useState<VoucherResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent, redeem = false) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/vouchers/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: barcode.trim(), redeem }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memverifikasi voucher')
      }

      // Normalize null values from JSON serialization
      const normalizedData = {
        ...data,
        usedAt: data.usedAt === null ? undefined : data.usedAt,
      }

      setResult(normalizedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
      setRedeeming(false)
    }
  }

  const handleRedeem = async (e: React.FormEvent) => {
    setRedeeming(true)
    await handleVerify(e, true)
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black mb-4">
        Verifikasi & Gunakan Voucher
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Scan atau Masukkan Barcode
          </label>
          <input
            type="text"
            id="barcode"
            value={barcode}
            onChange={(e) => {
              setBarcode(e.target.value)
              setResult(null)
            }}
            placeholder="Contoh: VC-ABC12-XYZ789-123456"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading && !redeeming ? 'Memverifikasi...' : 'Verifikasi Voucher'}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div
          className={`mt-6 p-6 rounded-lg border-2 ${
            result.valid
              ? 'bg-green-50 border-green-400'
              : 'bg-red-50 border-red-400'
          }`}
        >
          <div className="flex items-start">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                result.valid
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              {result.valid ? (
                <svg
                  className="w-6 h-6 text-green-600"
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
              ) : (
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            <div className="ml-4 flex-1">
              <h4
                className={`text-lg font-semibold ${
                  result.valid
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {result.valid ? 'Voucher Valid' : 'Voucher Tidak Valid'}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  result.valid
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {result.message}
              </p>

              {result.voucher && (
                <div className="mt-4 space-y-4">
                  {/* Voucher Info */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Nama Voucher:
                      </span>
                      <span className="text-sm font-medium text-black">
                        {result.voucher.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Kode:
                      </span>
                      <span className="text-sm font-mono font-medium text-black">
                        {result.voucher.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Diskon:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {formatDiscount(result.voucher.value, result.voucher.valueType as 'percentage' | 'fixed')}
                      </span>
                    </div>
                    {result.voucher.minPurchase != null && result.voucher.minPurchase > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Min. Pembelian:
                        </span>
                        <span className="text-sm font-medium text-orange-600">
                          Rp {result.voucher.minPurchase.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  {result.customer && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-blue-900 border-b border-blue-200 pb-2">
                        Detail Pelanggan
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Nama:
                        </span>
                        <span className="text-sm font-medium text-black">
                          {result.customer.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          WhatsApp:
                        </span>
                        <span className="text-sm font-medium text-black">
                          {result.customer.whatsapp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Layanan:
                        </span>
                        <span className="text-sm font-medium text-black">
                          {result.customer.services}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Rating:
                        </span>
                        <div className="flex space-x-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < result.customer!.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-gray-600 block mb-1">
                          Pesan:
                        </span>
                        <p className="text-sm text-black bg-white p-2 rounded">
                          {result.customer.message}
                        </p>
                      </div>
                      {result.customer.photo && (
                        <div className="pt-2">
                          <span className="text-sm text-gray-600 block mb-1">
                            Foto:
                          </span>
                          <img
                            src={result.customer.photo}
                            alt="Customer photo"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs pt-2 border-t border-blue-200">
                        <span className="text-gray-500">
                          Tanggal Submit:
                        </span>
                        <span className="text-black font-medium">
                          {new Date(result.customer.submittedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {result.expiresAt && (
                        <div className="flex justify-between text-xs pt-2 border-t border-blue-200">
                          <span className="text-gray-500">
                            Kadaluarsa:
                          </span>
                          <span className="text-orange-600 font-medium">
                            {new Date(result.expiresAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {result.usedAt && (
                        <div className="flex justify-between text-xs pt-2 border-t border-green-200">
                          <span className="text-gray-500">
                            Digunakan:
                          </span>
                          <span className="text-green-600 font-medium">
                            {result.usedAt ? new Date(result.usedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Use Voucher Button */}
                  {result.valid && !result.usedAt && (
                    <button
                      onClick={handleRedeem}
                      disabled={redeeming}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
                    >
                      {redeeming ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Gunakan Voucher
                        </>
                      )}
                    </button>
                  )}

                  {/* Already Used */}
                  {result.valid && result.usedAt && (
                    <div className="p-4 bg-green-100 rounded-lg text-center">
                      <svg
                        className="w-8 h-8 text-green-600 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-green-800 font-semibold">
                        Voucher sudah digunakan
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
