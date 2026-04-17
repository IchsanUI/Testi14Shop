# 14Group Testimoni System

Sistem testimoni pelanggan untuk **14Group** — ekosistem usaha terlengkap di Gresik yang menaungi penjualan HP, tukar tambah, service, barbershop, dan cafe.

Dibangun dengan **Next.js 15**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM**.

---

## Fitur

### Halaman Publik

| Halaman | Deskripsi |
|---|---|
| **Landing Page** (`/`) | Hero section, fasilitas layanan, galeri foto pelanggan, peta lokasi, carousel testimoni featured, tombol WhatsApp mengambang |
| **Form Testimoni** (`/customer`) | Form multi-step tanpa reload: Data Diri → Layanan → Rating & Pesan → Upload Foto → Submit |
| **Redeem Voucher** (`/redeem`) | Input kode 6-digit untuk menukar voucher testimoni |

### Sistem Voucher

- **Random draw** — probabilitas per voucher (0–100%) dengan kuota terbatas
- **Tiga jenis value**: percentage (%), fixed amount (Rp), atau free service
- **Minimum purchase** — batas minimum transaksi untuk bisa redeem
- **Barcode** — tiap voucher punya barcode unik untuk verifikasi oleh admin
- **Expiry** — voucher kedaluwarsa otomatis setelah N hari

### Dashboard Admin (`/admin`)

Akses semua功能的 melalui sidebar navigation:

| Modul | Fitur |
|---|---|
| **Testimonials** | List semua testimoni, approve/reject, tandai featured (tampil di landing), filter per layanan |
| **Vouchers** | CRUD voucher: nama, kode, value, kuota, probabilitas, minimum purchase, expiry |
| **Voucher Verification** | Scan/input barcode/kode → validasi & redeem voucher secara langsung |
| **Users** | Kelola user admin (hanya Super Admin) |
| **Activity Logs** | Riwayat semua aksi: approve testimonial, create voucher, redeem, login, dll |
| **Media** | Upload & kelola aset gambar (logo, foto testimoni) |

### Autentikasi & Role

| Role | Hak Akses |
|---|---|
| **Admin** | Kelola testimoni, voucher, verifikasi & redeem, lihat logs |
| **Super Admin** | Semua akses Admin + kelola user admin |

---

## Tech Stack

| Teknologi | Keterangan |
|---|---|
| **Next.js 15** | App Router, Server Components, Server Actions |
| **TypeScript** | Type safety di seluruh codebase |
| **Tailwind CSS v4** | Utility-first styling |
| **Prisma ORM** | Database ORM dengan migrations |
| **SQLite** | Database (lokalnya `dev.db`) |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | Session-based authentication |
| **jsbarcode** | Generate barcode untuk voucher |

---

## Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Salin file `.env` dan sesuaikan:

```bash
cp .env .env.local
```

Variabel yang dibutuhkan:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-min-32-chars"
WHATSAPP_NUMBER="628xxxxxxxxxx"
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Opsional) Seed data awal
npm run seed
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Default Admin Account

Setelah seed, login dengan:

- **Email:** `admin@14group.id`
- **Password:** `admin123`

> Super Admin: `superadmin@14group.id` / `superadmin123`

---

## Struktur Folder

```
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin pages (login, dashboard)
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin API (testimonials, vouchers, users, logs)
│   │   ├── auth/                # Auth API
│   │   ├── redeem/              # Public voucher redeem API
│   │   └── testimonials/        # Public testimonials API
│   ├── customer/                 # Customer form page
│   ├── redeem/                  # Redeem page
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── admin/                   # Admin dashboard components
│   ├── BarcodeDisplay.tsx       # Barcode renderer
│   ├── CustomerCarousel.tsx     # Photo carousel
│   ├── Navbar.tsx               # Admin navbar
│   ├── NavbarClient.tsx         # Public navbar
│   ├── RedeemForm.tsx           # Voucher redeem form
│   ├── TestimonialForm.tsx      # Multi-step testimonial form
│   └── TestimonialsDisplay.tsx  # Testimonials grid
├── lib/                          # Utilities
│   ├── auth.ts                  # Auth helpers (JWT, cookies)
│   ├── format.ts                # Formatting utilities
│   ├── logger.ts                # Activity logger
│   ├── prisma.ts                # Prisma client singleton
│   ├── rateLimit.ts             # Rate limiting
│   ├── redeemCode.ts            # 6-digit code generator
│   └── voucher.ts               # Voucher draw logic
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                  # Seed data
├── public/                       # Static assets
└── scripts/                      # Migration & utility scripts
```

---

## Database Schema

### Model Utama

- **Testimonial** — data testimoni pelanggan (nama, WhatsApp, layanan, rating, foto, approved/featured)
- **Voucher** — template voucher (kuota, probabilitas, expiry, barcode)
- **VoucherRedeem** — record redeem voucher
- **RedeemCode** — kode 6-digit untuk redeem testimoni
- **User** — akun admin
- **ActivityLog** — log aktivitas admin

---

## API Routes

### Public

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/testimonials/public` | Ambil testimoni featured (approved) |
| POST | `/api/testimonials` | Submit testimoni baru |
| POST | `/api/redeem` | Redeem voucher |

### Admin (requires auth)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET/POST | `/api/admin/testimonials` | List / create testimonial |
| PATCH | `/api/admin/testimonials/[id]/approve` | Approve testimoni |
| PATCH | `/api/admin/testimonials/[id]/featured` | Toggle featured |
| POST | `/api/admin/testimonials/[id]/redeem-code` | Generate redeem code |
| GET/POST | `/api/admin/vouchers` | List / create voucher |
| PATCH/DELETE | `/api/admin/vouchers/[id]` | Update / delete voucher |
| POST | `/api/admin/vouchers/verify` | Verifikasi barcode/kode |
| GET | `/api/admin/activity-logs` | Ambil log aktivitas |
| GET/POST | `/api/admin/users` | List / create user |
| DELETE | `/api/admin/users/[id]` | Hapus user |

---

## Lokasi

> **14Group** — Dekat Lampu Merah, Jl. Panglima Sudirman No.134, Kramatandap, Gapurosukolilo, Gresik, Jawa Timur 61111

**Jam Operasional:** Setiap hari, 09.00 – 21.00 WIB
