# 📘 CLAUDE.md
## Development Roadmap – 14Group Testimoni System
Next.js + Tailwind CSS

---

## 🧭 Overview

Pengembangan sistem dibagi menjadi 5 sesi utama:

1. Foundation Setup
2. Customer Form (Core Feature)
3. Voucher System
4. Admin Dashboard
5. Optimization & Enhancement

Setiap sesi harus selesai dan stabil sebelum lanjut ke sesi berikutnya.

---

## 🧱 SESSION 1 — Foundation Setup

### 🎯 Tujuan
Menyiapkan struktur project yang rapi dan scalable.

### ✅ Task
- Setup Next.js (App Router + TypeScript)
- Install Tailwind CSS
- Setup folder structure
- Setup database (Prisma + DB)
- Setup basic layout (container, navbar optional)

---

### 📦 Output
- Project bisa running
- Struktur folder sudah clean
- Tailwind sudah aktif
- Database sudah connect

---

### 📌 Rules
- Jangan langsung bikin fitur kompleks
- Fokus ke struktur & fondasi

---

## 🧾 SESSION 2 — Customer Testimoni Form

### 🎯 Tujuan
Membuat form testimoni multi-step tanpa reload.

---

### ✅ Task

#### 1. Multi-Step Form
- Step indicator
- Navigasi next / back tanpa reload
- State management (useState / Zustand)

---

#### 2. Form Fields

**Step 1 — Data Diri**
- Nama
- No WhatsApp

**Step 2 — Layanan**
- Checkbox layanan:
  - Pembelian HP
  - Tukar Tambah
  - COD
  - Jual Beli
  - Service HP
  - Barbershop
  - Cafe

**Step 3 — Testimoni**
- Rating (1–5)
- Textarea

**Step 4 — Upload**
- Upload foto
- Preview image

---

#### 3. Submit Data
- Simpan ke database
- Gunakan server action / API route

---

### 📦 Output
- Form berjalan smooth tanpa reload
- Data berhasil tersimpan
- UI sudah usable & rapi

---

### 📌 Rules
- UX harus cepat (< 1 menit isi)
- Mobile-first wajib

---
## 🎁 SESSION 3 — Voucher System

### 🎯 Tujuan
Menambahkan sistem reward setelah submit.

---

### ✅ Task

#### 1. Database Voucher
- Nama voucher
- Kuota
- Probabilitas

---

#### 2. Logic Random

```js
if (random <= probability && quota > 0) {
  assignVoucher()
}
3. Integrasi ke Form
Setelah submit:
Generate voucher
Tampilkan di halaman success
4. UI Success Page
Menampilkan:
Ucapan terima kasih
Voucher (jika dapat)
📦 Output
Voucher muncul secara random
Tidak melebihi kuota
📌 Rules
Selalu handle fallback (tidak dapat voucher)
Logic harus aman dari abuse


🛠️ SESSION 4 — Admin Dashboard
🎯 Tujuan

Memberikan kontrol penuh ke admin.

✅ Task
1. Testimoni Management
List semua testimoni
Approve / Reject
Filter berdasarkan layanan
2. Voucher Management
Tambah voucher
Edit voucher
Set:
Kuota
Probabilitas
3. UI Dashboard
Table sederhana
Clean & responsive
📦 Output
Admin bisa kontrol sistem
Data bisa dimanage dengan mudah
📌 Rules
Prioritaskan fungsi, bukan desain dulu
UI tetap clean

⚡ SESSION 5 — Optimization & Enhancement
🎯 Tujuan

Meningkatkan kualitas sistem agar lebih profesional.

✅ Task
Performance
Gunakan next/image
Lazy loading
Minimalkan re-render
Security
Validasi input
Sanitasi data
Limit upload file
UX Enhancement
Animasi transisi step
Loading state
Error handling
Optional Feature
QR Code ke halaman form
WhatsApp notifikasi
Testimoni tampil di landing page
📦 Output
Sistem lebih cepat & aman
UX lebih halus dan profesional


## 🎨 SESSION 6 — UI Polish + Barcode Voucher System

### 🎯 Tujuan
Meningkatkan tampilan agar lebih premium + menambahkan sistem voucher berbasis barcode yang valid dan bisa diverifikasi admin.

---

### ✅ Task

### 1. UI Improvement (Landing & Form)

#### ✨ Tampilan Awal (Landing Form)
- Buat halaman pembuka lebih menarik:
  - Hero section sederhana
  - Judul besar (contoh: “Bagikan Pengalamanmu di 14Group”)
  - Subtext singkat
  - CTA button: “Isi Testimoni”

---

#### 📱 Responsive Mobile
- Wajib mobile-first
- Gunakan:
  - `max-w-md mx-auto`
  - spacing nyaman
- Pastikan:
  - Button mudah ditekan
  - Input tidak terlalu kecil

---

#### 🔤 Font
- Gunakan **Inter** dari Google Fonts

Contoh implementasi:
```js
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



## 🔐 SESSION 7 — Admin Auth + Role + Log System

### 🎯 Tujuan
Menambahkan sistem autentikasi admin, role-based access, serta pencatatan aktivitas (log) agar sistem lebih aman dan terkontrol.

---

## ✅ Task

### 1. Authentication (Login Admin)

#### Fitur:
- Login halaman admin (`/admin/login`)
- Email + password
- Session-based auth (JWT / NextAuth direkomendasikan)

---

### 2. Role Management

#### Role:
- **Admin**
- **Super Admin**

---

### 🔑 Hak Akses

#### 👤 Admin:
- Menambahkan voucher
- Redeem voucher (scan barcode)
- Edit informasi toko:
  - Lokasi
  - Kontak
  - Media sosial

---

#### 👑 Super Admin:
- Semua akses Admin
- Menambahkan user admin baru
- Mengatur role user
- Melihat log aktivitas admin

---

### 📊 3. Activity Log System

#### Tujuan:
Melacak semua aktivitas penting dalam sistem.

---

#### Data yang disimpan:
- user_id
- role
- aksi (contoh: "redeem voucher", "create voucher")
- waktu
- detail tambahan

---

#### Contoh log:
``` id="log-example"
[Admin - Ichsan] Redeem Voucher: VCR-12345 (Valid)
[Super Admin - Linda] Menambahkan Admin Baru
📦 4. Database Structure (Tambahan)
Table Users
id
name
email
password
role (admin / super_admin)
Table Logs
id
user_id
action
description
created_at
🏪 5. Update Landing Page (Public Page)
🎯 Tujuan

Meningkatkan branding dan konversi user.

✅ Tambahan Fitur
📲 Button WhatsApp
CTA: "Hubungi Kami via WhatsApp"
Link langsung ke nomor admin

Contoh:

https://wa.me/628xxxxxxxxxx
🛍️ Fasilitas Layanan

Tampilkan dalam bentuk card / list:

Bisa Tukar Tambah
Bisa Transaksi COD
Garansi After Sales
📍 Lokasi Toko

Alamat:

Dekat Lampu Merah,  
Jl. Panglima Sudirman No.134,  
Kramatandap, Gapurosukolilo,  
Gresik, Jawa Timur 61111

Koordinat:

-7.170131155428334, 112.65387677384109
🗺️ Integrasi Maps (Optional)
Gunakan Google Maps Embed
Atau tombol "Lihat di Maps"