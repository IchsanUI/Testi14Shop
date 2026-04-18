'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import type { Html5QrcodeCameraScanConfig } from 'html5-qrcode'
import { formatDiscount } from '@/lib/format'

type VoucherResult = {
  valid: boolean
  message: string
  voucher?: {
    id: string
    name: string
    code: string
    value: number
    valueType?: string
    minPurchase?: number
  }
  customer?: {
    name: string
    whatsapp: string
    services: string
    rating: number
    message: string
    photo: string | null
    submittedAt: string
  }
  expiresAt?: string
  usedAt?: string
}

// ── html5-qrcode target container ID (rendered in React JSX) ──
const SCANNER_ID = 'voucher-scanner-camera'

export default function VoucherVerification() {
  const [barcode, setBarcode] = useState('')
  const [result, setResult] = useState<VoucherResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const html5QrRef = useRef<Html5Qrcode | null>(null)
  const mountedRef = useRef(true)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  // Inject scanner CSS — html5-qrcode creates video/canvas as children of #SCANNER_ID.
  // Force them to fill the container so the camera feed is visible.
  useEffect(() => {
    if (!scanning) {
      styleRef.current?.remove()
      styleRef.current = null
      return
    }
    if (styleRef.current) return
    const el = document.createElement('style')
    el.textContent = `
      #${SCANNER_ID} video,
      #${SCANNER_ID} canvas {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      #${SCANNER_ID} .qr-shaded-region { background: rgba(0,0,0,0) !important; }
    `
    document.head.appendChild(el)
    styleRef.current = el
  }, [scanning])

  const stopScanner = useCallback(async () => {
    setScanning(false)
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop()
      } catch (_) {
        // ignore — may already be stopped
      }
      html5QrRef.current = null
    }
  }, [])

  const startScanner = useCallback(async () => {
    // Ensure previous scanner is fully stopped first
    await stopScanner()
    setCameraError(null)
    if (!mountedRef.current) return

    const container = document.getElementById(SCANNER_ID)
    if (!container) {
      setCameraError('Scanner tidak siap. Silakan刷新 halaman.')
      return
    }

    try {
      const html5Qr = new Html5Qrcode(SCANNER_ID, { verbose: false })
      html5QrRef.current = html5Qr

      // Find back camera explicitly — enumerate devices then pick 'environment'
      let selectedDeviceId: string | undefined
      try {
        const devices = await Html5Qrcode.getCameras()
        const back = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment') || d.label.toLowerCase().includes('rear'))
        selectedDeviceId = back?.id ?? devices[devices.length - 1]?.id
      } catch {
        // Fallback: just use facingMode hint
      }

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: 200,
        videoConstraints: {
          width: { ideal: 400 },
          height: { ideal: 400 },
          ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'environment' }),
        },
      }

      await html5Qr.start(
        selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'environment' },
        config,
        (decodedText) => {
          // QR code detected — stop scanner then verify
          stopScanner()
          if (mountedRef.current) {
            setBarcode(decodedText)
            setTimeout(() => handleVerifyManual(decodedText), 200)
          }
        },
        () => {
          // QR code not in frame — ignore, keep scanning
        }
      )
      if (mountedRef.current) setScanning(true)
    } catch (err: unknown) {
      await stopScanner()
      const raw = err instanceof Error ? err.message : String(err)
      if (raw.includes('NotAllowed') || raw.includes('Permission') || raw.includes('denied')) {
        setCameraError('Izin kamera ditolak. Izinkan akses kamera lalu klik "Buka Kamera" lagi.')
      } else if (raw.includes('NotFound') || raw.includes('not found')) {
        setCameraError('Kamera tidak ditemukan.')
      } else {
        setCameraError('Gagal mengakses kamera: ' + raw)
      }
    }
  }, [stopScanner])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopScanner()
    }
  }, [stopScanner])

  const handleVerifyManual = async (code?: string) => {
    const targetCode = (code ?? barcode).trim()
    if (!targetCode) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/vouchers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: targetCode, redeem: false }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Gagal memverifikasi voucher')
      setResult({ ...data, usedAt: data.usedAt === null ? undefined : data.usedAt })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
      setRedeeming(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleVerifyManual()
  }

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    setRedeeming(true)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/vouchers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: barcode.trim(), redeem: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Gagal menggunakan voucher')
      setResult({ ...data, usedAt: data.usedAt === null ? undefined : data.usedAt })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
      setRedeeming(false)
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-black px-6 py-4">
        <h3 className="text-base font-bold text-white">Verifikasi Voucher</h3>
        <p className="text-xs text-gray-400 mt-0.5">Scan QR atau masukkan kode manual</p>
      </div>

      <div className="p-5">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Camera Scanner */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Scan QR Code</span>
            {!scanning ? (
              <button
                onClick={startScanner}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Buka Kamera
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup Kamera
              </button>
            )}
          </div>

          {/* Camera preview */}
          <div
            className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-black"
            style={{ height: '280px' }}
          >
            <div
              id={SCANNER_ID}
              style={{ width: '100%', height: '100%' }}
            />

            {/* Scanning frame overlay */}
            {scanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-yellow-400 rounded-2xl">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!scanning && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Klik &quot;Buka Kamera&quot; untuk scan</p>
              </div>
            )}
          </div>

          {/* Camera error */}
          {cameraError && (
            <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-3">
              <svg className="w-10 h-10 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-600 text-center">{cameraError}</p>
              <button onClick={startScanner} className="mt-3 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800">
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">atau</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Manual Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label htmlFor="barcode" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Masukkan Kode Manual
            </label>
            <input
              type="text"
              id="barcode"
              value={barcode}
              onChange={(e) => { setBarcode(e.target.value); setResult(null) }}
              placeholder="Contoh: VC-ABC12-XYZ789-123456"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 bg-white text-sm"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !barcode.trim()}
              className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && !redeeming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800" />
                  Memverifikasi...
                </div>
              ) : 'Verifikasi'}
            </button>
            <button
              type="button"
              disabled={loading || redeeming || !barcode.trim()}
              onClick={handleRedeem}
              className="flex-1 px-4 py-3.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {redeeming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gunakan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display — Full Width Below */}
      {result && (
        <div className="border-t-2 border-gray-100">
          {result.valid ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400" />
              <div className="p-5">
                {/* Valid badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-green-900">Voucher Valid</h4>
                    <p className="text-sm text-green-700 font-medium">{result.message}</p>
                  </div>
                </div>

                {/* Voucher card */}
                {result.voucher && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 mb-4">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-black via-yellow-400 to-black rounded-full mb-4" />

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">14Group</p>
                        <p className="text-sm text-gray-500">Testimoni</p>
                      </div>
                      <div className="bg-black rounded-lg px-3 py-1.5">
                        <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">{result.voucher.name}</p>
                      </div>
                    </div>

                    <div className="text-center py-4 bg-gradient-to-b from-gray-50 to-white rounded-xl mb-4">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Potongan Harga</p>
                      <p className="text-5xl font-black text-black tracking-tight leading-none">
                        {formatDiscount(result.voucher.value, result.voucher.valueType as 'percentage' | 'fixed')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Kode</p>
                        <p className="text-sm font-bold font-mono text-black">{result.voucher.code}</p>
                      </div>
                      {result.voucher.minPurchase != null && result.voucher.minPurchase > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Min. Pembelian</p>
                          <p className="text-sm font-bold text-orange-600">Rp {result.voucher.minPurchase.toLocaleString('id-ID')}</p>
                        </div>
                      )}
                    </div>

                    {result.expiresAt && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-orange-700">
                          Berlaku hingga{' '}
                          <span className="font-bold">
                            {new Date(result.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer info */}
                {result.customer && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detail Pelanggan</p>

                    {/* Photo */}
                    {result.customer.photo && (
                      <div className="mb-3">
                        <img src={result.customer.photo} alt="Customer" className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Nama</span>
                        <span className="text-sm font-bold text-black">{result.customer.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">WhatsApp</span>
                        <span className="text-sm font-semibold text-black">{result.customer.whatsapp}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Layanan</span>
                        <span className="text-sm font-medium text-black">{result.customer.services}</span>
                      </div>
                      <div className="flex justify-between py-2 items-center border-b border-gray-100">
                        <span className="text-sm text-gray-500">Rating</span>
                        <div className="flex space-x-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < result.customer!.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="py-2">
                        <span className="text-sm text-gray-500 block mb-1.5">Pesan</span>
                        <p className="text-sm text-black bg-gray-50 p-3 rounded-xl leading-relaxed">{result.customer.message}</p>
                      </div>
                      <div className="flex justify-between py-2 text-xs text-gray-400">
                        <span>Submit:</span>
                        <span className="text-gray-600 font-medium">
                          {new Date(result.customer.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already used */}
                {result.usedAt && (
                  <div className="bg-gray-100 rounded-2xl p-5 flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Voucher Sudah Digunakan</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        pada {new Date(result.usedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Use button */}
                {!result.usedAt && (
                  <button
                    onClick={handleRedeem}
                    disabled={redeeming}
                    className="w-full px-5 py-4 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                  >
                    {redeeming ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Gunakan Voucher Ini
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Invalid result */
            <div className="bg-gradient-to-br from-red-50 to-pink-50">
              <div className="h-1.5 bg-gradient-to-r from-red-400 via-pink-400 to-red-400" />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-red-900">Voucher Tidak Valid</h4>
                    <p className="text-sm text-red-700 font-medium">{result.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}