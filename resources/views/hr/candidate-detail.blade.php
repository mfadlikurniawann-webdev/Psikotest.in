@extends('layouts.app')
@section('title', 'Laporan Detail Psikotes Kandidat')

@section('content')
<div class="p-6 lg:p-8 max-w-6xl mx-auto">

    <!-- Header Laporan -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div class="flex items-center gap-4">
            <a href="{{ route('hr.candidates') }}" class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Laporan Detail Asesmen Psikotes</h1>
                <p class="text-slate-500 text-sm mt-0.5">
                    Kandidat: {{ $candidate->name }} &middot; Posisi: {{ $candidate->position_applied ?: 'Tidak dispesifikasi' }}
                </p>
            </div>
        </div>

        @if($session && $session->status === 'completed')
        <a href="{{ route('hr.result.pdf', $session->id) }}" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Unduh Laporan PDF
        </a>
        @endif
    </div>

    @if(!$session)
        <!-- Kondisi Belum Memulai -->
        <div class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Kandidat Belum Memulai Ujian</h3>
            <p class="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Akun kandidat telah berhasil didaftarkan namun belum memulai atau menyelesaikan sesi ujian Psikotes Terpadu Karyawan.
            </p>
        </div>
    @elseif($session->status === 'in_progress')
        <!-- Kondisi Sedang Mengerjakan -->
        <div class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm animate-pulse">
            <svg class="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Sesi Ujian Sedang Berlangsung</h3>
            <p class="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Kandidat saat ini sedang aktif mengerjakan lembar ujian Psikotes Terpadu di browser mereka. Statistik hasil akan dikalkulasi secara realtime setelah pengiriman lembar jawaban selesai.
            </p>
        </div>
    @elseif($session->status === 'disqualified')
        <!-- Kondisi Didiskualifikasi -->
        <div class="bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-sm">
            <svg class="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <h3 class="text-lg font-bold text-red-900 mb-2">Akses Ujian Didiskualifikasi Sistem</h3>
            <p class="text-red-700 text-sm max-w-lg mx-auto leading-relaxed mb-6">
                Ujian kandidat dihentikan paksa oleh sistem dikarenakan melanggar tata tertib dan petunjuk pengerjaan (keluar layar, mengganti tab browser) sebanyak 3 kali berturut-turut.
            </p>
            <div class="max-w-md mx-auto bg-white border border-red-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <p class="font-bold text-slate-800 uppercase tracking-wide border-b pb-1.5 mb-2">Log Pelanggaran Keamanan:</p>
                @foreach($session->violations as $index => $v)
                    <div class="flex justify-between">
                        <span class="text-slate-500">{{ $index + 1 }}. {{ $v->violation_type }} &middot; {{ $v->created_at->format('H:i:s') }} WIB</span>
                        <span class="text-red-600 font-semibold">{{ $v->detail }}</span>
                    </div>
                @endforeach
            </div>
        </div>
    @else
        <!-- Laporan Hasil Lengkap -->
        <div class="grid lg:grid-cols-3 gap-8">

            <!-- Kiri: Identitas & IQ Summary -->
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
                            <span class="text-slate-500 font-medium">Kognitif Benar</span>
                            <span class="font-bold text-slate-800">{{ $session->correct_answers }} / 75 Soal</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Akurasi Jawaban</span>
                            <span class="font-bold text-slate-800">{{ round(($session->correct_answers / 75) * 100) }}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Waktu Pengerjaan</span>
                            <span class="font-bold text-slate-800">{{ $session->duration_formatted }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Skor Pelanggaran</span>
                            <span class="font-bold {{ $session->violation_count > 0 ? 'text-red-600' : 'text-emerald-600' }}">{{ $session->violation_count }} Pelanggaran</span>
                        </div>
                    </div>
                </div>

                <!-- Card Profil Pelamar -->
                <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Profil Pelamar</h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <span class="text-slate-400 block text-xs uppercase tracking-wider font-semibold">Nama Lengkap</span>
                            <span class="font-bold text-slate-800">{{ $candidate->name }}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 block text-xs uppercase tracking-wider font-semibold">Alamat Email</span>
                            <span class="font-semibold text-slate-800">{{ $candidate->email }}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 block text-xs uppercase tracking-wider font-semibold">Posisi Jabatan</span>
                            <span class="font-semibold text-slate-800">{{ $candidate->position_applied ?: 'Tidak dispesifikasi' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Card Rekomendasi HR -->
                <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Kesimpulan & Rekomendasi</h3>
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

            <!-- Kanan: Psikogram Kepribadian & Rincian Kognitif -->
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

                <!-- Card Rincian Tahap Kognitif -->
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

                <!-- Card Log Aktivitas Keamanan Proctoring -->
                @if($session->violations->count() > 0)
                <div class="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <h2 class="text-base font-bold text-slate-900 mb-4">Log Pelanggaran Proctoring</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead>
                                <tr class="border-b border-slate-200 bg-slate-50">
                                    <th class="font-bold text-slate-500 px-4 py-2">Waktu</th>
                                    <th class="font-bold text-slate-500 px-4 py-2">Tipe Pelanggaran</th>
                                    <th class="font-bold text-slate-500 px-4 py-2">Detail Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @foreach($session->violations as $v)
                                <tr>
                                    <td class="px-4 py-2.5 font-medium text-slate-500">{{ $v->created_at->format('H:i:s') }} WIB</td>
                                    <td class="px-4 py-2.5 font-bold text-red-600">{{ $v->violation_type }}</td>
                                    <td class="px-4 py-2.5 text-slate-600">{{ $v->detail }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif

            </div>

        </div>
    @endif

</div>
@endsection
