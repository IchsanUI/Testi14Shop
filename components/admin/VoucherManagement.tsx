'use client'

import { useState, useEffect } from 'react'
import { formatRupiah, formatRupiahWithZero, formatDiscount } from '@/lib/format'

type Voucher = {
  id: string
  name: string
  code: string
  value: number
  valueType: string
  minPurchase: bigint
  quota: number
  used: number
  transactionCount: number
  probability: number
  active: boolean
  expiryDays: number
  createdAt: string
}

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    valueType: 'percentage',
    minPurchase: 0,
    quota: 0,
    probability: 0,
    expiryDays: 7,
    active: true,
  })

  const fetchVouchers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/vouchers')
      const data = await response.json()

      if (data.success) {
        setVouchers(data.vouchers)
      } else {
        setError('Gagal memuat voucher')
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      setError('Terjadi kesalahan saat memuat voucher')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingVoucher
        ? `/api/admin/vouchers/${editingVoucher.id}`
        : '/api/admin/vouchers'

      const method = editingVoucher ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          code: formData.name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 12),
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchVouchers()
        setShowForm(false)
        setEditingVoucher(null)
        setFormData({
          name: '',
          value: 0,
          valueType: 'percentage',
          minPurchase: 0,
          quota: 0,
          probability: 0,
          expiryDays: 7,
          active: true,
        })
      } else {
        setError(data.error || 'Gagal menyimpan voucher')
      }
    } catch (error) {
      console.error('Error saving voucher:', error)
      setError('Terjadi kesalahan saat menyimpan voucher')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      name: voucher.name,
      value: voucher.value,
      valueType: voucher.valueType || 'percentage',
      minPurchase: Number(voucher.minPurchase ?? BigInt(0)),
      quota: voucher.quota,
      probability: voucher.probability,
      expiryDays: voucher.expiryDays ?? 7,
      active: voucher.active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus voucher ini?')) return

    try {
      const response = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchVouchers()
      }
    } catch (error) {
      console.error('Error deleting voucher:', error)
    }
  }

  const handleToggleActive = async (voucher: Voucher) => {
    try {
      const response = await fetch(`/api/admin/vouchers/${voucher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...voucher, active: !voucher.active }),
      })

      const data = await response.json()

      if (data.success) {
        fetchVouchers()
      }
    } catch (error) {
      console.error('Error toggling voucher status:', error)
    }
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

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingVoucher(null)
            setFormData({
              name: '',
              value: 0,
              valueType: 'percentage',
              minPurchase: 0,
              quota: 0,
              probability: 0,
              expiryDays: 7,
              active: true,
            })
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showForm ? 'Tutup Form' : 'Tambah Voucher'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {editingVoucher ? 'Edit Voucher' : 'Tambah Voucher Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Voucher
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({ ...formData, name })
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Voucher
                </label>
                <input
                  type="text"
                  value={formData.name
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .substring(0, 12) || ''}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Diisi otomatis dari nama voucher
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Diskon
                </label>
                <select
                  value={formData.valueType}
                  onChange={(e) =>
                    setFormData({ ...formData, valueType: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                >
                  <option value="percentage">Persen (%)</option>
                  <option value="fixed">Rupiah (Rp)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai Diskon {formData.valueType === 'percentage' ? '(%)' : '(Rp)'}
                </label>
                {formData.valueType === 'fixed' ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={formData.value > 0 ? Number(formData.value).toLocaleString('id-ID') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, value: parseInt(raw) || 0 })
                      }}
                      placeholder="50.000"
                      className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white text-right"
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.value ?? 0}
                    onChange={(e) =>
                      setFormData({ ...formData, value: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                    required
                  />
                )}
                {formData.value > 0 && formData.valueType === 'fixed' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: {formatRupiah(formData.value)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Pembelian (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={(formData.minPurchase ?? 0) > 0 ? Number(formData.minPurchase).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '')
                      setFormData({ ...formData, minPurchase: parseInt(raw) || 0 })
                    }}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white text-right"
                  />
                </div>
                {(formData.minPurchase ?? 0) > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: {formatRupiah(formData.minPurchase)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuota
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quota ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probabilitas (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability ?? 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      probability: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Masa Berlaku (hari)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.expiryDays ?? 7}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiryDays: parseInt(e.target.value) || 7,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 bg-white"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aktif
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingVoucher(null)
                  setFormData({
                    name: '',
                    value: 0,
                    valueType: 'percentage',
                    minPurchase: 0,
                    quota: 0,
                    probability: 0,
                    expiryDays: 7,
                    active: true,
                  })
                }}
                className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingVoucher ? 'Updating...' : 'Menyimpan...'}
                  </>
                ) : (
                  editingVoucher ? 'Update' : 'Simpan'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

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
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diskon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Pembelian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kuota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probabilitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Masa Berlaku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada voucher
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {voucher.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-black">
                        {voucher.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">
                        {formatDiscount(voucher.value, voucher.valueType as 'percentage' | 'fixed')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-black">
                        {formatRupiahWithZero(voucher.minPurchase)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black">
                          {voucher.used}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-sm text-gray-500">
                          {voucher.quota}
                        </span>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            voucher.used >= voucher.quota
                              ? 'bg-red-500'
                              : voucher.used >= voucher.quota * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((voucher.used / voucher.quota) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
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
                        <span className="text-sm font-semibold text-green-600">
                          {voucher.transactionCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-black">
                        {voucher.probability}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-black"
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
                        <span>{voucher.expiryDays} hari</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voucher.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(voucher)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            voucher.active
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {voucher.active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-black hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
