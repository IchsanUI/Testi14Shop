'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Banner = {
  id: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
}

export default function BannerPopup() {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('banner_dismissed')
    if (dismissed) return

    // Fetch active banner
    fetch('/api/banners/active')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.banner) {
          setBanner(data.banner)
          setVisible(true)
        }
      })
      .catch(console.error)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setClosed(true)
    localStorage.setItem('banner_dismissed', '1')
  }

  if (!visible || !banner) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-lg w-full">
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white hover:text-yellow-400 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {banner.linkUrl ? (
          <a
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden shadow-2xl hover:opacity-95 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </a>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  )
}