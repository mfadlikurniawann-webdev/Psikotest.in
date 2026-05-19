@extends('layouts.app')
@section('title', 'Dashboard Kandidat')

@section('content')
<div class="p-6 lg:p-8 max-w-5xl mx-auto">

    <!-- Header Selamat Datang -->
    <div class="mb-8">
        <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-lg">
                {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
            </div>
            <div>
                <h1 class="text-xl font-bold text-slate-900">Selamat datang, {{ explode(' ', auth()->user()->name)[0] }}</h1>
                <p class="text-slate-500 text-sm">
                    @if(auth()->user()->position_applied)
                        Posisi yang dilamar: <span class="font-semibold text-slate-700">{{ auth()->user()->position_applied }}</span>
                    @else
                        Selesaikan asesmen psikotes karyawan untuk melanjutkan proses rekrutmen.
                    @endif
                </p>
            </div>
        </div>
    </div>

    <!-- Modul Psikotes -->
    <div class="mb-8">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Modul Asesmen Psikotes</h2>
        
        @php
            $session = auth()->user()->testSessions()->where('test_type', 'psikotes')->latest()->first();
            $completed = $session && $session->status === 'completed';
            $disqualified = $session && $session->status === 'disqualified';
            $inProgress = $session && $session->status === 'in_progress';
        @endphp

        <div class="grid md:grid-cols-3 gap-6">
            <!-- Card Ujian Psikotes -->
            <div class="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                    <div class="flex items-start justify-between mb-4">
                        <span class="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                            Asesmen Utama
                        </span>
                        @if($completed)
                            <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-accent-success rounded-full">Selesai</span>
                        @elseif($disqualified)
                            <span class="text-xs font-semibold px-2.5 py-1 bg-red-50 text-accent-danger rounded-full">Didiskualifikasi</span>
                        @elseif($inProgress)
                            <span class="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-accent-warning rounded-full">Sedang Berjalan</span>
                        @else
                            <span class="text-xs text-slate-400">Durasi: 60 Menit</span>
                        @endif
                    </div>
                    
                    <h3 class="font-bold text-slate-900 text-lg mb-2">Psikotes Terpadu Karyawan</h3>
                    <p class="text-slate-500 text-sm mb-6 leading-relaxed">
                        Mengukur potensi akademik, daya penalaran, serta karakteristik kepribadian kerja untuk mencocokkan profil kompetensi Anda dengan kebutuhan posisi jabatan di perusahaan.
                    </p>

                    <!-- Informasi 4 Tahap -->
                    <div class="border-t border-slate-100 pt-4 mb-6">
                        <p class="text-xs font-bold text-slate-400 uppercase mb-3">Struktur Ujian (Total 100 Soal):</p>
                        <div class="grid grid-cols-2 gap-3 text-sm text-slate-600">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Tahap 1: Tes Verbal (25 Soal)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Tahap 2: Tes Numerik (25 Soal)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Tahap 3: Tes Logika & Spasial (25 Soal)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Tahap 4: Karakteristik Kerja (25 Soal)</span>
                            </div>
                        </div>
                    </div>
                </div>

                @if($completed)
                    <div class="flex items-center gap-3">
                        <a href="{{ route('candidate.test.result', $session->id) }}" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition shadow-sm">
                            Lihat Laporan Hasil Tes
                        </a>
                    </div>
                @elseif($disqualified)
                    <div class="bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-red-800 leading-relaxed">
                        Pengerjaan tes Anda dihentikan secara otomatis oleh sistem karena terdeteksi tindakan pelanggaran keamanan yang berulang. Silakan hubungi tim HR recruitment untuk koordinasi lebih lanjut.
                    </div>
                @elseif($inProgress)
                    <a href="{{ route('candidate.test.exam', 'psikotes') }}" class="block text-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-3 rounded-xl transition shadow-sm">
                        Lanjutkan Pengerjaan Ujian
                    </a>
                @else
                    <a href="{{ route('candidate.test.start', 'psikotes') }}" class="block text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition shadow-sm">
                        Mulai Asesmen Psikotes
                    </a>
                @endif
            </div>

            <!-- Card Ringkasan Skor (Kanan) -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                    <h3 class="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider text-slate-400">Ringkasan Hasil</h3>
                    
                    @if($completed)
                        <div class="text-center py-6">
                            <p class="text-slate-400 text-xs font-semibold mb-1">Skor IQ Anda</p>
                            <p class="text-5xl font-black text-blue-600 mb-2">{{ $session->score }}</p>
                            <span class="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {{ $session->personality_type }}
                            </span>
                        </div>
                        
                        <div class="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-500">Kognitif Benar</span>
                                <span class="font-semibold text-slate-800">{{ $session->correct_answers }} / 75 Soal</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Durasi Pengerjaan</span>
                                <span class="font-semibold text-slate-800">{{ $session->duration_formatted }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Status Proctoring</span>
                                <span class="font-semibold text-emerald-600">Terverifikasi Aman</span>
                            </div>
                        </div>
                    @else
                        <div class="text-center py-12 text-slate-400">
                            <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <p class="text-sm">Selesaikan ujian untuk melihat kalkulasi nilai IQ dan pemetaan karakteristik kerja.</p>
                        </div>
                    @endif
                </div>

                <div class="border-t border-slate-100 pt-4 mt-4">
                    <p class="text-xs text-slate-400 leading-relaxed">
                        Data tes dilindungi kebijakan privasi perusahaan dan hanya digunakan untuk kepentingan penilaian rekrutmen internal.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Tata Tertib & Peraturan -->
    <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <h3 class="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider text-blue-900">Petunjuk Pelaksanaan & Tata Tertib</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-slate-700 leading-relaxed">
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Izinkan akses kamera laptop Anda sebelum memulai ujian karena sistem menggunakan pengawasan visual proctoring.</p>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Ujian disarankan dilakukan dalam mode layar penuh (fullscreen) dan dilarang berpindah ke jendela browser atau aplikasi lain.</p>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Setiap aksi keluar layar atau mengganti tab browser akan dideteksi dan dicatat sistem sebagai tindakan pelanggaran.</p>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Kandidat yang melakukan pelanggaran lebih dari 3 kali akan otomatis didiskualifikasi secara permanen.</p>
            </div>
        </div>
    </div>

</div>
@endsection
