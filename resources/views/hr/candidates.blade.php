@extends('layouts.app')
@section('title', 'Daftar Kandidat Karyawan')

@section('content')
<div class="p-6 lg:p-8 max-w-7xl mx-auto">

    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Daftar Kandidat Karyawan</h1>
            <p class="text-slate-500 text-sm mt-1">Kelola akun login dan evaluasi psikotes seluruh kandidat rekrutmen</p>
        </div>
        <button onclick="document.getElementById('invite-modal').classList.remove('hidden')"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Buat Akun Kandidat
        </button>
    </div>

    <!-- Filter Pencarian -->
    <form method="GET" class="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama atau email..."
            class="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50">
        
        <select name="position" class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 bg-slate-50">
            <option value="">Semua Posisi</option>
            @foreach($positions as $pos)
            <option value="{{ $pos }}" {{ request('position') === $pos ? 'selected' : '' }}>{{ $pos }}</option>
            @endforeach
        </select>
        
        <button type="submit" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
            Filter
        </button>
        
        @if(request('search') || request('position'))
        <a href="{{ route('hr.candidates') }}" class="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition text-center flex items-center justify-center">
            Reset
        </a>
        @endif
    </form>

    <!-- Tabel Data Kandidat -->
    <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead>
                    <tr class="border-b border-slate-200 bg-slate-50/75">
                        <th class="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Kandidat</th>
                        <th class="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Posisi Dilamar</th>
                        <th class="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-4 text-center">Status Psikotes</th>
                        <th class="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-4 text-center">Hasil IQ Poin</th>
                        <th class="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($candidates as $candidate)
                    @php
                        $session = $candidate->testSessions->first();
                        $completed = $session && $session->status === 'completed';
                        $disqualified = $session && $session->status === 'disqualified';
                        $inProgress = $session && $session->status === 'in_progress';
                    @endphp
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4.5">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                                    {{ strtoupper(substr($candidate->name, 0, 2)) }}
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900">{{ $candidate->name }}</p>
                                    <p class="text-slate-400 text-xs mt-0.5">{{ $candidate->email }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4.5 hidden md:table-cell text-slate-600 text-sm font-medium">
                            {{ $candidate->position_applied ?: 'Tidak ditentukan' }}
                        </td>
                        <td class="px-4 py-4.5 text-center">
                            @if($completed)
                                <span class="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Selesai</span>
                            @elseif($disqualified)
                                <span class="inline-block bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Didiskualifikasi</span>
                            @elseif($inProgress)
                                <span class="inline-block bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Sedang Ujian</span>
                            @else
                                <span class="inline-block bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">Belum Memulai</span>
                            @endif
                        </td>
                        <td class="px-4 py-4.5 text-center">
                            @if($completed)
                                <span class="font-extrabold text-base text-blue-600">{{ $session->score }}</span>
                                <span class="text-slate-400 text-xs font-medium">({{ $session->personality_type }})</span>
                            @else
                                <span class="text-slate-300">-</span>
                            @endif
                        </td>
                        <td class="px-6 py-4.5 text-right">
                            <div class="flex items-center justify-end gap-3">
                                <a href="{{ route('hr.candidate.detail', $candidate->id) }}"
                                    class="text-blue-600 hover:text-blue-700 text-xs font-bold transition">
                                    Lihat Detail Laporan
                                </a>
                                <span class="text-slate-200">|</span>
                                <form action="{{ route('hr.candidate.delete', $candidate->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus kandidat ini secara permanen?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-semibold transition">
                                        Hapus
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-16 text-center text-slate-400">
                            <svg class="w-10 h-10 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <p class="font-semibold text-sm">Tidak Ada Kandidat Ditemukan</p>
                            <p class="text-xs text-slate-400 mt-1">Daftarkan kandidat baru untuk memulai proses asesmen.</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($candidates->hasPages())
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            {{ $candidates->appends(request()->query())->links() }}
        </div>
        @endif
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
