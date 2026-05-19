<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk - Psikotest.in</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                },
                colors: {
                    brand: {
                        50: '#F8FAFC',
                        100: '#F1F5F9',
                        200: '#E2E8F0',
                        300: '#CBD5E1',
                        400: '#94A3B8',
                        500: '#64748B',
                        600: '#475569',
                        700: '#334155',
                        800: '#1E293B',
                        900: '#0F172A',
                    },
                    accent: {
                        primary: '#2563EB',
                        secondary: '#4F46E5',
                        success: '#16A34A',
                        warning: '#D97706',
                        danger: '#DC2626',
                    }
                }
            }
        }
    }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: #F8FAFC;
        }
    </style>
</head>
<body class="min-h-screen bg-slate-50 flex">

<!-- Left Panel (Desktop) -->
<div class="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 border-r border-slate-800">
    <div>
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div>
                <p class="font-bold text-white text-base leading-tight">Psikotest.in</p>
                <p class="text-slate-400 text-xs">Asesmen Karyawan</p>
            </div>
        </div>
    </div>
    
    <div>
        <h2 class="text-3xl font-extrabold text-white leading-tight mb-4">Portal Ujian Psikotes Online Karyawan</h2>
        <p class="text-slate-400 leading-relaxed text-sm max-w-md">
            Selamat datang di sistem asesmen resmi perusahaan. Silakan masuk menggunakan akun Anda untuk memulai sesi ujian psikotes terpadu dan pengukuran kompetensi kerja.
        </p>
        <div class="mt-10 space-y-4">
            @foreach([
                'Sesi ujian mandiri terintegrasi dengan proctoring kamera',
                'Sistem pendeteksi kepatuhan pengerjaan realtime',
                'Analisis profil kompetensi dan psikogram kerja terstandar'
            ] as $feature)
            <div class="flex items-center gap-3 text-sm text-slate-300">
                <div class="w-5 h-5 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>{{ $feature }}</span>
            </div>
            @endforeach
        </div>
    </div>

    <div class="text-slate-500 text-xs">Psikotest.in &copy; {{ date('Y') }}</div>
</div>

<!-- Right Panel (Form) -->
<div class="flex-1 flex items-center justify-center p-6 bg-slate-50">
    <div class="w-full max-w-sm">
        
        <!-- Mobile Logo -->
        <div class="mb-8 lg:hidden flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div>
                <p class="font-bold text-slate-900 text-base leading-tight">Psikotest.in</p>
                <p class="text-slate-500 text-xs">Asesmen Karyawan</p>
            </div>
        </div>

        <h1 class="text-2xl font-bold text-slate-900 mb-1">Masuk ke Akun</h1>
        <p class="text-slate-500 text-sm mb-8">Belum punya akun? <a href="{{ route('register') }}" class="text-blue-600 hover:text-blue-700 font-semibold transition">Daftar sekarang</a></p>

        @if($errors->any())
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-2">
            <svg class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <div>
                {{ $errors->first() }}
            </div>
        </div>
        @endif

        <form action="{{ route('login') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Alamat Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required
                    class="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    placeholder="nama@email.com">
            </div>
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Kata Sandi</label>
                <input type="password" name="password" required
                    class="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    placeholder="Masukkan kata sandi">
            </div>
            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" name="remember" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600">
                    Ingat saya
                </label>
            </div>
            <button type="submit" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition text-sm shadow-sm mt-2">
                Masuk
            </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-200">
            <p class="text-center text-slate-400 text-xs leading-normal">
                Dengan masuk, Anda menyetujui bahwa pengerjaan tes dilakukan secara mandiri, jujur, dan transparan.
            </p>
        </div>
    </div>
</div>

</body>
</html>
