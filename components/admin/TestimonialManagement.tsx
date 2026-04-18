'use client'

import { useState, useEffect, useCallback } from 'react'

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
  createdAt: string
  redeemCode: RedeemCodeData
  voucherStatusLabel: string
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalFiltered: number
  totalPages: number
}

const SERVICE_OPTIONS = [
  'Pembelian HP', 'Tukar Tambah', 'COD',
  'Jual Beli', 'Service HP', 'Barbershop', 'Cafe',
]

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [generatedCode, setGeneratedCode] = useState<{ code: string; customer: string; whatsapp?: string } | null>(null)

  // ── Filter & search state
  const [search, setSearch] = useState('')
  const [approvedFilter, setApprovedFilter] = useState<string>('all')
  const [voucherStatusFilter, setVoucherStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // ── Pagination
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1, limit: 10, total: 0, totalFiltered: 0, totalPages: 0,
  })

  const fetchTestimonials = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim())                 params.set('search', search.trim())
      if (approvedFilter !== 'all')      params.set('approved', approvedFilter === 'approved' ? 'true' : 'false')
      if (voucherStatusFilter !== 'all') params.set('voucherStatus', voucherStatusFilter)
      if (serviceFilter)                 params.set('service', serviceFilter)
      if (dateFrom)                      params.set('dateFrom', dateFrom)
      if (dateTo)                        params.set('dateTo', dateTo)
      params.set('page', String(page))
      params.set('limit', String(pagination.limit))

      const response = await fetch(`/api/admin/testimonials?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.testimonials)
        setPagination(data.pagination)
      } else {
        setError('Gagal memuat testimoni')
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      setError('Terjadi kesalahan saat memuat testimoni')
    } finally {
      setLoading(false)
    }
  }, [search, approvedFilter, voucherStatusFilter, serviceFilter, dateFrom, dateTo, pagination.limit])

  useEffect(() => {
    fetchTestimonials(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedFilter, voucherStatusFilter, serviceFilter, dateFrom, dateTo])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTestimonials(1)
    }, 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    fetchTestimonials(newPage)
  }

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        if (data.redeemCode) {
          const testimonial = testimonials.find(t => t.id === id)
          setGeneratedCode({ code: data.redeemCode, customer: testimonial?.name || '', whatsapp: data.whatsapp })
          setShowCodeModal(true)
        }
        fetchTestimonials(pagination.page)
      } else {
        setError(data.error || 'Gagal menyetujui testimoni')
      }
    } catch (err) {
      console.error('Error approving testimonial:', err)
      setError('Terjadi kesalahan saat menyetujui testimoni')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        fetchTestimonials(pagination.page)
      } else {
        setError('Gagal menolak testimoni')
      }
    } catch (err) {
      console.error('Error rejecting testimonial:', err)
      setError('Terjadi kesalahan saat menolak testimoni')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateCode = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/redeem-code`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setGeneratedCode({ code: data.code, customer: data.customer.name, whatsapp: data.customer.whatsapp })
        setShowCodeModal(true)
        fetchTestimonials(pagination.page)
      } else {
        setError(data.error || 'Gagal membuat kode redeem')
      }
    } catch (err) {
      console.error('Error generating redeem code:', err)
      setError('Terjadi kesalahan saat membuat kode redeem')
    } finally {
      setActionLoading(null)
    }
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))

  const voucherStatusBadge = (label: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      used:         { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Sudah Digunakan' },
      active:       { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Aktif' },
      code_created: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Kode Terbuat' },
      redeem_failed:{ bg: 'bg-red-100',    text: 'text-red-800',    label: 'Redeem Gagal' },
      none:         { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Belum Ada' },
    }
    const s = map[label] ?? map.none
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
  }

  return (
    <div className="space-y-5">

      {/* ── Error ── */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 ml-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, WhatsApp, atau pesan testimoni..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 bg-white text-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(''); fetchTestimonials(1) }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Filter Row ── */}
      <div className="flex flex-wrap gap-3 items-end">

        {/* Status approval */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select
            value={approvedFilter}
            onChange={(e) => { setApprovedFilter(e.target.value); fetchTestimonials(1) }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-black focus:ring-0"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
          </select>
        </div>

        {/* Voucher status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Voucher</label>
          <select
            value={voucherStatusFilter}
            onChange={(e) => { setVoucherStatusFilter(e.target.value); fetchTestimonials(1) }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-black focus:ring-0"
          >
            <option value="all">Semua</option>
            <option value="none">Belum Ada</option>
            <option value="active">Aktif</option>
            <option value="used">Sudah Digunakan</option>
          </select>
        </div>

        {/* Service */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Layanan</label>
          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); fetchTestimonials(1) }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-black focus:ring-0"
          >
            <option value="">Semua Layanan</option>
            {SERVICE_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Dari Tanggal</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); fetchTestimonials(1) }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-black focus:ring-0"
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Sampai Tanggal</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); fetchTestimonials(1) }}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-black focus:ring-0"
          />
        </div>

        {/* Reset */}
        {(search || approvedFilter !== 'all' || voucherStatusFilter !== 'all' || serviceFilter || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSearch(''); setApprovedFilter('all'); setVoucherStatusFilter('all')
              setServiceFilter(''); setDateFrom(''); setDateTo('')
              fetchTestimonials(1)
            }}
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors self-end"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaksi</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada testimoni ditemukan
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    {/* Nama */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-black">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.whatsapp}</div>
                      {t.email && <div className="text-xs text-gray-400">{t.email}</div>}
                    </td>
                    {/* Transaksi */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-black">{t.transactionCount}x Transaksi</div>
                        <div className="text-sm font-semibold text-green-600">
                          Rp {(t.lastTransactionAmount || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </td>
                    {/* Layanan */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-black">{t.services}</td>
                    {/* Rating */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex space-x-0.5">{renderStars(t.rating)}</div>
                    </td>
                    {/* Voucher */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1.5">
                        {t.voucher && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t.voucher}
                          </span>
                        )}
                        {voucherStatusBadge(t.voucherStatusLabel)}
                        {t.redeemCode?.code && (
                          <div className="text-xs text-gray-400 font-mono">{t.redeemCode.code}</div>
                        )}
                      </div>
                    </td>
                    {/* Barcode */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {t.barcode ? (
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{t.barcode}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    {/* Kadaluarsa */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.voucherId ? (() => {
                        const exp = new Date(t.createdAt); exp.setDate(exp.getDate() + 7)
                        const isExp = new Date() > exp
                        return (
                          <div className="space-y-1">
                            <span className={isExp ? 'text-red-500' : ''}>{exp.toLocaleDateString('id-ID')}</span>
                            {isExp && <span className="block text-xs text-red-500 font-medium">Kadaluarsa</span>}
                          </div>
                        )
                      })() : '-'}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {t.approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Disetujui</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                      )}
                    </td>
                    {/* Tanggal */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedTestimonial(t)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Detail
                      </button>
                      {actionLoading === t.id ? (
                        <div className="inline-flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          <span className="text-gray-500">Memproses...</span>
                        </div>
                      ) : !t.approved ? (
                        <>
                          <button onClick={() => handleApprove(t.id)} className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50" disabled={actionLoading !== null}>Approve</button>
                          <button onClick={() => handleReject(t.id)} className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled={actionLoading !== null}>Tolak</button>
                        </>
                      ) : t.voucher ? (
                        <span className="text-xs text-gray-400">Selesai</span>
                      ) : (
                        <>
                          <button onClick={() => handleGenerateCode(t.id)} className="px-3 py-1 bg-black text-white text-xs rounded-lg hover:bg-gray-800 disabled:opacity-50" disabled={actionLoading !== null}>
                            {t.redeemCode?.used ? 'Buat Kode Ulang' : 'Buat Kode'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && testimonials.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-black">{testimonials.length}</span> dari{' '}
              <span className="font-medium text-black">{pagination.total}</span> testimoni
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const totalPages = pagination.totalPages
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-black text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Code Modal ── */}
      {showCodeModal && generatedCode && (() => {
        // Strip non-digits, then ensure it starts with 62 (Indonesia country code)
        let raw = (generatedCode.whatsapp ?? '').replace(/[^0-9]/g, '')
        if (raw.startsWith('0')) raw = '62' + raw.slice(1)
        const waMsg = encodeURIComponent(
          `Hai Sobat14, ${generatedCode.customer}! 🎉\n\nTestimoni kamu sudah kami terima dan disetujui! Terima kasih sudah berbagi pengalamanmu bersama 14Group. 💚\n\nSebagai apresiasi, kamu punya hadiah spesial! Kode redeem voucher kamu:\n\n🔑 ${generatedCode.code}\n\nCara klaimnya gampang banget:\n1. Buka link ini: https://14group.test/redeem\n2. Masukkan kode di atas\n3. Voucher langsung aktif! 🎁\n\n⚠️ Catatan penting:\n• Kode cuma berlaku 24 jam ya\n• Hanya bisa dipakai 1x\n• Screenshot kode biar aman\n\nKalau ada pertanyaan atau butuh bantuan, chat aja nomor ini. Sampai ketemu di toko ya! 👋\n\nSalam,\nTim 14Group ✨`
        );
        const waLink = raw.length >= 10 ? `https://wa.me/${raw}?text=${waMsg}` : null;

        return (
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
              {generatedCode.whatsapp && (
                <p className="text-xs text-gray-400 mt-1">{generatedCode.whatsapp}</p>
              )}
            </div>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Kode Redeem</p>
              <p className="text-4xl font-bold text-center tracking-widest text-black">{generatedCode.code}</p>
              <p className="text-xs text-gray-400 text-center mt-3">Berlaku 24 jam, hanya untuk 1x penggunaan</p>
            </div>
            <div className="space-y-3">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Kirim via WhatsApp
                </a>
              )}
              <button
                onClick={() => { setShowCodeModal(false); setGeneratedCode(null) }}
                className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
        )
      })()}

      {/* ── Detail Modal ── */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-black">Detail Testimoni</h3>
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo */}
            {selectedTestimonial.photo && (
              <div className="mb-4">
                <img
                  src={selectedTestimonial.photo}
                  alt="Foto testimoni"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Nama', value: selectedTestimonial.name },
                { label: 'WhatsApp', value: selectedTestimonial.whatsapp },
                { label: 'Email', value: selectedTestimonial.email || '-' },
                { label: 'Alamat', value: selectedTestimonial.address || '-' },
                { label: 'Layanan', value: selectedTestimonial.services },
                { label: 'Jumlah Transaksi', value: `${selectedTestimonial.transactionCount}x` },
                { label: 'Total Belanja', value: `Rp ${selectedTestimonial.lastTransactionAmount.toLocaleString('id-ID')}` },
                { label: 'Tanggal', value: new Date(selectedTestimonial.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map((row) => (
                <div key={row.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{row.label}</p>
                  <p className="text-sm font-semibold text-black">{row.value}</p>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="mb-4 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Rating</p>
              <div className="flex space-x-0.5">
                {renderStars(selectedTestimonial.rating)}
                <span className="ml-2 text-sm font-bold text-black">{selectedTestimonial.rating}/5</span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Pesan Testimoni</p>
              <p className="text-sm text-black leading-relaxed">{selectedTestimonial.message}</p>
            </div>

            {/* Voucher info */}
            <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs text-green-700 uppercase tracking-wide font-medium mb-2">Voucher</p>
              <div className="space-y-1.5">
                {selectedTestimonial.voucher ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-800">{selectedTestimonial.voucher}</span>
                      {voucherStatusBadge(selectedTestimonial.voucherStatusLabel)}
                    </div>
                    {selectedTestimonial.redeemCode?.code && (
                      <p className="text-xs text-green-600 font-mono">Kode: {selectedTestimonial.redeemCode.code}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada voucher</p>
                )}
              </div>
            </div>

            {/* Approval status */}
            <div className="mb-5 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Status</p>
              <div className="flex items-center gap-2">
                {selectedTestimonial.approved ? (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Disetujui</span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {!selectedTestimonial.approved ? (
                <>
                  <button
                    onClick={async () => {
                      await handleApprove(selectedTestimonial.id)
                      setSelectedTestimonial(null)
                    }}
                    disabled={!!actionLoading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-bold transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      await handleReject(selectedTestimonial.id)
                      setSelectedTestimonial(null)
                    }}
                    disabled={!!actionLoading}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 font-bold transition-colors"
                  >
                    Tolak
                  </button>
                </>
              ) : selectedTestimonial.voucher ? (
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold cursor-default">
                  Selesai
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await handleGenerateCode(selectedTestimonial.id)
                    setSelectedTestimonial(null)
                  }}
                  disabled={!!actionLoading}
                  className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-bold transition-colors"
                >
                  {selectedTestimonial.redeemCode?.used ? 'Buat Kode Ulang' : 'Buat Kode'}
                </button>
              )}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="w-full px-6 py-2.5 text-gray-500 hover:text-black text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}