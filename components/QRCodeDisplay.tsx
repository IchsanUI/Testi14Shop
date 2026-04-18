'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

type QRCodeDisplayProps = {
  value: string
  size?: number
  showDownload?: boolean
  onDownload?: () => void
}

export default function QRCodeDisplay({
  value,
  size = 180,
  showDownload = true,
  onDownload,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string>('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    let cancelled = false

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(() => {
        if (!cancelled && canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL())
        }
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error('Error generating QR code:', err)
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [value, size])

  if (!value) return null

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `voucher-${value}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
      onDownload?.()
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
        <canvas ref={canvasRef} className="block" />
      </div>
      {showDownload && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
          title="Save as PNG image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Simpan QR Code
        </button>
      )}
    </div>
  )
}
