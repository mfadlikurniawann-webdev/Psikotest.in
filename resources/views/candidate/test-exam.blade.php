<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $config['name'] }} - Psikotest.in</title>
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
        * {
            user-select: none;
            -webkit-user-select: none;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: #F8FAFC;
        }
        .q-progress {
            transition: width 0.4s ease;
        }
        .option-btn {
            transition: all 0.15s ease;
            border: 2px solid #E2E8F0;
        }
        .option-btn:hover {
            border-color: #2563EB;
            background: #EFF6FF;
        }
        .option-btn.selected {
            border-color: #2563EB;
            background: #EFF6FF;
            color: #0F172A;
            font-weight: 500;
        }
        .option-indicator {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid #CBD5E1;
            flex-shrink: 0;
            position: relative;
            transition: all 0.15s;
        }
        .option-btn.selected .option-indicator {
            background: #2563EB;
            border-color: #2563EB;
        }
        .option-btn.selected .option-indicator::after {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .timer-warn {
            color: #DC2626;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .v-badge {
            animation: shake 0.4s ease;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
        }
        #webcam-feed {
            border: 2px solid #16A34A;
        }
        .cam-warning {
            border-color: #DC2626 !important;
        }
        .question-enter {
            animation: qIn 0.3s ease;
        }
        @keyframes qIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900" oncontextmenu="return false">

<!-- Header Ujian -->
<header class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 md:px-8 h-14 flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <div class="min-w-0">
            <p class="font-bold text-slate-900 text-sm truncate">{{ $config['name'] }}</p>
            <p class="text-slate-400 text-xs font-medium">Platform Psikotest.in</p>
        </div>
    </div>

    <!-- Progress Ujian -->
    <div class="hidden sm:flex flex-col items-center flex-1 mx-8 max-w-xs">
        <div class="flex items-center justify-between w-full mb-1">
            <span class="text-xs font-semibold text-slate-500">Soal <span id="current-q-num">1</span>/{{ $questions->count() }}</span>
            <span class="text-xs font-semibold text-slate-500" id="progress-pct">0%</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div id="progress-bar" class="q-progress h-full bg-blue-600 rounded-full" style="width:0%"></div>
        </div>
    </div>

    <!-- Status Ujian (Timer, Pelanggaran, Kamera) -->
    <div class="flex items-center gap-4">
        <!-- Timer -->
        <div class="flex items-center gap-1.5 text-sm font-bold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl" id="timer-wrap">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span id="timer" class="text-slate-800 font-mono">--:--</span>
        </div>

        <!-- Pelanggaran -->
        <div class="flex items-center gap-1.5 text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl" id="violation-display">
            <div class="w-2 h-2 rounded-full bg-emerald-600"></div>
            <span class="text-slate-600 font-semibold">Pelanggaran: <span id="v-count" class="font-bold text-slate-800">0</span>/3</span>
        </div>

        <!-- Kamera Feed Proctor -->
        <div class="relative">
            <video id="webcam-feed" width="56" height="42" autoplay muted playsinline class="rounded-lg object-cover w-14 h-10 border border-emerald-500 shadow-sm"></video>
            <div id="cam-status" class="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500"></div>
        </div>
    </div>
</header>

<!-- Area Utama Ujian -->
<main class="pt-20 pb-28 min-h-screen flex flex-col items-center justify-start px-4">
    <div class="w-full max-w-3xl">

        <!-- Banner Info Tahapan Aktif -->
        <div class="mb-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                <div>
                    <p class="text-xs font-bold text-blue-800 uppercase tracking-wider">Tahapan Ujian Aktif</p>
                    <h2 class="text-sm font-bold text-slate-900" id="stage-banner-title">Tahap 1: Kemampuan Verbal</h2>
                </div>
            </div>
            <span class="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-bold shadow-sm" id="stage-q-range">
                Soal 1 - 25
            </span>
        </div>

        <!-- Card Pertanyaan -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 lg:p-8 border-b border-slate-100">
                <div class="flex items-center justify-between mb-4">
                    <span class="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase" id="q-category">
                        VERBAL
                    </span>
                    <span class="text-slate-400 text-xs font-semibold" id="q-number-label">Soal nomor 1 dari 100</span>
                </div>
                
                <p class="text-slate-900 text-lg font-semibold leading-relaxed" id="q-text">
                    Memuat soal...
                </p>
            </div>

            <!-- Pilihan Jawaban -->
            <div class="p-6 lg:p-8 space-y-3.5" id="options-container">
                <!-- Diisi via JavaScript -->
            </div>

            <!-- Tombol Navigasi Bawah -->
            <div class="px-6 lg:px-8 py-5 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                <button type="button" onclick="prevQuestion()"
                    id="btn-prev"
                    class="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition disabled:opacity-30"
                    disabled>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    Sebelumnya
                </button>

                <span class="text-xs text-slate-400 font-semibold sm:hidden"><span id="current-q-num-mobile">1</span>/100</span>

                <button type="button" onclick="nextQuestion()"
                    id="btn-next"
                    class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm">
                    Selanjutnya
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
        </div>

        <!-- Navigator Grid Soal -->
        <div class="mt-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Navigasi Lembar Jawaban</h3>
            
            <div class="space-y-4">
                <!-- Tahap 1 -->
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-2">Tahap 1: Kemampuan Verbal (1-25)</p>
                    <div class="flex flex-wrap gap-2" id="grid-stage-1"></div>
                </div>

                <!-- Tahap 2 -->
                <div class="border-t border-slate-100 pt-3">
                    <p class="text-xs font-bold text-slate-500 mb-2">Tahap 2: Kemampuan Numerik (26-50)</p>
                    <div class="flex flex-wrap gap-2" id="grid-stage-2"></div>
                </div>

                <!-- Tahap 3 -->
                <div class="border-t border-slate-100 pt-3">
                    <p class="text-xs font-bold text-slate-500 mb-2">Tahap 3: Logika & Spasial (51-75)</p>
                    <div class="flex flex-wrap gap-2" id="grid-stage-3"></div>
                </div>

                <!-- Tahap 4 -->
                <div class="border-t border-slate-100 pt-3">
                    <p class="text-xs font-bold text-slate-500 mb-2">Tahap 4: Karakteristik Kerja (76-100)</p>
                    <div class="flex flex-wrap gap-2" id="grid-stage-4"></div>
                </div>
            </div>
        </div>

    </div>
</main>

<!-- Floating Submit Panel di Bawah -->
<div class="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 shadow-2xl py-4 px-6 flex items-center justify-center">
    <div class="w-full max-w-3xl flex items-center justify-between gap-4">
        <div>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Lembar Jawaban</p>
            <p class="text-sm font-semibold text-slate-800">
                Sudah dijawab: <span id="answered-badge" class="font-bold text-blue-600">0</span>/100 soal
            </p>
        </div>
        <button onclick="confirmSubmitModal()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md text-sm transition">
            Kumpulkan Lembar Jawaban
        </button>
    </div>
</div>

<!-- Modal Peringatan Pelanggaran -->
<div id="warning-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);">
    <div class="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-slate-200">
        <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Peringatan Tindakan Pelanggaran</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed" id="modal-msg">Aktivitas mencurigakan terdeteksi.</p>
        
        <div class="flex items-center justify-between border-t border-slate-100 pt-4">
            <button onclick="closeWarningModal()" class="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                Kembali Pengerjaan
            </button>
        </div>
    </div>
</div>

<!-- Modal Diskualifikasi -->
<div id="disqualified-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90" style="backdrop-filter:blur(6px);">
    <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-slate-200 animate-bounce-short">
        <div class="w-16 h-16 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">Akses Tes Dihentikan</h3>
        <p class="text-slate-500 text-sm mb-4 leading-relaxed" id="disq-reason">
            Anda telah melampaui batas pelanggaran toleransi keamanan sistem yang diizinkan (maksimal 3 kali).
        </p>
        <p class="text-xs text-slate-400 mb-6 bg-red-50 p-3 rounded-xl border border-red-100">
            Aksi pelanggaran Anda telah dilaporkan kepada tim HR. Segala aktivitas kognitif dan proctoring telah dikunci.
        </p>
        <a href="{{ route('candidate.dashboard') }}" class="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm shadow-sm transition">
            Kembali ke Dashboard
        </a>
    </div>
</div>

<!-- Modal Konfirmasi Kirim -->
<div id="submit-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(15,23,42,0.6); backdrop-filter:blur(4px);">
    <div class="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-slate-200">
        <h3 class="text-lg font-bold text-slate-900 mb-2">Akhiri & Kumpulkan Jawaban?</h3>
        <p class="text-slate-500 text-sm mb-4 leading-relaxed">
            Anda telah menjawab <span id="answered-count-modal" class="font-bold text-blue-600">0</span> dari 100 soal.
        </p>
        <p class="text-xs text-slate-400 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-normal">
            Pastikan Anda telah mengisi seluruh lembar jawaban dengan teliti. Ujian yang dikirim bersifat final dan tidak dapat diubah kembali.
        </p>
        <div class="flex gap-3">
            <button onclick="document.getElementById('submit-modal').classList.add('hidden')" class="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                Kembali Uji
            </button>
            <button onclick="submitTest()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                Kumpulkan
            </button>
        </div>
    </div>
</div>

<!-- Form Tersembunyi untuk Submit -->
<form id="submit-form" action="{{ route('candidate.test.submit', $type) }}" method="POST" class="hidden">
    @csrf
    <input type="hidden" name="duration" id="duration-input">
    <textarea name="answers" id="answers-input"></textarea>
</form>

<script>
// Data & Konfigurasi Soal
const questions = @json($questions->values());
const maxTime = {{ $config['duration'] }};
const sessionId = {{ $session->id }};
const maxViolations = 3;

let currentIndex = 0;
let answers = {};
let violations = 0;
let startTime = Date.now();
let timerInterval, snapshotInterval, heartbeatInterval;
let stream = null;
let isSubmitting = false;

const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Inisialisasi Navigator Grid Soal
function initNavigatorGrids() {
    const stage1 = document.getElementById('grid-stage-1');
    const stage2 = document.getElementById('grid-stage-2');
    const stage3 = document.getElementById('grid-stage-3');
    const stage4 = document.getElementById('grid-stage-4');

    stage1.innerHTML = '';
    stage2.innerHTML = '';
    stage3.innerHTML = '';
    stage4.innerHTML = '';

    questions.forEach((q, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => goToQuestion(i);
        btn.id = 'dot-' + i;
        btn.className = 'w-8 h-8 rounded-lg text-xs font-semibold border flex items-center justify-center transition';
        
        // Default style
        btn.style.background = '#FFFFFF';
        btn.style.borderColor = '#E2E8F0';
        btn.style.color = '#64748B';

        if (i < 25) {
            stage1.appendChild(btn);
        } else if (i < 50) {
            stage2.appendChild(btn);
        } else if (i < 75) {
            stage3.appendChild(btn);
        } else {
            stage4.appendChild(btn);
        }
        btn.textContent = i + 1;
    });
}

// Render Soal per Indeks
function renderQuestion(idx) {
    if (idx < 0 || idx >= questions.length) return;
    currentIndex = idx;
    const q = questions[idx];

    // Info Soal Header
    document.getElementById('q-text').textContent = q.question;
    
    // Tentukan kategori & label tahap
    let stageTitle = "Tahap 1: Kemampuan Verbal";
    let stageRange = "Soal 1 - 25";
    let catLabel = "Verbal";
    
    if (idx < 25) {
        stageTitle = "Tahap 1: Kemampuan Verbal";
        stageRange = "Soal 1 - 25";
        catLabel = "Verbal";
    } else if (idx < 50) {
        stageTitle = "Tahap 2: Kemampuan Numerik";
        stageRange = "Soal 26 - 50";
        catLabel = "Numerik";
    } else if (idx < 75) {
        stageTitle = "Tahap 3: Penalaran Logika & Spasial";
        stageRange = "Soal 51 - 75";
        catLabel = "Logika & Spasial";
    } else {
        stageTitle = "Tahap 4: Karakteristik Pribadi (Sikap Kerja)";
        stageRange = "Soal 76 - 100";
        catLabel = "Kepribadian Kerja";
    }

    document.getElementById('stage-banner-title').textContent = stageTitle;
    document.getElementById('stage-q-range').textContent = stageRange;
    document.getElementById('q-category').textContent = catLabel;
    document.getElementById('q-number-label').textContent = `Soal nomor ${idx + 1} dari 100`;

    // Render Opsi
    const opts = JSON.parse(q.options);
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    opts.forEach((opt, i) => {
        const selected = answers[idx] === i;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left text-sm text-slate-700 bg-white cursor-pointer' + (selected ? ' selected' : '');
        btn.id = 'opt-' + i;
        btn.onclick = () => selectOption(i);
        btn.innerHTML = `
            <span class="option-indicator" id="indicator-${i}"></span>
            <span>${opt}</span>
        `;
        container.appendChild(btn);
    });

    // Update Navigasi
    document.getElementById('btn-prev').disabled = (idx === 0);
    
    const nextBtn = document.getElementById('btn-next');
    if (idx === questions.length - 1) {
        nextBtn.innerHTML = 'Kumpulkan Lembar Jawaban';
        nextBtn.onclick = () => confirmSubmitModal();
        nextBtn.className = 'flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm';
    } else {
        nextBtn.innerHTML = 'Selanjutnya <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
        nextBtn.onclick = nextQuestion;
        nextBtn.className = 'flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm';
    }

    // Progress Bar Atas
    const pct = Math.round(((idx + 1) / questions.length) * 100);
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = pct + '%';
    document.getElementById('current-q-num').textContent = idx + 1;
    document.getElementById('current-q-num-mobile').textContent = idx + 1;

    // Sinkronisasi Grid Navigator Style
    questions.forEach((q, i) => {
        const dot = document.getElementById('dot-' + i);
        if (!dot) return;

        if (i === idx) {
            dot.style.background = '#2563EB';
            dot.style.borderColor = '#2563EB';
            dot.style.color = '#FFFFFF';
        } else if (answers[i] !== undefined) {
            dot.style.background = '#E2E8F0';
            dot.style.borderColor = '#CBD5E1';
            dot.style.color = '#334155';
        } else {
            dot.style.background = '#FFFFFF';
            dot.style.borderColor = '#E2E8F0';
            dot.style.color = '#64748B';
        }
    });

    container.classList.add('question-enter');
    setTimeout(() => container.classList.remove('question-enter'), 350);
}

function selectOption(optIdx) {
    answers[currentIndex] = optIdx;
    
    // Highlight opsi yang dipilih
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('opt-' + optIdx)?.classList.add('selected');

    // Update Counter Jumlah Jawaban
    const answeredCount = Object.keys(answers).length;
    document.getElementById('answered-badge').textContent = answeredCount;

    // Tandai warna di navigator grid
    const dot = document.getElementById('dot-' + currentIndex);
    if (dot) {
        dot.style.background = '#E2E8F0';
        dot.style.borderColor = '#CBD5E1';
        dot.style.color = '#334155';
    }
}

function nextQuestion() {
    if (currentIndex < questions.length - 1) renderQuestion(currentIndex + 1);
}

function prevQuestion() {
    if (currentIndex > 0) renderQuestion(currentIndex - 1);
}

function goToQuestion(idx) {
    renderQuestion(idx);
}

function confirmSubmitModal() {
    const answeredCount = Object.keys(answers).length;
    document.getElementById('answered-count-modal').textContent = answeredCount;
    document.getElementById('submit-modal').classList.remove('hidden');
}

// Timer Ujian
function startTimer() {
    const endTime = Date.now() + maxTime * 1000;
    timerInterval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        const m = String(Math.floor(remaining / 60)).padStart(2, '0');
        const s = String(remaining % 60).padStart(2, '0');
        const el = document.getElementById('timer');
        el.textContent = `${m}:${s}`;
        
        if (remaining <= 300) {
            el.classList.add('timer-warn');
        }
        if (remaining === 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

// Kamera Web Proctoring
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false });
        document.getElementById('webcam-feed').srcObject = stream;
        document.getElementById('cam-status').style.background = '#16A34A';
        snapshotInterval = setInterval(captureSnapshot, 20000);
    } catch(e) {
        document.getElementById('cam-status').style.background = '#DC2626';
        console.warn('Kamera tidak tersedia:', e.message);
    }
}

function captureSnapshot() {
    if (!stream) return;
    const canvas = document.createElement('canvas');
    const video = document.getElementById('webcam-feed');
    canvas.width = 320;
    canvas.height = 240;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const fd = new FormData();
    fd.append('image', canvas.toDataURL('image/jpeg', 0.5));
    
    fetch('/proctor/snapshot', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrf },
        body: fd
    });
}

// Anti-Cheat Proctoring (Deteksi Pelanggaran)
async function logViolation(type, detail = '') {
    try {
        const res = await fetch('/proctor/violation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
            body: JSON.stringify({ type, detail })
        });
        const data = await res.json();
        violations = data.violations ?? (violations + 1);
        
        updateViolationUI();

        if (data.disqualified) {
            document.getElementById('disq-reason').textContent = `Ujian Anda didiskualifikasi secara otomatis karena melebihi batas pelanggaran (${type.replace('_',' ')}).`;
            document.getElementById('disqualified-modal').classList.remove('hidden');
        } else {
            showWarningModal(type);
        }
    } catch(e) {
        console.error('Error logging violation:', e);
    }
}

function showWarningModal(type) {
    const messages = {
        TAB_SWITCH: 'Sistem mendeteksi Anda berpindah tab browser. Tindakan ini merupakan bentuk pelanggaran.',
        WINDOW_BLUR: 'Jendela ujian kehilangan fokus. Harap fokus sepenuhnya pada layar pengerjaan.',
        FULLSCREEN_EXIT: 'Anda keluar dari mode layar penuh (fullscreen). Harap kembali ke mode layar penuh.',
        FORBIDDEN_KEY: 'Penggunaan tombol keyboard pintasan tidak diizinkan selama tes.',
        COPY_PASTE: 'Tindakan menyalin (copy) atau menempel (paste) dilarang dalam sistem.',
    };
    
    document.getElementById('modal-msg').textContent = messages[type] || 'Aktivitas mencurigakan terdeteksi di luar area ujian.';
    document.getElementById('warning-modal').classList.remove('hidden');
}

function closeWarningModal() {
    document.getElementById('warning-modal').classList.add('hidden');
    requestFullscreen();
}

function updateViolationUI() {
    document.getElementById('v-count').textContent = violations;
    const display = document.getElementById('violation-display');
    const dot = display.querySelector('.rounded-full');
    
    if (violations === 0) {
        dot.style.background = '#16A34A';
    } else if (violations === 1) {
        dot.style.background = '#D97706';
    } else {
        dot.style.background = '#DC2626';
    }
    display.classList.add('v-badge');
    setTimeout(() => display.classList.remove('v-badge'), 400);
}

// Visibility change & window blur
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isSubmitting) logViolation('TAB_SWITCH');
});

window.addEventListener('blur', () => {
    if (!isSubmitting) logViolation('WINDOW_BLUR');
});

// Fullscreen
function requestFullscreen() {
    document.documentElement.requestFullscreen?.();
}

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !isSubmitting) logViolation('FULLSCREEN_EXIT');
});

// Keyboard protection
document.addEventListener('keydown', e => {
    const forbidden = ['F12', 'F5', 'F11'];
    const forbiddenCombo = (e.ctrlKey || e.metaKey) && ['t', 'n', 'w', 'r', 's', 'a', 'u', 'j', 'k', 'c', 'v'].includes(e.key.toLowerCase());
    const altTab = e.altKey && e.key === 'Tab';
    
    if (forbidden.includes(e.key) || forbiddenCombo || altTab) {
        e.preventDefault();
        logViolation('FORBIDDEN_KEY', e.key);
    }
});

// Copy paste cut protection
['copy', 'paste', 'cut'].forEach(ev => {
    document.addEventListener(ev, e => {
        e.preventDefault();
        logViolation('COPY_PASTE', ev);
    });
});

// Heartbeat
function startHeartbeat() {
    heartbeatInterval = setInterval(async () => {
        try {
            const res = await fetch('/proctor/heartbeat', { method: 'POST', headers: { 'X-CSRF-TOKEN': csrf } });
            const data = await res.json();
            if (data.status === 'disqualified') {
                document.getElementById('disqualified-modal').classList.remove('hidden');
            }
        } catch(e) {}
    }, 30000);
}

// Pengumpulan Ujian
function submitTest() {
    isSubmitting = true;
    clearInterval(timerInterval);
    clearInterval(snapshotInterval);
    clearInterval(heartbeatInterval);
    stream?.getTracks().forEach(t => t.stop());
    
    try {
        document.exitFullscreen?.();
    } catch(e) {}

    const duration = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('duration-input').value = duration;
    document.getElementById('answers-input').value = JSON.stringify(answers);
    document.getElementById('submit-form').submit();
}

// Inisialisasi
window.addEventListener('load', async () => {
    initNavigatorGrids();
    await startCamera();
    requestFullscreen();
    startTimer();
    startHeartbeat();
    renderQuestion(0);
});
</script>
</body>
</html>
