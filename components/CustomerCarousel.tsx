'use client'

import { useState, useEffect, useCallback } from 'react'

type Testimonial = {
  id: string
  name: string
  services: string
  rating: number
  message: string
  photo: string | null
  createdAt: string
}

export default function CustomerCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials/public?limit=20')
      const data = await res.json()
      if (data.success) {
        setTestimonials(data.testimonials.filter((t: Testimonial) => t.photo))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const photos = testimonials.filter((t) => t.photo)
  const total = photos.length

  const goTo = useCallback((idx: number) => {
    if (total === 0) return
    setCurrentIndex(((idx % total) + total) % total)
  }, [total])

  useEffect(() => {
    if (isPaused || total === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused, total])

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
    ))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center px-8">
        <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="font-semibold text-gray-500 mb-1">Belum ada foto pelanggan</p>
        <p className="text-sm text-gray-400">Foto dari testimoni yang di-approve akan muncul di sini</p>
      </div>
    )
  }

  // Visible items: prev, current, next (up to 3 cards)
  const prevIdx = (currentIndex - 1 + total) % total
  const nextIdx = (currentIndex + 1) % total

  return (
    <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>

      {/* Cards */}
      <div className="flex items-center justify-center gap-4">
        {/* Prev card (dimmed) */}
        {total > 1 && (
          <div className="hidden md:block flex-shrink-0 w-56 opacity-40 scale-95">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-72 overflow-hidden bg-gray-100">
                <img src={photos[prevIdx].photo!} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="flex-shrink-0 w-full max-w-md md:max-w-lg">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-80 md:h-96 overflow-hidden bg-gray-100">
              <img
                src={photos[currentIndex].photo!}
                alt={`Foto ${photos[currentIndex].name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Next card (dimmed) */}
        {total > 1 && (
          <div className="hidden md:block flex-shrink-0 w-56 opacity-40 scale-95">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-44 overflow-hidden bg-gray-100">
                <img src={photos[nextIdx].photo!} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation dots + counter */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {total > 1 && (
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {total > 1 && (
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">{currentIndex + 1} / {total} foto</p>
    </div>
  )
}
