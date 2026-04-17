'use client'

import { useState, useEffect } from 'react'

type LogEntry = {
  id: string
  userId: string
  role: string
  action: string
  description: string
  metadata: any
  ipAddress: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
}

type ActionLabels = {
  [key: string]: string
}

const actionLabels: ActionLabels = {
  login: 'Login',
  logout: 'Logout',
  create_voucher: 'Membuat Voucher',
  update_voucher: 'Mengupdate Voucher',
  delete_voucher: 'Menghapus Voucher',
  redeem_voucher: 'Menukarkan Voucher',
  verify_voucher: 'Verifikasi Voucher',
  approve_testimonial: 'Menyetujui Testimoni',
  reject_testimonial: 'Menolak Testimoni',
  create_user: 'Membuat User',
  update_user: 'Mengupdate User',
  delete_user: 'Menghapus User',
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterAction, setFilterAction] = useState<string>('')
  const [filterUser, setFilterUser] = useState<string>('')

  useEffect(() => {
    fetchLogs()
  }, [page, filterAction, filterUser])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })

      if (filterAction) {
        params.set('action', filterAction)
      }
      if (filterUser) {
        params.set('userId', filterUser)
      }

      const response = await fetch(`/api/admin/activity-logs?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data log')
      }

      setLogs(data.logs)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('login') || action.includes('logout')) return 'bg-blue-100 text-blue-700'
    if (action.includes('create')) return 'bg-green-100 text-green-700'
    if (action.includes('delete')) return 'bg-red-100 text-red-700'
    if (action.includes('update')) return 'bg-yellow-100 text-yellow-700'
    if (action.includes('redeem') || action.includes('approve')) return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Activity Logs
          </h2>
          <p className="text-gray-600 mt-1">
            Riwayat aktivitas semua admin
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm"
          >
            <option value="">Semua Aksi</option>
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter User ID..."
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm"
          />

          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data log
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-black">
                          {log.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Halaman {page} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
