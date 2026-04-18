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
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

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

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
    if (total === 0) return
    const newIdx = ((idx % total) + total) % total
    setDirection(dir)
    setCurrentIndex(newIdx)
    // reset direction after animation
    setTimeout(() => setDirection(null), 600)
  }, [total])

  useEffect(() => {
    if (isPaused || total === 0) return
    const timer = setInterval(() => {
      goTo(currentIndex + 1, 'right')
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused, total, currentIndex, goTo])

  const prevIdx = (currentIndex - 1 + total) % total
  const nextIdx = (currentIndex + 1) % total

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="w-8 h-8 border-2 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center px-8">
        <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="font-semibold text-gray-500 mb-1">Belum ada foto pelanggan</p>
        <p className="text-sm text-gray-400">Foto dari testimoni yang di-approve akan muncul di sini</p>
      </div>
    )
  }

  return (
    <>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') goTo(currentIndex - 1, 'left')
          if (e.key === 'ArrowRight') goTo(currentIndex + 1, 'right')
        }}
        tabIndex={0}
      >
        {/* ── Cards ── */}
        <div className="relative flex items-center justify-center gap-4 min-h-[380px] md:min-h-[440px]">

          {/* Prev card */}
          {total > 1 && (
            <div
              className="hidden md:flex flex-shrink-0 w-56 opacity-30 scale-90 select-none pointer-events-none"
              style={{
                transform: 'scale(0.88)',
                opacity: 0.3,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
              }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={photos[prevIdx].photo!} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}

          {/* Main card */}
          <div
            className="relative flex-shrink-0 w-full max-w-md md:max-w-lg z-10"
            style={{
              transform: direction === 'left' ? 'translateX(-24px) scale(0.97)' : direction === 'right' ? 'translateX(24px) scale(0.97)' : 'translateX(0) scale(1)',
              opacity: 0.85,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
            }}
          >
            <div
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="h-80 md:h-96 overflow-hidden bg-gray-100">
                <img
                  src={photos[currentIndex].photo!}
                  alt={`Foto ${photos[currentIndex].name}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-black">{photos[currentIndex].name}</p>
                  <div className="flex text-yellow-400 text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < photos[currentIndex].rating ? '' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  &ldquo;{photos[currentIndex].message}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Next card */}
          {total > 1 && (
            <div
              className="hidden md:flex flex-shrink-0 w-56 opacity-30 scale-90 select-none pointer-events-none"
              style={{
                transform: 'scale(0.88)',
                opacity: 0.3,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
              }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={photos[nextIdx].photo!} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation dots + controls ── */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {total > 1 && (
            <button
              onClick={() => goTo(currentIndex - 1, 'left')}
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
                onClick={() => goTo(i, i > currentIndex ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {total > 1 && (
            <button
              onClick={() => goTo(currentIndex + 1, 'right')}
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
    </>
  )
}
