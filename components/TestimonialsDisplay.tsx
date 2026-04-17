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
  createdAt: string
}

export default function TestimonialsDisplay() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/public?limit=6')
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium">Belum ada testimoni yang ditampilkan</p>
        <p className="text-gray-300 text-sm mt-1">Jadilah yang pertama memberikan testimoni!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {testimonials.map((testimonial, i) => (
        <div
          key={testimonial.id}
          className="bg-white border border-gray-100 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-0.5 hover:border-gray-200"
        >
          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {renderStars(testimonial.rating)}
          </div>

          {/* Quote */}
          <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-4 italic">
            &ldquo;{testimonial.message}&rdquo;
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {testimonial.photo ? (
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-black text-sm leading-none">{testimonial.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{testimonial.services}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
