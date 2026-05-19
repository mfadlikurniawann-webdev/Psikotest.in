<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PsikotesSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama
        DB::table('test_questions')->truncate();

        $questions = [];

        // ==========================================
        // TAHAP 1: KEMAMPUAN VERBAL (Soal 1 - 25)
        // ==========================================
        $verbal = [
            // Sinonim (1 - 7)
            ['q' => 'Sinonim dari kata AKURAT adalah...', 'opts' => ['Tepat', 'Cepat', 'Lambat', 'Meragukan'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata KHAS adalah...', 'opts' => ['Umum', 'Spesifik', 'Sama', 'Biasa'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata EVAKUASI adalah...', 'opts' => ['Penyelamatan', 'Pengurungan', 'Pemindahan', 'Penahanan'], 'ans' => 2, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata INSINUASI adalah...', 'opts' => ['Sindiran', 'Pujian', 'Tuduhan', 'Pernyataan'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata ITERASI adalah...', 'opts' => ['Pengurangan', 'Pembagian', 'Perulangan', 'Penjumlahan'], 'ans' => 2, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata NOMADEN adalah...', 'opts' => ['Menetap', 'Pindah-pindah', 'Teratur', 'Liar'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Sinonim dari kata PROGRESIF adalah...', 'opts' => ['Mundur', 'Statis', 'Maju', 'Lambat'], 'ans' => 2, 'cat' => 'verbal'],

            // Antonim (8 - 14)
            ['q' => 'Antonim dari kata SKEPTIS adalah...', 'opts' => ['Ragu-ragu', 'Yakin', 'Pasrah', 'Takut'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata APATIS adalah...', 'opts' => ['Peduli', 'Dingin', 'Cuek', 'Benci'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata EFISIEN adalah...', 'opts' => ['Boros', 'Hemat', 'Tepat', 'Cepat'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata PROLOG adalah...', 'opts' => ['Monolog', 'Epilog', 'Dialog', 'Katalog'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata SEKULER adalah...', 'opts' => ['Duniawi', 'Keagamaan', 'Tradisional', 'Modern'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata FIKTIF adalah...', 'opts' => ['Nyata', 'Khayalan', 'Bohong', 'Palsu'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'Antonim dari kata OPOSISI adalah...', 'opts' => ['Koalisi', 'Lawan', 'Persaingan', 'Pemberontak'], 'ans' => 0, 'cat' => 'verbal'],

            // Analogi (15 - 21)
            ['q' => 'MOBIL : BENSIN = MANUSIA : ...', 'opts' => ['Udara', 'Makanan', 'Rumah', 'Air'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'GURU : SEKOLAH = DOKTER : ...', 'opts' => ['Apotek', 'Pasien', 'Rumah Sakit', 'Klinik'], 'ans' => 2, 'cat' => 'verbal'],
            ['q' => 'MATA : MELIHAT = TELINGA : ...', 'opts' => ['Mendengar', 'Mencium', 'Berbicara', 'Meraba'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'ES : DINGIN = API : ...', 'opts' => ['Merah', 'Panas', 'Asap', 'Abu'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'SIANG : MATAHARI = MALAM : ...', 'opts' => ['Bintang', 'Gelap', 'Bulan', 'Tidur'], 'ans' => 2, 'cat' => 'verbal'],
            ['q' => 'KAYU : POHON = EMAS : ...', 'opts' => ['Tambang', 'Perhiasan', 'Logam', 'Tanah'], 'ans' => 0, 'cat' => 'verbal'],
            ['q' => 'HAUS : MINUM = LAPAR : ...', 'opts' => ['Kenyang', 'Makan', 'Tidur', 'Istirahat'], 'ans' => 1, 'cat' => 'verbal'],

            // Pengelompokan Kata & Wacana (22 - 25)
            ['q' => 'Manakah kata yang TIDAK termasuk kelompoknya?', 'opts' => ['Apel', 'Bayam', 'Jeruk', 'Mangga'], 'ans' => 1, 'cat' => 'verbal'],
            ['q' => 'Manakah kata yang TIDAK termasuk kelompoknya?', 'opts' => ['Pesawat', 'Kapal Terbang', 'Helikopter', 'Kapal Selam'], 'ans' => 3, 'cat' => 'verbal'],
            ['q' => 'Manakah kata yang TIDAK termasuk kelompoknya?', 'opts' => ['Meja', 'Kursi', 'Lemari', 'Laptop'], 'ans' => 3, 'cat' => 'verbal'],
            ['q' => 'Pilihlah kesimpulan yang paling tepat: "Semua mahasiswa memiliki buku catatan. Sebagian mahasiswa memiliki laptop."', 'opts' => ['Semua mahasiswa memiliki laptop', 'Sebagian mahasiswa memiliki laptop dan buku catatan', 'Sebagian mahasiswa tidak memiliki buku catatan', 'Semua mahasiswa tidak memiliki laptop'], 'ans' => 1, 'cat' => 'verbal'],
        ];

        foreach ($verbal as $i => $item) {
            $questions[] = [
                'test_type' => 'psikotes',
                'category' => $item['cat'],
                'question' => $item['q'],
                'options' => json_encode($item['opts']),
                'correct_answer' => $item['ans'],
                'order' => $i + 1,
                'time_limit' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // ==========================================
        // TAHAP 2: KEMAMPUAN NUMERIK (Soal 26 - 50)
        // ==========================================
        $numerik = [
            // Deret Angka (26 - 35)
            ['q' => 'Tentukan angka berikutnya dari deret: 2, 4, 8, 16, 32, ...', 'opts' => ['48', '64', '56', '72'], 'ans' => 1],
            ['q' => 'Tentukan angka berikutnya dari deret: 3, 6, 9, 12, 15, ...', 'opts' => ['18', '21', '16', '20'], 'ans' => 0],
            ['q' => 'Tentukan angka berikutnya dari deret: 1, 3, 6, 10, 15, ...', 'opts' => ['18', '20', '21', '25'], 'ans' => 2],
            ['q' => 'Tentukan angka berikutnya dari deret: 100, 90, 81, 73, ...', 'opts' => ['66', '65', '67', '68'], 'ans' => 0],
            ['q' => 'Tentukan angka berikutnya dari deret: 1, 2, 4, 7, 11, ...', 'opts' => ['15', '16', '17', '18'], 'ans' => 1],
            ['q' => 'Tentukan angka berikutnya dari deret: 2, 3, 5, 8, 12, 17, ...', 'opts' => ['21', '22', '23', '24'], 'ans' => 2],
            ['q' => 'Tentukan angka berikutnya dari deret: 5, 10, 8, 16, 14, 28, ...', 'opts' => ['26', '24', '30', '32'], 'ans' => 0],
            ['q' => 'Tentukan angka berikutnya dari deret: 1, 4, 9, 16, 25, ...', 'opts' => ['30', '35', '36', '40'], 'ans' => 2],
            ['q' => 'Tentukan angka berikutnya dari deret: 80, 40, 20, 10, ...', 'opts' => ['8', '6', '5', '4'], 'ans' => 2],
            ['q' => 'Tentukan angka berikutnya dari deret: 1, 1, 2, 3, 5, 8, ...', 'opts' => ['11', '12', '13', '14'], 'ans' => 2],

            // Aritmatika & Matematika Praktis (36 - 45)
            ['q' => 'Jika 3x + 5 = 20, berapakah nilai x?', 'opts' => ['3', '4', '5', '6'], 'ans' => 2],
            ['q' => 'Berapakah hasil dari 25 x 4 + 50?', 'opts' => ['100', '150', '200', '250'], 'ans' => 1],
            ['q' => 'Berapakah 15% dari 200?', 'opts' => ['25', '30', '35', '40'], 'ans' => 1],
            ['q' => 'Sebuah baju seharga Rp 100.000 diskon 20%. Berapakah harga akhirnya?', 'opts' => ['Rp 80.000', 'Rp 75.000', 'Rp 85.000', 'Rp 90.000'], 'ans' => 0],
            ['q' => 'Jika sebuah proyek selesai dalam 12 hari oleh 5 pekerja, berapa hari proyek tersebut selesai jika dikerjakan oleh 6 pekerja?', 'opts' => ['8 hari', '9 hari', '10 hari', '11 hari'], 'ans' => 2],
            ['q' => 'Rata-rata tinggi badan 5 orang adalah 160 cm. Jika ditambah 1 orang lagi dengan tinggi 172 cm, berapakah rata-rata tinggi badan sekarang?', 'opts' => ['161 cm', '162 cm', '163 cm', '164 cm'], 'ans' => 1],
            ['q' => 'Budi menabung uang sebesar Rp 1.000.000 dengan bunga tunggal 10% per tahun. Berapakah jumlah tabungan Budi setelah 2 tahun?', 'opts' => ['Rp 1.100.000', 'Rp 1.200.000', 'Rp 1.250.000', 'Rp 1.300.000'], 'ans' => 1],
            ['q' => 'Berapakah luas persegi panjang dengan panjang 12 cm dan lebar 5 cm?', 'opts' => ['50 cm²', '55 cm²', '60 cm²', '65 cm²'], 'ans' => 2],
            ['q' => 'Sebuah kendaraan melaju dengan kecepatan 60 km/jam selama 2,5 jam. Berapa jarak total yang ditempuh?', 'opts' => ['120 km', '135 km', '150 km', '165 km'], 'ans' => 2],
            ['q' => 'Berapakah hasil dari akar kuadrat 144 dikali 3?', 'opts' => ['30', '33', '36', '40'], 'ans' => 2],

            // Pecahan, Perbandingan, Persentase (46 - 50)
            ['q' => 'Sederhanakan pecahan 18/24.', 'opts' => ['2/3', '3/4', '4/5', '5/6'], 'ans' => 1],
            ['q' => 'Berapakah hasil dari 1/2 + 1/4?', 'opts' => ['2/3', '3/4', '3/5', '5/6'], 'ans' => 1],
            ['q' => 'Perbandingan uang Andi dan Budi adalah 3 : 5. Jika total uang mereka Rp 80.000, berapa uang Andi?', 'opts' => ['Rp 30.000', 'Rp 40.000', 'Rp 50.000', 'Rp 60.000'], 'ans' => 0],
            ['q' => 'Ubah 0,35 menjadi bentuk persentase.', 'opts' => ['3.5%', '35%', '350%', '0.35%'], 'ans' => 1],
            ['q' => 'Jika harga awal barang adalah Rp 50.000 dan naik menjadi Rp 60.000, berapa persen kenaikannya?', 'opts' => ['10%', '15%', '20%', '25%'], 'ans' => 2],
        ];

        foreach ($numerik as $i => $item) {
            $questions[] = [
                'test_type' => 'psikotes',
                'category' => 'numerik',
                'question' => $item['q'],
                'options' => json_encode($item['opts']),
                'correct_answer' => $item['ans'],
                'order' => $i + 26,
                'time_limit' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // ==========================================
        // TAHAP 3: PENALARAN LOGIKA & SPASIAL (Soal 51 - 75)
        // ==========================================
        $logika = [
            // Penalaran Logis (51 - 60)
            ['q' => 'Semua mamalia menyusui anaknya. Paus adalah mamalia. Maka...', 'opts' => ['Paus bertelur', 'Paus menyusui anaknya', 'Paus tidak menyusui anaknya', 'Paus adalah ikan'], 'ans' => 1],
            ['q' => 'Jika hari hujan, maka jalanan basah. Hari ini jalanan tidak basah. Maka...', 'opts' => ['Hari ini hujan', 'Hari ini tidak hujan', 'Jalanan baru disapu', 'Hari ini mendung'], 'ans' => 1],
            ['q' => 'Semua karyawan harus memakai ID card. Budi memakai ID card. Maka...', 'opts' => ['Budi belum tentu karyawan', 'Budi adalah karyawan', 'Budi bukan karyawan', 'ID card Budi palsu'], 'ans' => 0],
            ['q' => 'Tidak ada kucing yang bertelur. Platypus bertelur. Maka...', 'opts' => ['Platypus adalah kucing', 'Platypus bukan kucing', 'Kucing bertelur', 'Platypus tidak bertelur'], 'ans' => 1],
            ['q' => 'Semua burung memiliki sayap. Beberapa hewan yang memiliki sayap tidak bisa terbang. Maka...', 'opts' => ['Semua burung bisa terbang', 'Beberapa burung mungkin tidak bisa terbang', 'Hewan tidak bersayap bisa terbang', 'Burung tidak bersayap'], 'ans' => 1],
            ['q' => 'Jika toko buka, maka lampu menyala. Lampu toko mati. Maka...', 'opts' => ['Toko buka', 'Toko tutup', 'Toko ramai', 'Toko sepi'], 'ans' => 1],
            ['q' => 'Semua buah yang matang rasanya manis. Buah ini rasanya asam. Maka...', 'opts' => ['Buah ini belum matang', 'Buah ini bukan buah manis', 'Buah ini rasanya manis', 'Buah ini matang'], 'ans' => 0],
            ['q' => 'Beberapa musisi adalah komposer. Semua komposer adalah seniman. Maka...', 'opts' => ['Semua musisi adalah seniman', 'Beberapa musisi adalah seniman', 'Semua seniman adalah musisi', 'Tidak ada musisi yang seniman'], 'ans' => 1],
            ['q' => 'Semua kendaraan listrik hemat energi. Motor X adalah motor listrik. Maka...', 'opts' => ['Motor X boros energi', 'Motor X hemat energi', 'Motor X menggunakan bensin', 'Motor X sangat mahal'], 'ans' => 1],
            ['q' => 'Jika rajin belajar, maka nilai bagus. Anton memiliki nilai bagus. Maka...', 'opts' => ['Anton rajin belajar', 'Anton malas belajar', 'Anton mungkin rajin belajar', 'Anton tidak pernah belajar'], 'ans' => 2],

            // Penalaran Analitis (61 - 70)
            ['q' => 'Andi lebih tinggi daripada Budi. Budi lebih tinggi daripada Cici. Siapakah yang paling tinggi?', 'opts' => ['Andi', 'Budi', 'Cici', 'Sama tinggi'], 'ans' => 0],
            ['q' => 'Rumah A terletak di sebelah barat rumah B. Rumah B di sebelah barat rumah C. Rumah C di sebelah barat rumah D. Rumah mana yang paling timur?', 'opts' => ['Rumah A', 'Rumah B', 'Rumah C', 'Rumah D'], 'ans' => 3],
            ['q' => 'Dalam antrean, Rudi berada di belakang Susi. Susi di belakang Tina. Didi di depan Tina. Siapa yang berada di urutan paling depan?', 'opts' => ['Rudi', 'Susi', 'Tina', 'Didi'], 'ans' => 3],
            ['q' => 'Buku Matematika lebih tebal daripada Fisika. Buku Fisika lebih tebal daripada Kimia. Buku Kimia lebih tipis daripada Biologi, namun Biologi lebih tipis daripada Fisika. Buku mana yang paling tipis?', 'opts' => ['Matematika', 'Fisika', 'Kimia', 'Biologi'], 'ans' => 2],
            ['q' => 'A lebih pintar dari B. C tidak lebih pintar dari B. D lebih pintar dari A. Siapa yang paling kurang pintar?', 'opts' => ['A', 'B', 'C', 'D'], 'ans' => 2],
            ['q' => 'Lari Andi lebih cepat dari Budi, namun lebih lambat dari Caca. Dedi berlari lebih cepat dari Budi, namun lebih lambat dari Andi. Siapakah pelari paling cepat kedua?', 'opts' => ['Andi', 'Budi', 'Caca', 'Dedi'], 'ans' => 0],
            ['q' => 'Dalam perlombaan catur, A menang atas B. C kalah dari B. D menang atas A. Siapakah juara pertamanya?', 'opts' => ['A', 'B', 'C', 'D'], 'ans' => 3],
            ['q' => 'Di sebuah meja melingkar, Budi duduk di antara Andi dan Cici. Didi duduk berhadapan dengan Budi. Siapa yang duduk di sebelah kiri Budi?', 'opts' => ['Andi atau Cici', 'Hanya Andi', 'Hanya Cici', 'Didi'], 'ans' => 0],
            ['q' => 'Jika X lebih besar dari Y, dan Y sama dengan Z, manakah pernyataan yang benar?', 'opts' => ['X < Z', 'X > Z', 'X = Z', 'Y > X'], 'ans' => 1],
            ['q' => 'Nilai IPA Roni lebih tinggi dari IPS. Nilai Matematika lebih tinggi dari IPA. Nilai IPS lebih rendah dari Bahasa Inggris, tapi Bahasa Inggris lebih rendah dari IPA. Nilai mana yang paling tinggi?', 'opts' => ['IPA', 'IPS', 'Matematika', 'Bahasa Inggris'], 'ans' => 2],

            // Spasial / Gambar Deskriptif (71 - 75)
            ['q' => 'Jika sebuah kubus transparan memiliki garis diagonal di sisi depan, dan diputar 90 derajat ke kanan, posisi garis diagonal tersebut sekarang berada di...', 'opts' => ['Sisi atas', 'Sisi kanan', 'Sisi belakang', 'Sisi kiri'], 'ans' => 1],
            ['q' => 'Sebuah jarum jam menunjuk pukul 03.00. Jika jam diputar 90 derajat berlawanan arah jarum jam, jarum panjang sekarang menunjuk ke arah...', 'opts' => ['Pukul 12.00', 'Pukul 09.00', 'Pukul 06.00', 'Pukul 03.00'], 'ans' => 1],
            ['q' => 'Bayangkan huruf "F" kapital tercermin di cermin datar di sebelah kanannya. Garis horizontal atas huruf "F" cermin tersebut akan menghadap ke...', 'opts' => ['Kanan', 'Kiri', 'Atas', 'Bawah'], 'ans' => 1],
            ['q' => 'Jika sebuah lingkaran dipotong menjadi 4 bagian sama besar, lalu 2 bagian yang berseberangan diarsir. Berapakah persentase area yang diarsir?', 'opts' => ['25%', '50%', '75%', '100%'], 'ans' => 1],
            ['q' => 'Bayangkan jaring-jaring kubus. Jika dirakit menjadi kubus, sisi yang berlawanan dengan sisi bawah (alas) adalah sisi...', 'opts' => ['Depan', 'Belakang', 'Kanan', 'Atas'], 'ans' => 3],
        ];

        foreach ($logika as $i => $item) {
            $questions[] = [
                'test_type' => 'psikotes',
                'category' => 'logika',
                'question' => $item['q'],
                'options' => json_encode($item['opts']),
                'correct_answer' => $item['ans'],
                'order' => $i + 51,
                'time_limit' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // ==========================================
        // TAHAP 4: KARAKTERISTIK PRIBADI (SIKAP KERJA) (Soal 76 - 100)
        // ==========================================
        // Opsi jawaban seragam untuk kepribadian (Likert Scale):
        $personalityOpts = ['Sangat Tidak Sesuai', 'Tidak Sesuai', 'Sesuai', 'Sangat Sesuai'];

        $kepribadian = [
            // Integritas & Etika Kerja (76 - 80)
            ['q' => 'Saya selalu jujur mengakui kesalahan kerja saya, meskipun hal itu berpotensi mengurangi penilaian kinerja saya.', 'cat' => 'integritas'],
            ['q' => 'Saya menolak untuk menggunakan fasilitas kantor untuk kepentingan pribadi saya, sekecil apa pun fasilitas tersebut.', 'cat' => 'integritas'],
            ['q' => 'Ketika melihat rekan kerja melakukan pelanggaran kode etik kantor, saya akan melaporkannya secara objektif kepada atasan.', 'cat' => 'integritas'],
            ['q' => 'Saya selalu datang ke kantor dan menyelesaikan tugas tepat waktu sesuai dengan peraturan yang disepakati.', 'cat' => 'integritas'],
            ['q' => 'Saya tetap menjaga kerahasiaan data perusahaan meskipun saya ditawarkan keuntungan finansial yang besar dari pihak luar.', 'cat' => 'integritas'],

            // Kerjasama Tim (81 - 85)
            ['q' => 'Saya lebih menyukai berdiskusi dan mendengar masukan dari rekan tim sebelum mengambil sebuah keputusan penting.', 'cat' => 'kolaborasi'],
            ['q' => 'Saya bersedia mengesampingkan kepentingan pribadi atau ego saya demi tercapainya target tim yang optimal.', 'cat' => 'kolaborasi'],
            ['q' => 'Ketika ada rekan kerja yang mengalami kesulitan, saya akan meluangkan waktu saya untuk membantunya menyelesaikan kendala.', 'cat' => 'kolaborasi'],
            ['q' => 'Saya dapat menerima kritik dan saran tentang hasil kerja saya dari anggota tim lain dengan sikap terbuka.', 'cat' => 'kolaborasi'],
            ['q' => 'Saya senang berbagi informasi dan pengetahuan baru yang relevan dengan pekerjaan kepada rekan-rekan tim saya.', 'cat' => 'kolaborasi'],

            // Kepemimpinan & Inisiatif (86 - 90)
            ['q' => 'Saya bersedia mengambil tanggung jawab memimpin sebuah proyek atau kelompok kerja saat tidak ada orang lain yang mencalonkan diri.', 'cat' => 'kepemimpinan'],
            ['q' => 'Ketika melihat ada prosedur kerja yang kurang efektif, saya akan berinisiatif mengajukan solusi perbaikan ke manajemen.', 'cat' => 'kepemimpinan'],
            ['q' => 'Saya merasa percaya diri untuk mempresentasikan ide-ide kreatif saya di hadapan forum rapat besar perusahaan.', 'cat' => 'kepemimpinan'],
            ['q' => 'Saya dapat memotivasi dan mendorong rekan kerja yang sedang patah semangat agar kembali fokus mencapai target.', 'cat' => 'kepemimpinan'],
            ['q' => 'Saya berani mengambil risiko pekerjaan yang terukur demi mewujudkan inovasi atau peningkatan kinerja tim.', 'cat' => 'kepemimpinan'],

            // Stabilitas Emosi & Manajemen Stres (91 - 95)
            ['q' => 'Saya tetap dapat berkonsentrasi penuh dan bekerja secara produktif meskipun berada di bawah tekanan tenggat waktu ketat.', 'cat' => 'stabilitas'],
            ['q' => 'Ketika rencana kerja saya gagal di tengah jalan, saya tidak mudah panik dan langsung mencari rencana cadangan.', 'cat' => 'stabilitas'],
            ['q' => 'Saya tidak mudah terpancing emosi atau tersinggung ketika menghadapi rekan kerja atau pelanggan yang bersikap kurang sopan.', 'cat' => 'stabilitas'],
            ['q' => 'Saya mampu memisahkan urusan atau masalah pribadi saya agar tidak mempengaruhi profesionalitas kerja saya di kantor.', 'cat' => 'stabilitas'],
            ['q' => 'Saya merasa tenang dan optimis saat menghadapi tantangan atau perubahan alur kerja baru di perusahaan.', 'cat' => 'stabilitas'],

            // Ketelitian & Tanggung Jawab (96 - 100)
            ['q' => 'Saya selalu meneliti secara teliti dan berulang-ulang hasil laporan kerja saya sebelum menyerahkannya ke atasan.', 'cat' => 'ketelitian'],
            ['q' => 'Bagi saya, kerapian berkas dan kesesuaian dokumen dengan prosedur operasional adalah hal mutlak yang harus dijaga.', 'cat' => 'ketelitian'],
            ['q' => 'Saya bersedia bekerja lembur secara sukarela demi memastikan pekerjaan penting saya selesai dengan sempurna.', 'cat' => 'ketelitian'],
            ['q' => 'Saya mencatat setiap tenggat waktu (deadline) dan rincian pekerjaan saya dengan sistematis di kalender kerja.', 'cat' => 'ketelitian'],
            ['q' => 'Saya merasa tidak tenang apabila meninggalkan kantor sementara pekerjaan harian saya hari itu belum tuntas dikerjakan.', 'cat' => 'ketelitian'],
        ];

        foreach ($kepribadian as $i => $item) {
            $questions[] = [
                'test_type' => 'psikotes',
                'category' => $item['cat'],
                'question' => $item['q'],
                'options' => json_encode($personalityOpts),
                'correct_answer' => -1, // -1 karena tidak ada jawaban benar/salah pada tes kepribadian
                'order' => $i + 76,
                'time_limit' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('test_questions')->insert($questions);
    }
}
