@extends('layouts.app')
@section('title', 'Dashboard HR')

@section('content')
<div class="p-6 lg:p-8 max-w-7xl mx-auto">

    <!-- Header Dashboard -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Dashboard HR</h1>
            <p class="text-slate-500 text-sm mt-1">Ringkasan aktivitas dan hasil Asesmen Psikotes Terpadu Karyawan</p>
        </div>
        <button onclick="document.getElementById('invite-modal').classList.remove('hidden')"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Buat Akun Kandidat
        </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        @foreach([
            ['Total Kandidat', $stats['total_candidates'], 'text-blue-600', 'bg-blue-50', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'],
            ['Total Sesi Tes', $stats['total_sessions'], 'text-indigo-600', 'bg-indigo-50', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
            ['Selesai Ujian', $stats['completed'], 'text-emerald-600', 'bg-emerald-50', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['Diskualifikasi', $stats['disqualified'], 'text-red-600', 'bg-red-50', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['Rata-rata IQ', round($stats['avg_iq']), 'text-amber-600', 'bg-amber-50', 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'],
        ] as [$label, $value, $textColor, $bgColor, $icon])
        <div class="card-hover bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="flex items-start justify-between mb-3">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">{{ $label }}</p>
                <div class="w-8 h-8 {{ $bgColor }} {{ $textColor }} rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{{ $icon }}"/></svg>
                </div>
            </div>
            <p class="font-extrabold text-2xl text-slate-900">{{ $value }}</p>
        </div>
        @endforeach
    </div>

    <!-- Dua Kolom Detail -->
    <div class="grid lg:grid-cols-3 gap-8">
        
        <!-- Kiri: Daftar Sesi Terbaru -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Aktivitas Sesi Terkini</h2>
                <a href="{{ route('hr.candidates') }}" class="text-blue-600 text-xs font-bold hover:text-blue-700">Lihat semua</a>
            </div>
            
            <div class="divide-y divide-slate-100">
                @forelse($recentSessions as $session)
                <div class="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                        {{ strtoupper(substr($session->user->name ?? '?', 0, 2)) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-900 truncate">{{ $session->user->name ?? 'User terhapus' }}</p>
                        <p class="text-xs text-slate-400 font-medium">
                            Posisi: {{ $session->user->position_applied ?? 'Tidak dispesifikasi' }} &middot; Selesai {{ $session->completed_at?->diffForHumans() }}
                        </p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        @if($session->status === 'completed')
                            <span class="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                IQ {{ $session->score }} ({{ $session->personality_type }})
                            </span>
                        @elseif($session->status === 'disqualified')
                            <span class="inline-block bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">Didiskualifikasi</span>
                        @elseif($session->status === 'in_progress')
                            <span class="inline-block bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Pengerjaan</span>
                        @else
                            <span class="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{{ $session->status_label }}</span>
                        @endif
                    </div>
                    <a href="{{ route('hr.candidate.detail', $session->user_id) }}" class="text-slate-300 hover:text-slate-600 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>
                @empty
                <div class="px-6 py-16 text-center text-slate-400 text-sm">Belum ada aktivitas pengerjaan tes saat ini.</div>
                @endforelse
            </div>
        </div>

        <!-- Kanan: Distribusi Skor IQ -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
                <h2 class="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Distribusi Nilai IQ</h2>
                
                <div class="space-y-4">
                    @php $maxVal = max(array_values($scoreDistribution)) ?: 1; @endphp
                    @foreach($scoreDistribution as $range => $count)
                    @php $pct = round(($count / $maxVal) * 100); @endphp
                    <div>
                        <div class="flex justify-between text-xs font-semibold mb-1.5">
                            <span class="text-slate-500">IQ {{ $range }}</span>
                            <span class="text-slate-800">{{ $count }} Kandidat</span>
                        </div>
                        <div class="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div class="h-full bg-blue-600 rounded-full" style="width:{{ $pct }}%"></div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-100">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Rata-rata Inteligensi Total</p>
                <p class="text-3xl font-black text-slate-800">{{ round($stats['avg_iq']) }} <span class="text-slate-400 text-sm font-normal">IQ Poin</span></p>
            </div>
        </div>

    </div>

</div>

<!-- Modal Buat Akun Kandidat -->
<div id="invite-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);">
    <div class="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-slate-900 text-lg">Buat Akun Kandidat Baru</h3>
            <button onclick="document.getElementById('invite-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        
        <form action="{{ route('hr.invite') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input type="text" name="name" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Budi Santoso">
            </div>
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Email Aktif</label>
                <input type="email" name="email" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="budi@email.com">
            </div>
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Posisi Pekerjaan</label>
                <input type="text" name="position_applied" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Marketing Executive">
            </div>
            <div>
                <label class="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Kata Sandi (Opsional)</label>
                <input type="text" name="password" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Kosongkan untuk auto-generate sandi acak">
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition mt-2">
                Simpan & Daftarkan Akun
            </button>
        </form>
    </div>
</div>
@endsection
