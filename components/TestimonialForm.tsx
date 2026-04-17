'use client'

import { useState, useCallback } from 'react'

type FormData = {
  name: string
  whatsapp: string
  email: string
  address: string
  transactionCount: number
  lastTransactionAmount: number
  services: string[]
  rating: number
  message: string
  photo: string | null
}

type TestimonialFormProps = {
  onSubmit: (data: FormData) => Promise<void>
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const SERVICES = [
  { label: 'Pembelian HP', icon: '📱' },
  { label: 'Tukar Tambah', icon: '🔄' },
  { label: 'COD', icon: '💵' },
  { label: 'Jual Beli', icon: '🏪' },
  { label: 'Service HP', icon: '🔧' },
  { label: 'Barbershop', icon: '💈' },
  { label: 'Cafe', icon: '☕' },
]

const STEPS = [
  { num: 1, label: 'Data Diri' },
  { num: 2, label: 'Transaksi' },
  { num: 3, label: 'Layanan' },
  { num: 4, label: 'Testimoni' },
  { num: 5, label: 'Ringkasan' },
]

export default function TestimonialForm({ onSubmit }: TestimonialFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    email: '',
    address: '',
    transactionCount: 1,
    lastTransactionAmount: 0,
    services: [],
    rating: 0,
    message: '',
    photo: null,
  })

  const handleNext = () => { if (step < 5) setStep(step + 1) }
  const handleBack = () => { if (step > 1) setStep(step - 1) }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file terlalu besar. Maksimal 5MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim testimoni')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim() !== '' && formData.whatsapp.trim() !== ''
      case 2: return formData.transactionCount > 0 && formData.lastTransactionAmount >= 0
      case 3: return formData.services.length > 0
      case 4: return formData.rating > 0 && formData.message.trim() !== ''
      case 5: return true
      default: return false
    }
  }

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ── ERROR ── */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* ── STEP HEADER ── */}
      <div className="px-5 pt-5 pb-4">
        {/* Progress bar + label */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Step {step} / {STEPS.length}
          </span>
          <span className="text-xs font-medium text-black">
            {STEPS.find((s) => s.num === step)?.label}
          </span>
        </div>
        {/* Bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="px-5 pb-4 min-h-[360px]">

        {/* STEP 1 — Data Diri */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                No WhatsApp <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">+62</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.whatsapp.replace(/^0/, '')}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    setFormData({ ...formData, whatsapp: '0' + raw })
                  }}
                  placeholder="8123456789"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Email <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Alamat <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Raya No. 1, Surabaya"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2 — Transaksi */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Berapa Kali Bertransaksi?
              </label>
              <select
                value={formData.transactionCount}
                onChange={(e) => setFormData({ ...formData, transactionCount: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-colors appearance-none"
              >
                <option value={1}>1 Kali</option>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} Kali</option>
                ))}
                <option value={11}>Lebih dari 10 Kali</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Total Belanja Terakhir (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.lastTransactionAmount > 0 ? formData.lastTransactionAmount.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    setFormData({ ...formData, lastTransactionAmount: parseInt(raw) || 0 })
                  }}
                  onFocus={(e) => {
                    if (formData.lastTransactionAmount > 0)
                      e.target.setSelectionRange(e.target.value.length, e.target.value.length)
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Transaksi terakhir Anda di 14Group</p>
            </div>
          </div>
        )}

        {/* STEP 3 — Layanan */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <p className="text-xs text-gray-400 mb-3">Pilih layanan yang digunakan (bisa lebih dari satu)</p>
            <div className="grid grid-cols-1 gap-2">
              {SERVICES.map((svc) => {
                const checked = formData.services.includes(svc.label)
                return (
                  <label
                    key={svc.label}
                    onClick={() => handleServiceToggle(svc.label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
                      checked
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-base">{svc.icon}</span>
                    <span className={`flex-1 text-sm font-medium ${checked ? 'text-black' : 'text-gray-700'}`}>
                      {svc.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checked ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 4 — Testimoni */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Rating Anda <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-4xl transition-all duration-200 ${
                      star <= formData.rating ? 'text-yellow-400 scale-110' : 'text-gray-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {formData.rating === 5 ? 'Sangat puas! ⭐⭐⭐⭐⭐' :
                   formData.rating === 4 ? 'Puas ⭐⭐⭐⭐' :
                   formData.rating === 3 ? 'Cukup ⭐⭐⭐' :
                   formData.rating === 2 ? 'Kurang puas ⭐⭐' : 'Tidak puas ⭐'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Pesan Testimoni <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ceritakan pengalaman Anda belanja di 14Group..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${formData.message.length > 200 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {formData.message.length} / 500
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Upload Foto + Ringkasan */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Upload Foto <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              {formData.photo ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: null })}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors bg-gray-50/50">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">Tap untuk upload foto</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF maks. 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            {/* Ringkasan */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ringkasan</h3>
              <div className="space-y-2">
                {[
                  { label: 'Nama', value: formData.name },
                  { label: 'WhatsApp', value: formData.whatsapp },
                  ...(formData.email ? [{ label: 'Email', value: formData.email }] : []),
                  { label: 'Transaksi', value: formData.transactionCount === 11 ? '>10 Kali' : `${formData.transactionCount}x` },
                  { label: 'Total Belanja', value: formData.lastTransactionAmount > 0 ? `Rp ${formData.lastTransactionAmount.toLocaleString('id-ID')}` : '-' },
                  { label: 'Layanan', value: formData.services.join(', ') },
                  {
                    label: 'Rating',
                    value: formData.rating > 0 ? '★'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating) : '-'
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5">{item.label}</span>
                    <span className="text-xs font-medium text-black flex-1 leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── NAV BUTTONS ── */}
      <div className="px-5 pb-5 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
        )}
        <button
          type="button"
          onClick={step < 5 ? handleNext : handleSubmit}
          disabled={!isStepValid() || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 active:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengirim...
            </>
          ) : step < 5 ? (
            <>
              Lanjut
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            <>
              Kirim Testimoni
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
