@extends('layouts.app')
@section('title', 'Mulai Psikotes Karyawan')

@section('content')
<div class="p-6 lg:p-8 max-w-4xl mx-auto">

    <!-- Back Button -->
    <div class="mb-6">
        <a href="{{ route('candidate.dashboard') }}" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Kembali ke Dashboard
        </a>
    </div>

    <!-- Onboarding Panel -->
    <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 lg:p-10">
            <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ $config['name'] }}</h1>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">{{ $config['description'] }}</p>

            <div class="grid md:grid-cols-2 gap-8">
                <!-- Left Column: Instructions -->
                <div class="space-y-6">
                    <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Penting Sebelum Memulai</h2>
                    
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm">Durasi 60 Menit</h3>
                                <p class="text-slate-500 text-xs mt-0.5">Waktu berjalan otomatis sejak tombol "Mulai Ujian" diklik.</p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm">Total 100 Soal</h3>
                                <p class="text-slate-500 text-xs mt-0.5">Terbagi menjadi 4 tahap berurutan (Verbal, Numerik, Logika, Kepribadian).</p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm">Pengawasan Proctoring Aktif</h3>
                                <p class="text-slate-500 text-xs mt-0.5">Kamera akan mengambil gambar secara acak untuk memverifikasi keaslian pengerjaan.</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
                        Peringatan: Keluar dari mode layar penuh (fullscreen) atau membuka tab lain akan terdeteksi sebagai pelanggaran. Batas toleransi pelanggaran sistem adalah maksimal 3 kali.
                    </div>
                </div>

                <!-- Right Column: Camera Check -->
                <div class="flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                    <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verifikasi Kamera Web</h2>
                    
                    <div class="relative w-full max-w-[280px] aspect-[4/3] bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 mb-4 shadow-inner flex items-center justify-center">
                        <video id="start-webcam" class="absolute inset-0 w-full h-full object-cover hidden" autoplay muted playsinline></video>
                        <div id="start-cam-placeholder" class="text-slate-400 text-xs px-4">
                            Mengaktifkan kamera...
                        </div>
                    </div>

                    <p class="text-xs text-slate-500 max-w-[280px] leading-relaxed mb-6">
                        Pastikan wajah Anda terlihat dengan jelas pada kotak preview di atas dengan pencahayaan yang cukup sebelum menekan tombol mulai.
                    </p>

                    @if($existing)
                        <div class="text-xs font-bold text-slate-700 bg-slate-200/50 px-4 py-2.5 rounded-xl border border-slate-300 w-full max-w-[280px]">
                            Anda Sudah Menyelesaikan Tes Ini
                        </div>
                    @else
                        <a href="{{ route('candidate.test.exam', 'psikotes') }}" id="btn-start-test" class="block w-full max-w-[280px] text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition shadow-sm pointer-events-none opacity-50">
                            Mulai Ujian
                        </a>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const video = document.getElementById('start-webcam');
    const placeholder = document.getElementById('start-cam-placeholder');
    const startBtn = document.getElementById('btn-start-test');

    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            video.srcObject = stream;
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            if (startBtn) {
                startBtn.classList.remove('pointer-events-none', 'opacity-50');
            }
        } catch (e) {
            placeholder.textContent = 'Kamera tidak diizinkan atau tidak terdeteksi. Silakan aktifkan izin kamera agar tombol ujian aktif.';
            placeholder.classList.remove('text-slate-400');
            placeholder.classList.add('text-red-600', 'font-semibold');
        }
    }

    window.addEventListener('DOMContentLoaded', initCamera);
</script>
@endsection
