# Psikotest.in — Next.js

Platform psikotest online untuk rekrutmen karyawan dengan pengawasan realtime. Dibangun dengan **Next.js 14** + **PostgreSQL (Neon.tech)**. Deploy ke **Vercel** dalam hitungan menit.

---

## Stack

| Layer    | Teknologi                                    |
|----------|----------------------------------------------|
| Frontend | Next.js 14 App Router + Tailwind CSS         |
| Backend  | Next.js API Routes (Server Actions)          |
| Database | PostgreSQL via **Neon.tech**                 |
| Auth     | JWT (jose) + bcryptjs via httpOnly cookie    |
| Kamera   | WebRTC MediaDevices API (native browser)     |
| Anti-cheat | Page Visibility API + Fullscreen API       |
| Deploy   | **Vercel** (zero config)                     |

---

## Langkah Setup

### 1. Siapkan Database Neon.tech

1. Buat akun gratis di [neon.tech](https://neon.tech)
2. Klik **New Project** → nama: `psikotest`, region: **Singapore**
3. Copy **Connection String**, contoh:
   ```
   postgresql://psikotest_owner:xxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/psikotest?sslmode=require
   ```

### 2. Install & Konfigurasi Lokal

```bash
# Install dependencies
npm install

# Salin env file
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://username:password@ep-xxxx.ap-southeast-1.aws.neon.tech/psikotest?sslmode=require
JWT_SECRET=ganti-dengan-string-acak-minimal-32-karakter
```

### 3. Migrasi Database & Seed Data

```bash
node scripts/migrate.js
```

Script ini akan:
- Membuat tabel: `users`, `test_sessions`, `test_questions`, `test_violations`
- Mengisi soal psikotest (100 soal: Verbal, Numerik, Logika, Kepribadian)
- Membuat akun HR default: `hr@psikotest.in` / `Admin1234!`

### 4. Jalankan Lokal

```bash
npm run dev
# Buka http://localhost:3000
```

---

## Deploy ke Vercel

### Cara 1: Vercel CLI (Termudah)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Cara 2: GitHub + Vercel Dashboard

1. Push project ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repo
3. Di **Environment Variables**, tambahkan:
   ```
   DATABASE_URL  = postgresql://...neon.tech/psikotest?sslmode=require
   JWT_SECRET    = string-acak-minimal-32-karakter
   ```
4. Klik **Deploy**

Selesai! Vercel auto-detects Next.js. Zero config needed.

---

## Akun Default (Setelah Migrasi)

| Role      | Email              | Password     |
|-----------|--------------------|--------------|
| HR Admin  | hr@psikotest.in    | Admin1234!   |
| Kandidat  | Daftar via /register |            |

---

## Struktur Proyek

```
src/
├── app/
│   ├── api/
│   │   ├── auth/route.js          # Login, register, logout
│   │   ├── test/submit/route.js   # Submit & scoring tes
│   │   ├── proctor/
│   │   │   ├── violation/route.js # Log pelanggaran anti-cheat
│   │   │   ├── snapshot/route.js  # Upload webcam snapshot
│   │   │   └── heartbeat/route.js # Cek status sesi
│   │   └── hr/
│   │       ├── invite/route.js    # Undang kandidat
│   │       └── delete/[id]/route.js
│   ├── login/page.js
│   ├── register/page.js
│   ├── candidate/
│   │   ├── dashboard/page.js
│   │   ├── test/psikotes/
│   │   │   ├── page.js            # Halaman persiapan tes
│   │   │   ├── StartButton.js     # Camera check (client)
│   │   │   └── exam/
│   │   │       ├── page.js        # Server: buat/lanjut sesi
│   │   │       └── ExamTaker.js   # UI Ujian + Anti-cheat (client)
│   │   └── result/[sessionId]/page.js
│   └── hr/
│       ├── dashboard/
│       │   ├── page.js            # Server: fetch stats
│       │   └── HRDashboardClient.js
│       └── candidates/
│           ├── page.js
│           ├── HRCandidatesClient.js
│           └── [id]/page.js       # Detail kandidat
├── components/
│   └── SidebarLayout.js           # Layout sidebar responsif
├── lib/
│   ├── db.js                      # Koneksi PostgreSQL (Neon)
│   └── auth.js                    # JWT + bcrypt utilities
└── middleware.js                  # Route protection
scripts/
└── migrate.js                     # DB migration + seeder
```

---

## Fitur Anti-Cheat

| Fitur                   | Cara Kerja                                          |
|-------------------------|-----------------------------------------------------|
| Tab Switch Detection    | `document.visibilitychange` → log violation         |
| Window Blur Detection   | `window.blur` → log violation                       |
| Fullscreen Lock         | `requestFullscreen()` + `fullscreenchange` listener |
| Keyboard Blocking       | Blok F12, Ctrl+T/W/N/R, Alt+Tab                    |
| Copy/Paste Block        | Prevent `copy`, `paste`, `cut` events               |
| Webcam Monitoring       | Snapshot tiap 20 detik → simpan ke DB               |
| Auto-Disqualify         | Setelah 3 pelanggaran → status = `disqualified`     |
| Heartbeat               | Cek status sesi tiap 30 detik                       |

---

## Scoring

- **Kognitif (75 soal)**: Benar/Salah → IQ = 70 + (correct/75 × 70) → range 70–140
- **Kepribadian (25 soal)**: Skala Likert 1–4 → persentase per dimensi (Integritas, Kolaborasi, Kepemimpinan, Stabilitas, Ketelitian)
- Klasifikasi IQ: Batas Lambat Belajar → Rata-rata Bawah → Rata-rata → Rata-rata Atas → Superior → Sangat Superior

---

## Environment Variables

| Variable       | Wajib | Keterangan                                  |
|---------------|-------|---------------------------------------------|
| `DATABASE_URL` | Ya    | Neon.tech connection string dengan sslmode=require |
| `JWT_SECRET`   | Ya    | String acak min. 32 karakter                |
