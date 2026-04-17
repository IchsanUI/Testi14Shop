'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Testimonial = {
  id: string
  name: string
  services: string
  rating: number
  message: string
  photo: string | null
  featured: boolean
  createdAt: string
}

export default function MediaManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured' | 'hidden'>('all')

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/testimonials?approved=true')
      const data = await response.json()

      if (data.success) {
        // Only keep testimonials that have photos
        const withPhotos = data.testimonials.filter((t: Testimonial) => t.photo)
        setTestimonials(withPhotos)
      } else {
        setError('Gagal memuat media')
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setError('Terjadi kesalahan saat memuat media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleToggle = async (id: string) => {
    setToggling(id)
    try {
      const testimonial = testimonials.find(t => t.id === id)
      const response = await fetch(`/api/admin/testimonials/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !testimonial?.featured }),
      })
      const data = await response.json()

      if (data.success) {
        setTestimonials(prev =>
          prev.map(t => t.id === id ? { ...t, featured: data.featured } : t)
        )
      } else {
        setError(data.error || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      setError('Terjadi kesalahan')
    } finally {
      setToggling(null)
    }
  }

  const filtered = testimonials.filter(t => {
    if (filter === 'featured') return t.featured
    if (filter === 'hidden') return !t.featured
    return true
  })

  const featuredCount = testimonials.filter(t => t.featured).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Media Gallery</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pilih foto yang akan ditampilkan di carousel halaman utama.
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black text-white">
              {featuredCount} ditampilkan
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'featured', 'hidden'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'featured' ? 'Ditampilkan' : 'Disembunyikan'}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p className="text-gray-400 font-medium">
            {filter === 'featured' ? 'Belum ada foto yang ditampilkan' : filter === 'hidden' ? 'Semua foto sedang ditampilkan' : 'Belum ada foto'}
          </p>
          <p className="text-gray-300 text-sm mt-1">
            {filter === 'all' ? 'Testimoni yang disetujui dan memiliki foto akan muncul di sini' : 'Ubah filter untuk melihat foto lain'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                t.featured ? 'border-black' : 'border-gray-200'
              }`}
            >
              {/* Photo */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={t.photo!}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity ${t.featured ? 'bg-black/0' : 'bg-black/30'}`}>
                {t.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Ditampilkan
                    </span>
                  </div>
                )}
              </div>

              {/* Toggle Button */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <button
                  onClick={() => handleToggle(t.id)}
                  disabled={toggling === t.id}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    t.featured
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  } ${toggling === t.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {toggling === t.id ? (
                    <div className="w-4 h-4 border-2 border-t-current border-r-transparent border-b-transparent rounded-full animate-spin"/>
                  ) : t.featured ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                      </svg>
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Tampilkan
                    </>
                  )}
                </button>
              </div>

              {/* Name badge */}
              <div className="absolute top-2 right-2">
                <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  {t.name.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}