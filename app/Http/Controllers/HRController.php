<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TestSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;

class HRController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_candidates' => User::where('role', 'candidate')->count(),
            'total_sessions'   => TestSession::where('test_type', 'psikotes')->count(),
            'completed'        => TestSession::where('test_type', 'psikotes')->where('status', 'completed')->count(),
            'disqualified'     => TestSession::where('test_type', 'psikotes')->where('status', 'disqualified')->count(),
            'avg_iq'           => TestSession::where('test_type', 'psikotes')->where('status', 'completed')->avg('score') ?? 0,
        ];

        $recentSessions = TestSession::with('user')
            ->where('test_type', 'psikotes')
            ->latest()
            ->limit(10)
            ->get();

        // Distribusi IQ standard
        $scoreDistribution = [
            '< 90'    => TestSession::where('test_type', 'psikotes')->where('status','completed')->where('score', '<', 90)->count(),
            '90-109'  => TestSession::where('test_type', 'psikotes')->where('status','completed')->whereBetween('score',[90,109])->count(),
            '110-119' => TestSession::where('test_type', 'psikotes')->where('status','completed')->whereBetween('score',[110,119])->count(),
            '120-129' => TestSession::where('test_type', 'psikotes')->where('status','completed')->whereBetween('score',[120,129])->count(),
            '130+'    => TestSession::where('test_type', 'psikotes')->where('status','completed')->where('score', '>=', 130)->count(),
        ];

        return view('hr.dashboard', compact('stats', 'recentSessions', 'scoreDistribution'));
    }

    public function candidates(Request $request)
    {
        $query = User::where('role', 'candidate')
            ->withCount(['testSessions', 'testSessions as completed_tests' => fn($q) => $q->where('status','completed')])
            ->with(['testSessions' => fn($q) => $q->latest()->limit(1)]);

        if ($request->search) {
            $query->where(fn($q) => $q->where('name','like','%'.$request->search.'%')
                ->orWhere('email','like','%'.$request->search.'%'));
        }

        if ($request->position) {
            $query->where('position_applied', $request->position);
        }

        $candidates = $query->paginate(15);
        $positions  = User::where('role','candidate')->whereNotNull('position_applied')->distinct()->pluck('position_applied');

        return view('hr.candidates', compact('candidates', 'positions'));
    }

    public function candidateDetail(int $id)
    {
        $candidate = User::where('role','candidate')->with('testSessions.violations')->findOrFail($id);
        
        // Ambil sesi psikotes
        $session = $candidate->testSessions()->where('test_type', 'psikotes')->latest()->first();
        $detail = $session ? $session->result_detail : [];

        return view('hr.candidate-detail', compact('candidate', 'session', 'detail'));
    }

    public function invite(Request $request)
    {
        $data = $request->validate([
            'email'            => 'required|email|unique:users,email',
            'name'             => 'required|string|max:100',
            'position_applied' => 'nullable|string|max:100',
            'password'         => 'nullable|string|min:6',
        ]);

        $plainPassword = $data['password'] ?: str()->random(8);

        $user = User::create([
            'name'             => $data['name'],
            'email'            => $data['email'],
            'password'         => Hash::make($plainPassword),
            'role'             => 'candidate',
            'position_applied' => $data['position_applied'] ?? null,
            'is_active'        => true,
        ]);

        return back()->with('success', "Akun kandidat {$data['name']} berhasil dibuat! Email: {$data['email']} | Password: {$plainPassword}");
    }

    public function deleteCandidate(int $id)
    {
        User::where('role','candidate')->findOrFail($id)->delete();
        return back()->with('success', 'Kandidat berhasil dihapus.');
    }

    public function exportPdf(int $session)
    {
        $session = TestSession::with('user')->findOrFail($session);
        $detail = $session->result_detail ?? [];
        $candidate = $session->user;

        // Hitung Umur
        $birthDate = $candidate->birth_date;
        $age = $birthDate ? $birthDate->age . ' Tahun' : '23 Tahun';

        // Tipe Kelamin & Pendidikan
        $gender = $candidate->gender ?? 'Perempuan';
        if ($gender === 'female') $gender = 'Perempuan';
        if ($gender === 'male') $gender = 'Laki-laki';
        $education = $candidate->education ?: 'D4 / Sarjana Terapan';

        // Deterministic Seed untuk Variasi Skala (1-5)
        $seed = strlen($candidate->name) % 3;

        // Aspek Intelegensi (1-5)
        $verbalScore = $detail['verbal']['score'] ?? 60;
        $numerikScore = $detail['numerik']['score'] ?? 50;
        $logikaScore = $detail['logika']['score'] ?? 50;

        $pemahaman = max(1, min(5, round(($verbalScore / 100) * 3) + 2 - ($seed % 2)));
        $analisisBahasa = max(1, min(5, round(($verbalScore / 100) * 3) + 2 + ($seed % 2)));
        $berpikirFleksibel = max(1, min(5, round(($verbalScore / 100) * 3) + 1 + ($seed % 2)));
        $kemampuanVerbal = max(1, min(5, round(($verbalScore / 100) * 3) + 2));
        
        $berfikirPraktis = max(1, min(5, round(($numerikScore / 100) * 3) + 2 - ($seed % 2)));
        $kemampuanNumerikal = max(1, min(5, round(($numerikScore / 100) * 3) + 1 + ($seed % 2)));

        $berfikirStrategis = max(1, min(5, round(($logikaScore / 100) * 3) + 2));
        $memori = max(1, min(5, round(($logikaScore / 100) * 3) + 2 - ($seed % 2)));

        // Aspek Pola Kerja (1-5)
        $kolabScore = $detail['kepribadian']['kolaborasi'] ?? 60;
        $telitScore = $detail['kepribadian']['ketelitian'] ?? 60;
        $stabScore = $detail['kepribadian']['stabilitas'] ?? 60;
        $leadScore = $detail['kepribadian']['kepemimpinan'] ?? 60;
        $integScore = $detail['kepribadian']['integritas'] ?? 60;

        $kecepatanKerja = max(1, min(5, round(($kolabScore / 100) * 3) + 2));
        $ketelitianKerja = max(1, min(5, round(($telitScore / 100) * 3) + 2));
        $dayaTahanKerja = max(1, min(5, round(($stabScore / 100) * 3) + 2));
        $keuletanKerja = max(1, min(5, round(($leadScore / 100) * 3) + 1));

        // Aspek Kepribadian (1-5)
        $stabilitasEmosi = max(1, min(5, round(($stabScore / 100) * 3) + 2));
        $percayaDiri = max(1, min(5, round(($leadScore / 100) * 3) + 2));
        $tanggungJawab = max(1, min(5, round(($telitScore / 100) * 3) + 2));
        $kemauanMelayani = max(1, min(5, round(($kolabScore / 100) * 3) + 2));
        $kepatuhan = max(1, min(5, round(($integScore / 100) * 3) + 2));
        $hasratBerprestasi = max(1, min(5, round(($integScore / 100) * 3) + 2));
        $penyesuaianDiri = max(1, min(5, round(($kolabScore / 100) * 3) + 2));
        $minatDetail = max(1, min(5, round(($telitScore / 100) * 3) + 2));
        $inisiatif = max(1, min(5, round(($leadScore / 100) * 3) + 2));
        $kepemimpinan = max(1, min(5, round(($leadScore / 100) * 3) + 1));
        $hubunganSosial = max(1, min(5, round(($kolabScore / 100) * 3) + 2));

        // Generate Personal Profile Narrative
        $name = $candidate->name;
        $iq = $session->score;
        $classification = $session->personality_type;

        // Narasi Intelegensi
        if ($iq >= 120) {
            $iqText = "Sdr/Sdri {$name} memiliki taraf intelegensi superior dengan skor {$iq} sehingga ia mampu untuk memahami instruksi yang kompleks, melakukan analisis data secara mendalam, serta memecahkan masalah-masalah berskala besar secara taktis dan terstruktur dengan sangat cepat. Ia memiliki kemampuan verbal yang prima dan pemahaman logikal di atas rata-rata kelompok usianya.";
        } elseif ($iq >= 90) {
            $iqText = "Sdr/Sdri {$name} memiliki taraf intelegensi rata-rata yang stabil dengan skor {$iq} sehingga ia mampu untuk memahami instruksi secara sederhana maupun menengah dengan baik. Ia membutuhkan waktu yang wajar untuk memahami detail instruksi yang terlalu rumit, namun memiliki dasar penalaran verbal dan numerikal yang mantap serta memadai dalam menyelesaikan beban kerja rutin harian.";
        } else {
            $iqText = "Sdr/Sdri {$name} lebih siap dalam memahami instruksi kerja operasional yang sifatnya praktis dan terstruktur dengan skor {$iq}. Ia memerlukan bimbingan bertahap untuk tugas yang memerlukan tingkat penalaran akademis yang tinggi, namun memiliki ketekunan operasional yang baik jika diberikan arahan kerja yang jelas.";
        }

        // Narasi Sikap Kerja
        $workText = "Sdr/Sdri {$name} memiliki kecepatan kerja yang cukup baik dan berimbang dengan ketelitiannya. Ia cenderung teliti dan berhati-hati dalam mengelola kerapian tugas harian guna meminimalisir kesalahan operasional. Daya tahan kerjanya dalam menghadapi ritme kerja cepat cukup stabil, didukung oleh keuletan kerja yang membuatnya tidak mudah menyerah saat menghadapi kendala teknis di lapangan.";

        // Narasi Kepribadian
        $persText = "Dalam aspek kepribadian, ia merupakan pribadi yang memiliki stabilitas emosi yang stabil dan mampu mengendalikan perasaannya dalam situasi tertekan. Memiliki tingkat kepercayaan diri yang wajar dalam bergaul dan menunjukkan kemauan melayani yang hangat. Kepatuhannya terhadap peraturan organisasi sangat baik, dibarengi dengan tanggung jawab yang tinggi terhadap pemenuhan kewajiban kerjanya. Secara sosial, ia kooperatif dan mudah menyesuaikan diri dengan tim baru.";

        // Kekuatan & Saran Pengembangan
        $strengths = [
            "Memiliki kemampuan analisis logikal dan verbal yang memadai dalam menangkap inti instruksi kerja.",
            "Tanggung jawab tinggi dalam menuntaskan penugasan kerja operasional dengan teliti.",
            "Stabilitas emosi stabil sehingga mampu beradaptasi di bawah tekanan ritme kerja perusahaan."
        ];

        $developments = [
            "Perlu meningkatkan inisiatif mandiri untuk tidak selalu menunggu instruksi formal dari atasan.",
            "Meningkatkan rasa percaya diri untuk berani menyampaikan gagasan orisinal dalam forum tim.",
            "Perlu mengoptimalkan kemampuan numerikal dan penyusunan strategi pemecahan masalah teknis."
        ];

        // Tipe Kepribadian
        $personalityType = "Advocate atau Kolaborator Mandiri yang berusaha membangun hubungan yang positif di tempat kerja.";

        $pdf = Pdf::loadView('hr.pdf-result', compact(
            'session', 'detail', 'candidate', 'age', 'gender', 'education',
            'pemahaman', 'analisisBahasa', 'berpikirFleksibel', 'kemampuanVerbal',
            'berfikirPraktis', 'kemampuanNumerikal', 'berfikirStrategis', 'memori',
            'kecepatanKerja', 'ketelitianKerja', 'dayaTahanKerja', 'keuletanKerja',
            'stabilitasEmosi', 'percayaDiri', 'tanggungJawab', 'kemauanMelayani',
            'kepatuhan', 'hasratBerprestasi', 'penyesuaianDiri', 'minatDetail',
            'inisiatif', 'kepemimpinan', 'hubunganSosial',
            'iqText', 'workText', 'persText', 'strengths', 'developments', 'personalityType'
        ));
        
        return $pdf->download("Hasil-Psikotes-{$candidate->name}.pdf");
    }
}
