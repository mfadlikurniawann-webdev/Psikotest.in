<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Psikotest.in') - Platform Asesmen Psikologi Karyawan</title>
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
            color: #0F172A;
        }
        .sidebar {
            transition: transform 0.3s ease;
        }
        @media (max-width: 1024px) {
            .sidebar-hidden {
                transform: translateX(-100%);
            }
        }
        .card-hover {
            transition: all 0.2s ease;
        }
        .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
        }
    </style>
    @stack('styles')
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">

<!-- Top Navbar Mobile -->
<div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 h-14">
    <button id="sidebarToggle" class="text-white p-1">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
    <span class="font-bold text-white text-lg tracking-wide">Psikotest.in</span>
    <div class="w-8"></div>
</div>

<div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside id="sidebar" class="sidebar fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white z-30 flex flex-col overflow-y-auto sidebar-hidden lg:translate-x-0 border-r border-slate-800">
        <!-- Logo -->
        <div class="px-6 py-6 border-b border-slate-800">
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

        <!-- User Info -->
        @auth
        <div class="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-semibold truncate">{{ auth()->user()->name }}</p>
                    <p class="text-slate-400 text-xs truncate">
                        {{ auth()->user()->role === 'hr' ? 'HR Administrator' : 'Kandidat Karyawan' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1.5">
            @if(auth()->user()->role === 'hr')
                <a href="{{ route('hr.dashboard') }}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium {{ request()->routeIs('hr.dashboard') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-300 hover:text-white hover:bg-slate-800' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg>
                    Dashboard HR
                </a>
                <a href="{{ route('hr.candidates') }}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium {{ request()->routeIs('hr.candidates*') || request()->routeIs('hr.candidate.detail*') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-300 hover:text-white hover:bg-slate-800' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    Daftar Kandidat
                </a>
            @else
                <a href="{{ route('candidate.dashboard') }}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium {{ request()->routeIs('candidate.dashboard') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-300 hover:text-white hover:bg-slate-800' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Dashboard
                </a>
                <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 pt-6 pb-2">Ujian Tersedia</p>
                <a href="{{ route('candidate.test.start', 'psikotes') }}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium {{ request()->is('candidate/test*') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-300 hover:text-white hover:bg-slate-800' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Psikotes Karyawan
                </a>
            @endif
        </nav>
        @endauth

        <!-- Logout -->
        @auth
        <div class="px-4 py-4 border-t border-slate-800">
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Keluar
                </button>
            </form>
        </div>
        @endauth
    </aside>

    <!-- Overlay Mobile -->
    <div id="sidebarOverlay" class="hidden fixed inset-0 bg-black/50 z-20 lg:hidden"></div>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 pt-14 lg:pt-0">
        <!-- Messages -->
        @if(session('success'))
        <div class="alert mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start gap-3 shadow-sm">
            <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="flex-1">
                {{ session('success') }}
            </div>
        </div>
        @endif
        @if(session('info'))
        <div class="alert mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-start gap-3 shadow-sm">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="flex-1">
                {{ session('info') }}
            </div>
        </div>
        @endif
        @if(session('error'))
        <div class="alert mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start gap-3 shadow-sm">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <div class="flex-1">
                {{ session('error') }}
            </div>
        </div>
        @endif

        @yield('content')
    </main>
</div>

<script>
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');

    function openSidebar() {
        sidebar.classList.remove('sidebar-hidden');
        overlay.classList.remove('hidden');
    }
    function closeSidebar() {
        sidebar.classList.add('sidebar-hidden');
        overlay.classList.add('hidden');
    }

    sidebarToggle?.addEventListener('click', openSidebar);
    overlay?.addEventListener('click', closeSidebar);
</script>
@stack('scripts')
</body>
</html>
