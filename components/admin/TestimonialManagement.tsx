'use client'

import { useState, useEffect } from 'react'

type RedeemCodeData = {
  id: string
  code: string
  used: boolean
  usedAt: string | null
  expiresAt: string
} | null

type Testimonial = {
  id: string
  name: string
  whatsapp: string
  email: string | null
  address: string | null
  transactionCount: number
  lastTransactionAmount: number
  services: string
  rating: number
  message: string
  photo: string | null
  voucher: string | null
  voucherId: string | null
  barcode: string | null
  voucherRedeemed: boolean
  voucherUsed: boolean
  approved: boolean
  featured: boolean
  createdAt: string
  redeemCode: RedeemCodeData
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<{ code: string; customer: string } | null>(null)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const url =
        filter === 'all'
          ? '/api/admin/testimonials'
          : `/api/admin/testimonials?approved=${filter === 'approved'}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.testimonials)
      } else {
        setError('Gagal memuat testimoni')
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setError('Terjadi kesalahan saat memuat testimoni')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [filter])

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        if (data.redeemCode) {
          // Find customer name from the testimonials list before refresh
          const testimonial = testimonials.find(t => t.id === id)
          setGeneratedCode({ code: data.redeemCode, customer: testimonial?.name || '' })
          setShowCodeModal(true)
        }
        fetchTestimonials()
      } else {
        setError(data.error || 'Gagal menyetujui testimoni')
      }
    } catch (error) {
      console.error('Error approving testimonial:', error)
      setError('Terjadi kesalahan saat menyetujui testimoni')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        fetchTestimonials()
      } else {
        setError('Gagal menolak testimoni')
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error)
      setError('Terjadi kesalahan saat menolak testimoni')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateCode = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/redeem-code`, {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setGeneratedCode({ code: data.code, customer: data.customer.name })
        setShowCodeModal(true)
        fetchTestimonials()
      } else {
        setError(data.error || 'Gagal membuat kode redeem')
      }
    } catch (error) {
      console.error('Error generating redeem code:', error)
      setError('Terjadi kesalahan saat membuat kode redeem')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleFeatured = async (id: string) => {
    setActionLoading(id)
    try {
      const testimonial = testimonials.find(t => t.id === id)
      const response = await fetch(`/api/admin/testimonials/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !testimonial?.featured }),
      })
      const data = await response.json()

      if (data.success) {
        fetchTestimonials()
      } else {
        setError('Gagal mengubah status tampil')
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      setError('Terjadi kesalahan saat mengubah status tampil')
    } finally {
      setActionLoading(null)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          Filter:
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Disetujui
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voucher / Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kadaluarsa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada testimoni
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.whatsapp}
                      </div>
                      {testimonial.email && (
                        <div className="text-xs text-gray-400">
                          {testimonial.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-black">
                          {testimonial.transactionCount}x Transaksi
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          Rp {(testimonial.lastTransactionAmount || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        {testimonial.services}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-0.5">
                        {renderStars(testimonial.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const lastRedeem = testimonial.redeemCode
                        const hasRedeemCode = !!lastRedeem
                        const redeemUsed = lastRedeem?.used
                        const redeemHasVoucher = !!testimonial.voucher

                        // Case 1: Ada redeem code, sudah digunakan (redeem), tapi tidak ada voucher = gagal
                        if (hasRedeemCode && redeemUsed && !redeemHasVoucher) {
                          return (
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Redeem Gagal
                              </span>
                              <div className="text-xs text-gray-400 font-mono">{lastRedeem.code}</div>
                              {lastRedeem.usedAt && (
                                <div className="text-xs text-gray-400">
                                  {new Date(lastRedeem.usedAt).toLocaleDateString('id-ID')}
                                </div>
                              )}
                            </div>
                          )
                        }

                        // Case 2: Ada voucher
                        if (testimonial.voucher) {
                          return (
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {testimonial.voucher}
                              </span>
                              {testimonial.voucherUsed ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Sudah Digunakan
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Aktif
                                </span>
                              )}
                            </div>
                          )
                        }

                        // Case 3: Ada redeem code tapi belum digunakan
                        if (hasRedeemCode && !redeemUsed) {
                          return (
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Kode Terbuat
                              </span>
                              <div className="text-xs text-gray-400 font-mono">{lastRedeem.code}</div>
                              <div className="text-xs text-gray-400">
                                Berakhir {new Date(lastRedeem.expiresAt).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                          )
                        }

                        return <span className="text-sm text-gray-400">-</span>
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {testimonial.barcode ? (
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {testimonial.barcode}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonial.voucherId ? (
                        (() => {
                          const expiryDate = new Date(testimonial.createdAt)
                          expiryDate.setDate(expiryDate.getDate() + 7)
                          const now = new Date()
                          const isExpired = now > expiryDate
                          return (
                            <div className="space-y-1">
                              <span className={isExpired ? 'text-red-500' : ''}>
                                {expiryDate.toLocaleDateString('id-ID')}
                              </span>
                              {isExpired && (
                                <span className="block text-xs text-red-500 font-medium">Kadaluarsa</span>
                              )}
                            </div>
                          )
                        })()
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {testimonial.approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Disetujui
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {testimonial.photo ? (
                        <button
                          onClick={() => handleToggleFeatured(testimonial.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            testimonial.featured
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={testimonial.featured ? 'Klik untuk sembunyikan dari carousel' : 'Klik untuk tampilkan di carousel'}
                        >
                          {testimonial.featured ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                              Ditampilkan
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                              Sembunyikan
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Tidak ada foto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actionLoading === testimonial.id ? (
                        <div className="inline-flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          <span className="text-gray-500">Memproses...</span>
                        </div>
                      ) : !testimonial.approved ? (
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={actionLoading !== null}
                        >
                          Approve
                        </button>
                      ) : testimonial.voucher ? (
                        <span className="text-xs text-gray-400">Selesai</span>
                      ) : (
                        <button
                          onClick={() => handleGenerateCode(testimonial.id)}
                          className="px-3 py-1 bg-black text-white text-xs rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={actionLoading !== null}
                        >
                          {testimonial.redeemCode?.used ? 'Buat Kode Ulang' : 'Buat Kode'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Generated Modal */}
      {showCodeModal && generatedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Kode Redeem Dibuat!</h3>
              <p className="text-gray-500 text-sm">
                Berikan kode ini ke customer: <strong>{generatedCode.customer}</strong>
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Kode Redeem</p>
              <p className="text-4xl font-bold text-center tracking-widest text-black">
                {generatedCode.code}
              </p>
              <p className="text-xs text-gray-400 text-center mt-3">
                Berlaku 24 jam, hanya untuk 1x penggunaan
              </p>
            </div>

            <button
              onClick={() => {
                setShowCodeModal(false)
                setGeneratedCode(null)
              }}
              className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
