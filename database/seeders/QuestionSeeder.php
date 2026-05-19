<?php
// database/seeders/QuestionSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // TPA - Tes Potensi Akademik (Numerik)
        $tpa_numerik = [
            ['q'=>'2, 4, 8, 16, ?', 'opts'=>['24','32','30','20'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Jika 3x + 6 = 21, maka x = ?', 'opts'=>['3','4','5','6'], 'ans'=>2, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'1, 1, 2, 3, 5, 8, ?', 'opts'=>['10','11','12','13'], 'ans'=>3, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Berapakah 15% dari 200?', 'opts'=>['25','30','35','40'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapa kelilingnya?', 'opts'=>['36','40','44','48'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'3, 6, 12, 24, 48, ?', 'opts'=>['72','84','96','108'], 'ans'=>2, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Rata-rata dari 10, 20, 30, 40, 50 adalah?', 'opts'=>['25','30','35','40'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Jika tabungan Rp 500.000 berbunga 10% per tahun, setelah 2 tahun menjadi?', 'opts'=>['Rp 550.000','Rp 600.000','Rp 605.000','Rp 610.000'], 'ans'=>2, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'Berapa 45 x 45?', 'opts'=>['1.925','2.025','2.125','2.225'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
            ['q'=>'7, 14, 28, ?, 112', 'opts'=>['42','56','70','84'], 'ans'=>1, 'type'=>'tpa', 'category'=>'numerik'],
        ];

        // TPA - Verbal
        $tpa_verbal = [
            ['q'=>'DOKTER : PASIEN = GURU : ?', 'opts'=>['Sekolah','Murid','Buku','Kelas'], 'ans'=>1, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'Manakah kata yang TIDAK sejenis? Apel, Mangga, Wortel, Jeruk', 'opts'=>['Apel','Mangga','Wortel','Jeruk'], 'ans'=>2, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'Antonim dari kata GIGIH adalah?', 'opts'=>['Rajin','Malas','Tekun','Semangat'], 'ans'=>1, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'Sinonim dari kata ANDAL adalah?', 'opts'=>['Lemah','Terpercaya','Baru','Asing'], 'ans'=>1, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'TANGAN : SARUNG TANGAN = KAKI : ?', 'opts'=>['Sepatu','Jari','Lutut','Betis'], 'ans'=>0, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'Manakah ejaan yang benar?', 'opts'=>['Praktek','Praktik','Praktic','Practik'], 'ans'=>1, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'SIANG : MALAM = PANAS : ?', 'opts'=>['Api','Dingin','Hangat','Terik'], 'ans'=>1, 'type'=>'tpa', 'category'=>'verbal'],
            ['q'=>'Lawan kata dari INTROVERT adalah?', 'opts'=>['Pemalu','Pendiam','Ekstrovert','Tertutup'], 'ans'=>2, 'type'=>'tpa', 'category'=>'verbal'],
        ];

        // Big Five Personality
        $bigfive = [
            // Openness
            ['q'=>'Saya senang mencoba pengalaman baru dan berbeda.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'openness'],
            ['q'=>'Saya memiliki imajinasi yang aktif.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'openness'],
            ['q'=>'Saya menikmati diskusi tentang ide-ide abstrak.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'openness'],
            // Conscientiousness
            ['q'=>'Saya selalu mempersiapkan diri dengan baik sebelum melakukan sesuatu.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'conscientiousness'],
            ['q'=>'Saya memperhatikan detail-detail kecil.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'conscientiousness'],
            ['q'=>'Saya menyelesaikan tugas tepat waktu.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'conscientiousness'],
            // Extraversion
            ['q'=>'Saya merasa nyaman di sekitar banyak orang.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'extraversion'],
            ['q'=>'Saya memulai percakapan dengan mudah.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'extraversion'],
            ['q'=>'Saya senang menjadi pusat perhatian.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'extraversion'],
            // Agreeableness
            ['q'=>'Saya peduli dengan perasaan orang lain.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'agreeableness'],
            ['q'=>'Saya menghormati pendapat orang lain meski berbeda dengan saya.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'agreeableness'],
            ['q'=>'Saya senang membantu orang lain.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'agreeableness'],
            // Neuroticism
            ['q'=>'Saya sering merasa cemas tanpa alasan yang jelas.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'neuroticism'],
            ['q'=>'Saya mudah merasa tertekan ketika menghadapi masalah.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'neuroticism'],
            ['q'=>'Saya sering khawatir tentang hal-hal kecil.', 'opts'=>['Sangat Tidak Setuju','Tidak Setuju','Netral','Setuju','Sangat Setuju'], 'ans'=>-1, 'type'=>'bigfive', 'category'=>'neuroticism'],
        ];

        // DISC Assessment
        $disc = [
            ['q'=>'Ketika menghadapi tantangan, saya cenderung...', 'opts'=>['Langsung mengambil tindakan','Mempengaruhi orang lain','Mencari stabilitas','Menganalisis situasi'], 'ans'=>-1, 'type'=>'disc', 'category'=>'dominance'],
            ['q'=>'Dalam tim, saya biasanya berperan sebagai...', 'opts'=>['Pemimpin yang tegas','Motivator tim','Penopang tim','Analis masalah'], 'ans'=>-1, 'type'=>'disc', 'category'=>'influence'],
            ['q'=>'Saya merasa paling produktif ketika...', 'opts'=>['Memiliki kontrol penuh','Bekerja sama dengan orang lain','Memiliki rutinitas yang stabil','Memahami semua detail'], 'ans'=>-1, 'type'=>'disc', 'category'=>'steadiness'],
            ['q'=>'Ketika membuat keputusan penting, saya...', 'opts'=>['Bertindak cepat dan tegas','Mempertimbangkan dampak ke orang lain','Memastikan semua setuju','Mengumpulkan data terlebih dahulu'], 'ans'=>-1, 'type'=>'disc', 'category'=>'conscientiousness'],
            ['q'=>'Orang lain menggambarkan saya sebagai seseorang yang...', 'opts'=>['Berani dan langsung','Antusias dan persuasif','Sabar dan dapat diandalkan','Teliti dan sistematis'], 'ans'=>-1, 'type'=>'disc', 'category'=>'dominance'],
            ['q'=>'Dalam situasi konflik, saya biasanya...', 'opts'=>['Mengkonfrontasi masalah langsung','Mencoba meredakan ketegangan','Mencari jalan tengah','Menganalisis akar masalah'], 'ans'=>-1, 'type'=>'disc', 'category'=>'influence'],
            ['q'=>'Motivasi terbesar saya dalam bekerja adalah...', 'opts'=>['Mencapai hasil yang nyata','Membangun hubungan positif','Menjaga keharmonisan tim','Memastikan kualitas pekerjaan'], 'ans'=>-1, 'type'=>'disc', 'category'=>'steadiness'],
            ['q'=>'Saya cenderung...', 'opts'=>['Mengambil risiko yang diperhitungkan','Optimis tentang masa depan','Menghindari perubahan mendadak','Berhati-hati sebelum bertindak'], 'ans'=>-1, 'type'=>'disc', 'category'=>'conscientiousness'],
        ];

        $all_questions = array_merge($tpa_numerik, $tpa_verbal, $bigfive, $disc);

        foreach ($all_questions as $i => $q) {
            DB::table('test_questions')->insert([
                'test_type'    => $q['type'],
                'category'     => $q['category'],
                'question'     => $q['q'],
                'options'      => json_encode($q['opts']),
                'correct_answer'=> $q['ans'],
                'order'        => $i + 1,
                'time_limit'   => in_array($q['type'], ['tpa']) ? 45 : 0,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }
}
