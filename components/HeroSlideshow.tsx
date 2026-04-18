'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    label: 'empatbelas.cell',
    desc: 'Toko Handphone',
  },
  {
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    label: 'barbershop.14Coffe',
    desc: 'Barbershop & Cafe',
  },
  {
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    label: 'ifourteen.service',
    desc: 'Service Center',
  },
  {
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    label: 'iphoneshop.14',
    desc: 'iPhone & Gadget',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length)
        setFade(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:flex justify-center hero-card">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-black/40 border border-white/10">
        {/* Slides */}
        <div className="relative h-[420px]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.url}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.url}
                alt={slide.desc}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-yellow-400 text-xs font-semibold tracking-wide">
                  {slide.label}
                </p>
                <p className="text-white text-sm font-bold mt-0.5">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFade(false)
                setTimeout(() => {
                  setCurrent(i)
                  setFade(true)
                }, 200)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Bottom info strip */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-gray-400 text-xs">
              Buka setiap hari, 09.00 – 21.00 WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
