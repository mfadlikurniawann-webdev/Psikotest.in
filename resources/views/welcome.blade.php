<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Psikotest.in — Platform Asesmen Psikologi Rekrutmen</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: { display: ['"Playfair Display"','serif'], body: ['"DM Sans"','sans-serif'] },
                colors: {
                    ink: { 50:'#F6F7F9', 100:'#E8EAF0', 200:'#C9CDD8', 300:'#9DA4B5', 400:'#6C7591', 500:'#4A5270', 600:'#343C56', 700:'#232940', 800:'#161C2E', 900:'#0D1117' },
                    gold: { DEFAULT:'#C9A84C', light:'#E8C97A', dark:'#9A7A2E' },
                    sage: { DEFAULT:'#4A7C59', light:'#6BA87A' },
                }
            }
        }
    }
    </script>
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .hero-bg { background: linear-gradient(135deg, #0D1117 0%, #161C2E 50%, #0D1117 100%); }
        .grid-overlay { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M0 0h60v1H0zM0 0v60h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .gold-text { background: linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .feature-card { backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); transition: border-color 0.3s, transform 0.3s; }
        .feature-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-4px); }
        .stat-number { font-family: 'Playfair Display', serif; }
        .nav-link { transition: color 0.2s; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float { animation: float 5s ease-in-out infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-delay { animation: fadeUp 0.7s ease 0.15s forwards; opacity: 0; }
        .fade-up-delay-2 { animation: fadeUp 0.7s ease 0.3s forwards; opacity: 0; }
    </style>
</head>
<body class="bg-ink-900">

{{-- Navbar --}}
<nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5" style="background: rgba(13,17,23,0.85); backdrop-filter: blur(12px);">
    <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
        </div>
        <span class="font-display font-semibold text-white text-lg tracking-wide">Psikotest.in</span>
    </div>
    <div class="hidden md:flex items-center gap-8">
        <a href="#fitur" class="nav-link text-ink-300 hover:text-white text-sm">Fitur</a>
        <a href="#tes" class="nav-link text-ink-300 hover:text-white text-sm">Jenis Tes</a>
        <a href="#cara-kerja" class="nav-link text-ink-300 hover:text-white text-sm">Cara Kerja</a>
    </div>
    <div class="flex items-center gap-3">
        <a href="{{ route('login') }}" class="text-ink-300 hover:text-white text-sm transition px-3 py-1.5">Masuk</a>
        <a href="{{ route('register') }}" class="bg-gold hover:bg-gold-light text-ink-900 font-semibold text-sm px-4 py-2 rounded-lg transition">Daftar</a>
    </div>
</nav>

{{-- Hero --}}
<section class="hero-bg grid-overlay min-h-screen flex items-center pt-16">
    <div class="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
            <div class="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6 fade-up">
                <span class="w-1.5 h-1.5 bg-gold rounded-full"></span>
                <span class="text-gold text-xs font-medium tracking-wide">Platform Asesmen Psikologi Rekrutmen</span>
            </div>
            <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 fade-up-delay">
                Temukan Kandidat<br>
                <span class="gold-text">Terbaik</span> dengan<br>
                Psikotest Digital
            </h1>
            <p class="text-ink-300 text-lg leading-relaxed mb-8 fade-up-delay-2">
                Platform asesmen psikologi online dengan teknologi anti-kecurangan realtime. Hemat waktu rekrutmen, dapatkan insight mendalam tentang kandidat Anda.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 fade-up-delay-2">
                <a href="{{ route('register') }}" class="bg-gold hover:bg-gold-light text-ink-900 font-semibold px-6 py-3 rounded-xl text-center transition">
                    Mulai Sekarang
                </a>
                <a href="{{ route('login') }}" class="border border-ink-600 hover:border-gold text-white px-6 py-3 rounded-xl text-center transition text-sm">
                    Sudah punya akun? Masuk
                </a>
            </div>
        </div>

        {{-- Hero visual --}}
        <div class="hidden lg:flex justify-center float">
            <div class="relative w-80 h-80">
                {{-- Outer ring --}}
                <div class="absolute inset-0 rounded-full border border-gold/20"></div>
                <div class="absolute inset-6 rounded-full border border-gold/10"></div>

                {{-- Center card --}}
                <div class="absolute inset-12 bg-ink-800 rounded-2xl border border-ink-600 flex flex-col items-center justify-center p-4 shadow-2xl">
                    <svg class="w-10 h-10 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p class="text-white font-display font-semibold text-lg">87</p>
                    <p class="text-ink-400 text-xs">Skor TPA</p>
                </div>

                {{-- Floating badges --}}
                <div class="absolute -top-2 right-8 bg-sage text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">Big Five</div>
                <div class="absolute bottom-4 -left-4 bg-ink-700 border border-ink-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">DISC: Dominance</div>
                <div class="absolute top-1/2 -right-6 bg-gold text-ink-900 text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">Lulus TPA</div>
            </div>
        </div>
    </div>

    {{-- Stats --}}
    <div class="absolute bottom-0 left-0 right-0 border-t border-white/5">
        <div class="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach([['3', 'Jenis Tes Psikologi'],['Realtime','Monitoring Kamera'],['Anti-Cheat','Tab & Window Detection'],['PDF','Laporan Otomatis']] as [$num, $label])
            <div class="text-center">
                <p class="stat-number text-gold font-bold text-2xl">{{ $num }}</p>
                <p class="text-ink-400 text-xs mt-1">{{ $label }}</p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- Features --}}
<section id="fitur" class="py-24 bg-ink-900">
    <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
            <p class="text-gold text-sm font-medium tracking-widest uppercase mb-3">Fitur Unggulan</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white">Sistem Pengawasan Terpadu</h2>
            <p class="text-ink-400 mt-3 max-w-xl mx-auto">Dirancang khusus untuk memastikan integritas tes rekrutmen karyawan Anda.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach([
                ['Kamera Realtime','Monitoring wajah kandidat sepanjang tes. Deteksi otomatis jika wajah tidak terlihat atau ada lebih dari satu orang.','M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z','gold'],
                ['Anti Tab-Switch','Otomatis gagal jika kandidat berpindah tab, window, atau aplikasi lain selama pengerjaan tes.','M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2','rose'],
                ['Fullscreen Wajib','Kandidat diwajibkan mengerjakan dalam mode fullscreen. Keluar dari fullscreen langsung dicatat sebagai pelanggaran.','M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4','sage'],
                ['Soal Teracak','Soal ditampilkan secara acak untuk setiap kandidat, mengurangi kemungkinan berbagi jawaban.','M4 6h16M4 10h16M4 14h16M4 18h16','gold'],
                ['Laporan Detail','Hasil tes lengkap dengan grafik, analisis per dimensi, dan rekomendasi HR yang dapat diunduh dalam format PDF.','M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z','rose'],
                ['Dashboard HR','Panel admin lengkap untuk memantau semua kandidat, melihat hasil tes, dan mengelola jadwal psikotest.','M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6','sage'],
            ] as [$title, $desc, $icon, $color])
            <div class="feature-card bg-ink-800/50 rounded-2xl p-6">
                <div class="w-10 h-10 rounded-xl bg-{{ $color }}/10 flex items-center justify-center mb-4">
                    <svg class="w-5 h-5 text-{{ $color }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{{ $icon }}"/></svg>
                </div>
                <h3 class="text-white font-semibold mb-2">{{ $title }}</h3>
                <p class="text-ink-400 text-sm leading-relaxed">{{ $desc }}</p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- Test Types --}}
<section id="tes" class="py-24 bg-ink-800">
    <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
            <p class="text-gold text-sm font-medium tracking-widest uppercase mb-3">Jenis Tes</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white">3 Modul Asesmen Lengkap</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
            @foreach([
                ['TPA','Tes Potensi Akademik','Mengukur kemampuan numerik, verbal, dan logika. Standar rekrutmen BUMN dan perusahaan swasta.','45 detik/soal','Pilihan Ganda','Skor 0–100'],
                ['B5','Big Five Personality','OCEAN model — mengukur Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.','Tidak terbatas','Skala Likert','Profil 5 Dimensi'],
                ['DISC','DISC Assessment','Mengidentifikasi gaya perilaku dominan: Dominance, Influence, Steadiness, Conscientiousness.','Tidak terbatas','4 Pilihan','Tipe D/I/S/C'],
            ] as [$badge, $name, $desc, $time, $format, $result])
            <div class="bg-ink-900 rounded-2xl p-6 border border-ink-700 hover:border-gold/30 transition">
                <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <span class="font-display font-bold text-gold text-sm">{{ $badge }}</span>
                </div>
                <h3 class="text-white font-display font-semibold text-lg mb-2">{{ $name }}</h3>
                <p class="text-ink-400 text-sm mb-5 leading-relaxed">{{ $desc }}</p>
                <div class="space-y-2 pt-4 border-t border-ink-700">
                    <div class="flex justify-between text-sm"><span class="text-ink-500">Waktu</span><span class="text-ink-200">{{ $time }}</span></div>
                    <div class="flex justify-between text-sm"><span class="text-ink-500">Format</span><span class="text-ink-200">{{ $format }}</span></div>
                    <div class="flex justify-between text-sm"><span class="text-ink-500">Hasil</span><span class="text-gold text-xs font-medium">{{ $result }}</span></div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- How it works --}}
<section id="cara-kerja" class="py-24 bg-ink-900">
    <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-16">
            <p class="text-gold text-sm font-medium tracking-widest uppercase mb-3">Alur Penggunaan</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white">Cara Kerja Platform</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
            <div>
                <p class="text-gold text-xs font-semibold uppercase tracking-widest mb-4">Untuk HR</p>
                @foreach([['1','Buat akun HR & login ke dashboard'],['2','Undang kandidat via email dengan link tes'],['3','Pantau pengerjaan tes secara realtime'],['4','Unduh laporan PDF hasil semua kandidat']] as [$n,$s])
                <div class="flex gap-4 mb-5">
                    <div class="w-7 h-7 bg-gold/10 rounded-full flex items-center justify-center text-gold text-xs font-bold flex-shrink-0 mt-0.5">{{$n}}</div>
                    <p class="text-ink-300 text-sm leading-relaxed">{{$s}}</p>
                </div>
                @endforeach
            </div>
            <div>
                <p class="text-sage text-xs font-semibold uppercase tracking-widest mb-4">Untuk Kandidat</p>
                @foreach([['1','Terima link undangan & buat akun'],['2','Izinkan akses kamera sebelum mulai tes'],['3','Kerjakan tes dalam mode fullscreen penuh'],['4','Lihat hasil & laporan setelah tes selesai']] as [$n,$s])
                <div class="flex gap-4 mb-5">
                    <div class="w-7 h-7 bg-sage/10 rounded-full flex items-center justify-center text-sage text-xs font-bold flex-shrink-0 mt-0.5">{{$n}}</div>
                    <p class="text-ink-300 text-sm leading-relaxed">{{$s}}</p>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</section>

{{-- CTA --}}
<section class="py-20 bg-ink-800 border-t border-ink-700">
    <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">Siap Memulai Rekrutmen<br>yang Lebih Objektif?</h2>
        <p class="text-ink-400 mb-8">Daftar gratis dan mulai menggunakan platform asesmen psikologi terpercaya untuk rekrutmen Anda.</p>
        <a href="{{ route('register') }}" class="inline-block bg-gold hover:bg-gold-light text-ink-900 font-semibold px-8 py-3.5 rounded-xl transition">
            Mulai Sekarang
        </a>
    </div>
</section>

{{-- Footer --}}
<footer class="bg-ink-900 border-t border-ink-800 py-8">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gold rounded flex items-center justify-center">
                <svg class="w-3 h-3 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
            </div>
            <span class="font-display font-semibold text-white text-sm">Psikotest.in</span>
        </div>
        <p class="text-ink-500 text-xs">Platform Asesmen Psikologi untuk Rekrutmen Profesional</p>
    </div>
</footer>

</body>
</html>
