'use client'

import { useState, useEffect, useRef } from 'react'

type Banner = {
  id: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
  createdAt: string
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [setActive, setSetActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      if (data.success) setBanners(data.banners)
    } catch {
      setError('Gagal memuat banner')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBanners() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 5MB.')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setImageUrl(data.url)
        setSuccess('Gambar berhasil diupload')
      } else {
        setError(data.error || 'Gagal upload gambar')
        setPreview(null)
      }
    } catch {
      setError('Terjadi kesalahan saat upload')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim()) {
      setError('Upload gambar terlebih dahulu')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageUrl.trim(), linkUrl: linkUrl.trim() || null, active: setActive }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Banner berhasil ditambahkan')
        setImageUrl('')
        setLinkUrl('')
        setSetActive(false)
        setPreview(null)
        fetchBanners()
      } else {
        setError(data.error || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus banner ini?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setBanners(prev => prev.filter(b => b.id !== id))
        setSuccess('Banner dihapus')
      }
    } catch {
      setError('Gagal menghapus')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    const newActive = !banner.active
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActive }),
      })
      const data = await res.json()
      if (data.success) {
        setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: newActive } : { ...b, active: false }))
        setSuccess(newActive ? 'Banner diaktifkan' : 'Banner dinonaktifkan')
      }
    } catch {
      setError('Gagal mengaktifkan banner')
    }
  }

  return (
    <div className="space-y-8">
      {/* Add Banner Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-black mb-4">Tambah Banner</h2>

        {/* Upload Area */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Banner *</label>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Dropzone / Preview */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${
              preview
                ? 'border-black bg-gray-50'
                : 'border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                <p className="text-sm text-gray-500 font-medium">Mengupload...</p>
              </div>
            ) : preview ? (
              <div className="relative w-full h-full">
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
                  <p className="text-white font-semibold opacity-0 hover:opacity-100 transition-opacity text-sm">
                    Klik untuk ganti gambar
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Klik untuk upload gambar</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — Maksimal 5MB</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Ukuran disarankan: <strong>1080 x 600 px</strong> (rasio 16:9) atau <strong>800 x 800 px</strong> (persegi)
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link (opsional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://wa.me/628... atau biarkan kosong"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSetActive(v => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setActive ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-600">Aktifkan sebagai banner utama</span>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={saving || !imageUrl}
            className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Banner'}
          </button>
        </form>
      </div>

      {/* Banner List */}
      <div>
        <h2 className="text-lg font-bold text-black mb-4">
          Daftar Banner ({banners.length})
        </h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Belum ada banner</p>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map(banner => (
              <div
                key={banner.id}
                className={`flex items-center gap-4 bg-white border rounded-2xl p-4 ${banner.active ? 'border-black' : 'border-gray-200'}`}
              >
                <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={banner.imageUrl} alt="banner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{banner.imageUrl}</p>
                  {banner.linkUrl && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{banner.linkUrl}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {banner.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    disabled={deleting === banner.id}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    {deleting === banner.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}