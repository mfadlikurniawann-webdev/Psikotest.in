<?php

namespace App\Http\Controllers;

use App\Models\TestSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    private array $testConfig = [
        'psikotes' => [
            'name' => 'Psikotes Terpadu Karyawan',
            'duration' => 3600, // 60 menit
            'description' => 'Asesmen psikologi terpadu untuk mengukur kecerdasan (IQ) dan kompetensi kepribadian kerja.'
        ]
    ];

    public function start(string $type)
    {
        // Selalu alihkan/gunakan psikotes jika tipe tidak dikenal
        if ($type !== 'psikotes') {
            return redirect()->route('candidate.test.start', 'psikotes');
        }

        $existing = TestSession::where('user_id', Auth::id())
            ->where('test_type', 'psikotes')
            ->where('status', 'completed')
            ->first();

        // Ambil jumlah soal untuk info
        $totalQuestions = DB::table('test_questions')->where('test_type', 'psikotes')->count();
        $config = $this->testConfig['psikotes'];

        return view('candidate.test-start', compact('type', 'config', 'totalQuestions', 'existing'));
    }

    public function exam(string $type)
    {
        if ($type !== 'psikotes') {
            return redirect()->route('candidate.test.exam', 'psikotes');
        }

        // Cek jika sudah ada sesi yang in_progress
        $session = TestSession::where('user_id', Auth::id())
            ->where('test_type', 'psikotes')
            ->where('status', 'in_progress')
            ->first();

        if (!$session) {
            $session = TestSession::create([
                'user_id'         => Auth::id(),
                'test_type'       => 'psikotes',
                'status'          => 'in_progress',
                'total_questions' => DB::table('test_questions')->where('test_type', 'psikotes')->count(),
                'started_at'      => now(),
            ]);
        }

        session(['current_session_id' => $session->id]);

        $questions = DB::table('test_questions')
            ->where('test_type', 'psikotes')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        $config = $this->testConfig['psikotes'];

        return view('candidate.test-exam', compact('type', 'config', 'questions', 'session'));
    }

    public function submit(Request $request, string $type)
    {
        $sessionId = session('current_session_id') ?? TestSession::where('user_id', Auth::id())->where('status', 'in_progress')->latest()->value('id');
        
        if (!$sessionId) {
            return redirect()->route('candidate.dashboard');
        }

        $session = TestSession::findOrFail($sessionId);

        if ($session->user_id !== Auth::id()) abort(403);

        // Answers is a JSON string or array
        $answersInput = $request->input('answers', []);
        $answers = is_string($answersInput) ? json_decode($answersInput, true) : $answersInput;
        $duration = (int)$request->input('duration', 0);

        // Ambil semua soal psikotes
        $questions = DB::table('test_questions')
            ->where('test_type', 'psikotes')
            ->orderBy('order')
            ->get();

        $correctCognitive = 0;
        $totalCognitive = 75; // Soal 1 - 75 adalah kognitif (verbal, numerik, logika)

        // Detail Tahapan
        $verbalCorrect = 0;
        $numerikCorrect = 0;
        $logikaCorrect = 0;

        // Kepribadian (Soal 76 - 100)
        $personalityTraits = [
            'integritas' => 0,  // Integritas & Etika Kerja (soal 76-80)
            'kolaborasi' => 0,  // Kerjasama Tim (soal 81-85)
            'kepemimpinan' => 0, // Kepemimpinan (soal 86-90)
            'stabilitas' => 0,   // Stabilitas Emosi (soal 91-95)
            'ketelitian' => 0    // Ketelitian & Tanggung Jawab (soal 96-100)
        ];

        $personalityCounts = [
            'integritas' => 0,
            'kolaborasi' => 0,
            'kepemimpinan' => 0,
            'stabilitas' => 0,
            'ketelitian' => 0
        ];

        foreach ($questions as $i => $q) {
            // Indeks soal (0-99)
            $userAns = $answers[$i] ?? null;

            if ($i < 75) {
                // Evaluasi Kognitif
                $isCorrect = ($userAns !== null && (int)$userAns === (int)$q->correct_answer);
                if ($isCorrect) {
                    $correctCognitive++;
                    if ($i < 25) {
                        $verbalCorrect++;
                    } elseif ($i < 50) {
                        $numerikCorrect++;
                    } else {
                        $logikaCorrect++;
                    }
                }
            } else {
                // Evaluasi Kepribadian (Likert 1-4)
                // Jika tidak dijawab, beri default 2 (Kurang Sesuai)
                $score = ($userAns !== null) ? ((int)$userAns + 1) : 2; 
                $category = $q->category; // integritas, kolaborasi, dll

                if (isset($personalityTraits[$category])) {
                    $personalityTraits[$category] += $score;
                    $personalityCounts[$category]++;
                }
            }
        }

        // Kalkulasi Skor IQ (Maksimal benar 75, IQ berkisar antara 70 sampai 140)
        $iq = 70 + (int)round(($correctCognitive / $totalCognitive) * 70);

        // Klasifikasi IQ
        $classification = 'Rata-rata';
        if ($iq >= 130) {
            $classification = 'Sangat Superior';
        } elseif ($iq >= 120) {
            $classification = 'Superior';
        } elseif ($iq >= 110) {
            $classification = 'Rata-rata Atas';
        } elseif ($iq >= 90) {
            $classification = 'Rata-rata';
        } elseif ($iq >= 80) {
            $classification = 'Rata-rata Bawah';
        } else {
            $classification = 'Batas Lambat Belajar';
        }

        // Hitung persentase kompetensi kepribadian (Skor maksimal per kategori = 5 soal * 4 = 20)
        $personalityResult = [];
        foreach ($personalityTraits as $trait => $totalScore) {
            $maxScore = ($personalityCounts[$trait] ?: 5) * 4;
            $personalityResult[$trait] = (int)round(($totalScore / $maxScore) * 100);
        }

        // Detail lengkap akumulasi untuk disimpan di database
        $resultDetail = [
            'iq' => $iq,
            'classification' => $classification,
            'verbal' => [
                'correct' => $verbalCorrect,
                'total' => 25,
                'score' => (int)round(($verbalCorrect / 25) * 100)
            ],
            'numerik' => [
                'correct' => $numerikCorrect,
                'total' => 25,
                'score' => (int)round(($numerikCorrect / 25) * 100)
            ],
            'logika' => [
                'correct' => $logikaCorrect,
                'total' => 25,
                'score' => (int)round(($logikaCorrect / 25) * 100)
            ],
            'kepribadian' => $personalityResult
        ];

        // Simpan skor IQ di kolom `score` dan klasifikasi di `personality_type`
        $session->update([
            'status'           => 'completed',
            'answers'          => $answers,
            'score'            => $iq, // Simpan IQ di kolom score
            'result_detail'    => $resultDetail,
            'personality_type' => $classification, // Simpan Kategori Kecerdasan di kolom personality_type
            'correct_answers'  => $correctCognitive,
            'duration_seconds' => $duration,
            'completed_at'     => now(),
        ]);

        session()->forget('current_session_id');

        return redirect()->route('candidate.test.result', $session->id);
    }

    public function result(int $session)
    {
        $session = TestSession::with('user')->findOrFail($session);
        if ($session->user_id !== Auth::id() && Auth::user()->role !== 'hr') abort(403);

        $detail = $session->result_detail ?? [];
        $config = $this->testConfig['psikotes'] ?? [];

        return view('candidate.result', compact('session', 'detail', 'config'));
    }
}
