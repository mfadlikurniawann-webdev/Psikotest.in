# Psikotest.in

Platform psikotest online berbasis **Laravel** + **PostgreSQL (Neon.tech)** dengan fitur anti-kecurangan realtime.

---

## Fitur Utama

- 3 modul psikotest: TPA, Big Five Personality, DISC Assessment
- Monitoring kamera realtime (snapshot otomatis tiap 15 detik)
- Deteksi perpindahan tab & window (auto-fail)
- Wajib fullscreen, blok shortcut keyboard
- Dashboard HR: pantau semua kandidat & hasil
- Sistem pelanggaran (max 3x sebelum diskualifikasi)
- Laporan hasil terperinci per dimensi

---

## Stack Teknologi

| Layer      | Teknologi                    |
|------------|------------------------------|
| Backend    | Laravel 11 (PHP 8.2+)        |
| Database   | PostgreSQL via Neon.tech      |
| Frontend   | Blade + Tailwind CSS CDN      |
| Kamera     | WebRTC MediaDevices API       |
| Anti-cheat | Page Visibility API, Fullscreen API |

---

## Langkah Setup

### 1. Persiapan Database Neon.tech

1. Kunjungi [neon.tech](https://neon.tech) dan buat akun gratis
2. Klik **"New Project"**, beri nama `psikotest`
3. Pilih region: **AWS Singapore** (asia-pacific-1) agar latensi rendah dari Indonesia
4. Salin **Connection String** yang terlihat seperti:
   ```
   postgresql://psikotest_owner:xxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/psikotest?sslmode=require
   ```
5. Catat nilai `host`, `username`, `password`, dan `database`

---

### 2. Clone / Extract Proyek

```bash
# Jika menggunakan ZIP:
unzip psikotest-in.zip -d psikotest-in
cd psikotest-in

# Install dependensi PHP
composer install

# Install dependensi PDF (opsional, untuk ekspor hasil)
composer require barryvdh/laravel-dompdf
```

---

### 3. Konfigurasi Environment

```bash
# Salin file env
cp .env.example .env

# Generate app key
php artisan key:generate
```

Edit file `.env` dan isi bagian database dengan kredensial Neon.tech:

```env
APP_NAME="Psikotest.in"
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=ep-xxxx-xxxx.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=psikotest
DB_USERNAME=psikotest_owner
DB_PASSWORD=password_dari_neon
DB_SSLMODE=require
```

> **Penting:** `DB_SSLMODE=require` wajib untuk koneksi ke Neon.tech

---

### 4. Jalankan Migrasi & Seeder

```bash
# Buat tabel-tabel database
php artisan migrate

# Isi data soal psikotest
php artisan db:seed --class=QuestionSeeder

# Buat akun HR default (opsional - buat via tinker)
php artisan tinker
```

Di dalam tinker, buat akun HR:

```php
\App\Models\User::create([
    'name'     => 'Admin HR',
    'email'    => 'hr@psikotest.in',
    'password' => bcrypt('password123'),
    'role'     => 'hr',
]);
exit
```

---

### 5. Daftarkan Middleware Role

Di `bootstrap/app.php` (Laravel 11) atau `app/Http/Kernel.php` (Laravel 10), tambahkan:

**Laravel 11 (`bootstrap/app.php`):**
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

**Laravel 10 (`app/Http/Kernel.php`):**
```php
protected $middlewareAliases = [
    // ... existing
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

---

### 6. Tambahkan TestSession Relasi di User Model

Pastikan di `app/Models/User.php` ada:
```php
public function testSessions() {
    return $this->hasMany(TestSession::class);
}
```

---

### 7. Buat Folder Storage

```bash
php artisan storage:link
mkdir -p storage/app/snapshots
```

---

### 8. Jalankan Server Development

```bash
php artisan serve
```

Buka browser: `http://localhost:8000`

---

## Deployment Production

### Opsi A: VPS (Dewaweb / Niagahoster / Contabo)

```bash
# Install PHP 8.2, Nginx, Composer di server
sudo apt update && sudo apt install php8.2-fpm php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-curl nginx

# Clone repo ke /var/www/psikotest
cd /var/www/psikotest
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permission
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data .
```

Konfigurasi Nginx:
```nginx
server {
    listen 80;
    server_name psikotest.in www.psikotest.in;
    root /var/www/psikotest/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Opsi B: Laravel Cloud / Railway / Render

Upload project, set environment variables dari Neon.tech, jalankan:
```bash
php artisan migrate
php artisan db:seed --class=QuestionSeeder
```

---

## Akun Default

| Role      | Email                  | Password     |
|-----------|------------------------|--------------|
| HR Admin  | hr@psikotest.in        | password123  |
| Kandidat  | Daftar sendiri via /register |         |

---

## Struktur Proyek

```
psikotest-in/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php       # Login, Register, Logout
│   │   │   ├── CandidateController.php  # Dashboard kandidat
│   │   │   ├── TestController.php       # Logika tes & scoring
│   │   │   ├── HRController.php         # Dashboard & manajemen HR
│   │   │   └── ProctorController.php    # Anti-cheat API endpoints
│   │   └── Middleware/
│   │       └── CheckRole.php            # Role-based access
│   └── Models/
│       ├── User.php
│       ├── TestSession.php
│       └── TestViolation.php
├── database/
│   ├── migrations/                      # 3 file migrasi
│   └── seeders/
│       └── QuestionSeeder.php           # 40+ soal TPA, Big Five, DISC
├── resources/views/
│   ├── welcome.blade.php                # Landing page
│   ├── auth/login.blade.php             # Halaman masuk
│   ├── auth/register.blade.php          # Halaman daftar
│   ├── candidate/
│   │   ├── dashboard.blade.php          # Dashboard kandidat
│   │   ├── test-start.blade.php         # Persiapan & cek kamera
│   │   ├── test-exam.blade.php          # Halaman pengerjaan tes
│   │   └── result.blade.php             # Hasil tes
│   └── hr/
│       └── dashboard.blade.php          # Dashboard HR
└── routes/web.php                       # Semua routes
```

---

## Pengembangan Selanjutnya

- [ ] Tambah tes Kraepelin (konsentrasi & ketahanan)
- [ ] Integrasi face-api.js untuk deteksi wajah lebih akurat
- [ ] Export PDF laporan menggunakan DomPDF
- [ ] Kirim hasil ke email kandidat otomatis
- [ ] Multi-language support (EN/ID)
- [ ] Flutter mobile app untuk kandidat
- [ ] Penjadwalan tes (expired link)
- [ ] Batch invite kandidat via CSV upload

---

## Lisensi

MIT License — bebas dimodifikasi untuk keperluan internal perusahaan.

---

Dibuat untuk mendukung proses rekrutmen yang lebih objektif dan efisien.
