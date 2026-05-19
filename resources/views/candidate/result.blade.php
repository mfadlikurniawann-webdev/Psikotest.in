@extends('layouts.app')
@section('title', 'Laporan Hasil Psikotes')

@section('content')
<div class="p-6 lg:p-8 max-w-5xl mx-auto">

    <!-- Header Laporan -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div class="flex items-center gap-4">
            <a href="{{ route('candidate.dashboard') }}" class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Hasil Asesmen Psikotes Terpadu</h1>
                <p class="text-slate-500 text-sm mt-0.5">
                    Nama: {{ $session->user->name }} &middot; Selesai pada: {{ $session->completed_at?->format('d M Y, H:i') }} WIB
                </p>
            </div>
        </div>
        
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-full w-fit">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Proctoring Terverifikasi Aman
        </span>
    </div>

    <!-- Layout Grid -->
    <div class="grid lg:grid-cols-3 gap-8">

        <!-- Kiri: Card Utama IQ & Profil -->
        <div class="space-y-6">
            <!-- Card Skor IQ -->
            <div class="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nilai Inteligensi (IQ)</p>
                <div class="text-6xl font-black text-blue-600 mb-3 tracking-tight">{{ $session->score }}</div>
                
                <span class="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                    {{ $session->personality_type }}
                </span>

                <div class="border-t border-slate-100 pt-6 space-y-3 text-sm text-left">
                    <div class="flex justify-between">
                        <span class="text-slate-500 font-medium">Benar Kognitif</span>
                        <span class="font-bold text-slate-800">{{ $session->correct_answers }} / 75</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500 font-medium">Akurasi Jawaban</span>
                        <span class="font-bold text-slate-800">{{ round(($session->correct_answers / 75) * 100) }}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500 font-medium">Waktu Pengerjaan</span>
                        <span class="font-bold text-slate-800">{{ $session->duration_formatted }}</span>
                    </div>
                </div>
            </div>

            <!-- Card Rekomendasi HR -->
            <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Rekomendasi Penempatan Kerja</h3>
                
                @if($session->score >= 110)
                    <div class="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 text-xs leading-relaxed font-medium">
                        Kandidat memiliki kapasitas kognitif yang superior dengan kemampuan analisis data dan pemecahan masalah yang sangat baik. Sangat cocok ditempatkan pada posisi strategis, kepemimpinan, atau teknis tingkat lanjut.
                    </div>
                @elseif($session->score >= 90)
                    <div class="bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl p-4 text-xs leading-relaxed font-medium">
                        Kandidat memiliki kapasitas berpikir rata-rata yang stabil. Mampu beradaptasi dengan instruksi operasional standar dengan baik, serta dapat belajar hal baru dalam ritme kerja normal perusahaan.
                    </div>
                @else
                    <div class="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs leading-relaxed font-medium">
                        Kandidat disarankan untuk ditempatkan pada posisi dengan alur instruksi kerja operasional terstruktur, sederhana, dan rutin di bawah supervisi berkala dari atasan langsung.
                    </div>
                @endif
            </div>
        </div>

        <!-- Kanan: Psikogram Kerja & Breakdown Tahap -->
        <div class="lg:col-span-2 space-y-6">

            <!-- Card Psikogram Kepribadian Kerja -->
            <div class="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 class="text-base font-bold text-slate-900 mb-2">Profil Kepribadian Kerja (Psikogram)</h2>
                <p class="text-slate-500 text-xs mb-6">Hasil analisis kecocokan kepribadian kerja kandidat (Tahap 4 - Sikap Kerja):</p>

                @if(isset($detail['kepribadian']) && count($detail['kepribadian']) > 0)
                    <div class="space-y-5">
                        @foreach([
                            'integritas' => ['label' => 'Integritas & Etika Kerja', 'desc' => 'Keselarasan antara perkataan, etika kerja, dan tindakan profesional.', 'color' => 'bg-blue-600'],
                            'kolaborasi' => ['label' => 'Kerjasama Tim', 'desc' => 'Kemampuan berkolaborasi dan berkontribusi positif dalam kelompok kerja.', 'color' => 'bg-indigo-600'],
                            'kepemimpinan' => ['label' => 'Kepemimpinan & Inisiatif', 'desc' => 'Keberanian memimpin kelompok, mengambil inisiatif mandiri, dan tanggung jawab.', 'color' => 'bg-violet-600'],
                            'stabilitas' => ['label' => 'Stabilitas Emosi & Manajemen Stres', 'desc' => 'Kemampuan mengendalikan diri dan tetap tenang di bawah tekanan tenggat waktu.', 'color' => 'bg-emerald-600'],
                            'ketelitian' => ['label' => 'Ketelitian & Tanggung Jawab', 'desc' => 'Ketajaman mengelola keakuratan kerja, kerapian data, dan pemenuhan tugas.', 'color' => 'bg-amber-500'],
                        ] as $trait => $meta)
                        @php
                            $score = $detail['kepribadian'][$trait] ?? 50;
                        @endphp
                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-bold text-slate-800">{{ $meta['label'] }}</span>
                                <span class="text-sm font-bold text-slate-950">{{ $score }}%</span>
                            </div>
                            <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 mb-1">
                                <div class="h-full rounded-full transition-all duration-1000 {{ $meta['color'] }}" style="width: {{ $score }}%"></div>
                            </div>
                            <p class="text-slate-400 text-[11px] leading-relaxed">{{ $meta['desc'] }}</p>
                        </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-slate-400 text-sm">Data analisis kepribadian tidak tersedia.</p>
                @endif
            </div>

            <!-- Card Breakdown Detail Tahap Kognitif -->
            <div class="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 class="text-base font-bold text-slate-900 mb-4">Breakdown Akumulasi Kemampuan Kognitif</h2>
                
                <div class="grid md:grid-cols-3 gap-4 text-center">
                    <!-- Tahap 1 -->
                    @php $stage1 = $detail['verbal'] ?? ['correct' => 0, 'total' => 25, 'score' => 0]; @endphp
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tahap 1: Verbal</p>
                        <p class="text-2xl font-black text-slate-800 mb-1">{{ $stage1['correct'] }}<span class="text-slate-400 text-xs font-normal"> / {{ $stage1['total'] }}</span></p>
                        <div class="inline-block bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Skor: {{ $stage1['score'] }}%
                        </div>
                    </div>

                    <!-- Tahap 2 -->
                    @php $stage2 = $detail['numerik'] ?? ['correct' => 0, 'total' => 25, 'score' => 0]; @endphp
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tahap 2: Numerik</p>
                        <p class="text-2xl font-black text-slate-800 mb-1">{{ $stage2['correct'] }}<span class="text-slate-400 text-xs font-normal"> / {{ $stage2['total'] }}</span></p>
                        <div class="inline-block bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Skor: {{ $stage2['score'] }}%
                        </div>
                    </div>

                    <!-- Tahap 3 -->
                    @php $stage3 = $detail['logika'] ?? ['correct' => 0, 'total' => 25, 'score' => 0]; @endphp
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tahap 3: Logika</p>
                        <p class="text-2xl font-black text-slate-800 mb-1">{{ $stage3['correct'] }}<span class="text-slate-400 text-xs font-normal"> / {{ $stage3['total'] }}</span></p>
                        <div class="inline-block bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Skor: {{ $stage3['score'] }}%
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <!-- Tombol Navigasi Bawah -->
    <div class="mt-8 flex gap-3">
        <a href="{{ route('candidate.dashboard') }}" class="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold px-5 py-3 rounded-xl transition shadow-sm">
            Kembali ke Dashboard
        </a>
    </div>

</div>
@endsection
