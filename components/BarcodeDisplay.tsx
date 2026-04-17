'use client'

import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

type BarcodeDisplayProps = {
  value: string
  format?: string
  width?: number
  height?: number
  displayValue?: boolean
  showDownload?: boolean
  onDownload?: () => void
}

export default function BarcodeDisplay({
  value,
  format = 'CODE128',
  width = 1.5,
  height = 40,
  displayValue = true,
  showDownload = true,
  onDownload,
}: BarcodeDisplayProps) {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize: 12,
          margin: 5,
        })
      } catch (error) {
        console.error('Error generating barcode:', error)
      }
    }
  }, [value, format, width, height, displayValue])

  if (!value) {
    return null
  }

  const handleDownload = () => {
    if (barcodeRef.current) {
      const svg = barcodeRef.current
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngFile
        downloadLink.download = `voucher-${value}.png`
        downloadLink.click()
        onDownload?.()
      }

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white px-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm">
        <svg ref={barcodeRef} className="block max-w-full"></svg>
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
          Simpan Barcode
        </button>
      )}
    </div>
  )
}
