<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Psikotes - {{ $candidate->name }}</title>
    <style>
        @page {
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.4;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }
        .page {
            page-break-after: always;
            position: relative;
            height: 100%;
        }
        .page-no-break {
            position: relative;
            height: 100%;
        }
        
        /* Header Logo & Info */
        .header-logo {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
        }
        .header-logo .brand {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header-logo .sub-brand {
            font-size: 10px;
            font-weight: bold;
            color: #475569;
            margin-top: 2px;
        }
        .header-logo .contact {
            font-size: 8px;
            color: #64748b;
            margin-top: 2px;
        }

        /* Cover Page (Page 1) */
        .cover-container {
            text-align: center;
            padding-top: 3cm;
        }
        .cover-logo {
            font-size: 28px;
            font-weight: 800;
            color: #be185d;
            letter-spacing: 4px;
            margin-bottom: 2cm;
        }
        .cover-logo-desc {
            font-size: 12px;
            color: #475569;
            margin-top: -1.8cm;
            margin-bottom: 2cm;
            text-transform: uppercase;
        }
        .cover-photo-box {
            background-color: #f1f5f9;
            border: 1px dashed #94a3b8;
            height: 5cm;
            margin: 1cm auto;
            width: 80%;
            border-radius: 8px;
            display: block;
        }
        .cover-photo-box-content {
            padding-top: 2cm;
            color: #64748b;
            font-size: 12px;
            font-style: italic;
        }
        .cover-title {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 1.5cm;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cover-subtitle {
            font-size: 11px;
            color: #64748b;
            font-style: italic;
            margin-top: 5px;
            margin-bottom: 1.5cm;
        }
        .cover-bottom {
            margin-top: 3cm;
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cover-bottom-sub {
            font-size: 9px;
            color: #64748b;
            margin-top: 4px;
        }

        /* Identitas (Page 3) */
        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        .identitas-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .identitas-table td {
            border: 1px solid #94a3b8;
            padding: 6px 10px;
            vertical-align: middle;
        }
        .identitas-table td.label-num {
            width: 4%;
            text-align: center;
            font-weight: bold;
        }
        .identitas-table td.label-text {
            width: 18%;
            font-weight: bold;
        }
        .identitas-table td.val-text {
            width: 28%;
        }

        /* Hasil Psikotes Table (Page 3 & 4) */
        .hasil-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .hasil-table th {
            background-color: #fed7aa; /* Soft Orange */
            border: 1px solid #475569;
            padding: 6px;
            font-weight: bold;
            text-align: center;
            font-size: 10px;
            text-transform: uppercase;
        }
        .hasil-table td {
            border: 1px solid #475569;
            padding: 5px 8px;
            vertical-align: middle;
        }
        .hasil-table td.center {
            text-align: center;
        }
        .hasil-table td.aspect-header {
            font-weight: bold;
            background-color: #f8fafc;
            text-transform: uppercase;
            font-size: 9px;
        }
        .hasil-table td.scale-val {
            width: 4%;
            text-align: center;
            font-weight: bold;
            font-size: 12px;
        }
        .hasil-table td.scale-val.active {
            background-color: #cbd5e1;
            color: #000000;
        }
        
        /* Tipe Kepribadian Box */
        .type-box {
            border: 1px solid #475569;
            padding: 8px 12px;
            font-weight: bold;
            background-color: #f8fafc;
            margin-top: 10px;
            margin-bottom: 15px;
            font-size: 10px;
        }

        /* Intelegensi Bar (Page 4) */
        .iq-bar-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 15px;
        }
        .iq-bar-table td {
            border: 1px solid #475569;
            padding: 8px;
            text-align: center;
            font-size: 9px;
            font-weight: bold;
        }
        .iq-bar-table td.iq-label {
            background-color: #fed7aa;
            width: 25%;
            font-size: 11px;
            text-align: left;
            padding-left: 12px;
        }
        .iq-bar-table td.active {
            background-color: #94a3b8;
            color: #ffffff;
        }

        /* Personal Profile Text */
        .profile-p {
            text-align: justify;
            text-indent: 1cm;
            margin-bottom: 12px;
            line-height: 1.5;
            font-size: 10px;
        }
        
        /* List */
        .styled-list {
            margin-top: 5px;
            margin-bottom: 15px;
            padding-left: 20px;
        }
        .styled-list li {
            margin-bottom: 6px;
            line-height: 1.4;
            text-align: justify;
            font-size: 10px;
        }

        /* Signature Block (Page 5) */
        .sig-container {
            margin-top: 2cm;
            width: 100%;
        }
        .sig-table {
            width: 100%;
            border-collapse: collapse;
        }
        .sig-table td {
            vertical-align: top;
        }
        .sig-table td.left-space {
            width: 60%;
        }
        .sig-table td.sig-content {
            width: 40%;
            text-align: center;
        }
        .sig-date {
            margin-bottom: 1.5cm;
            font-size: 10px;
        }
        .sig-name {
            font-weight: bold;
            text-decoration: underline;
            font-size: 11px;
        }
        .sig-license {
            font-size: 9px;
            color: #475569;
            margin-top: 2px;
        }
        .sig-placeholder {
            height: 1.2cm;
        }
    </style>
</head>
<body>

    <!-- ================= PAGE 1 ================= -->
    <div class="page">
        <div class="cover-container">
            <div class="cover-logo">ALPHA CONSULTING</div>
            <div class="cover-logo-desc">Psychological Service & Business Consulting</div>
            
            <div class="cover-photo-box">
                <div class="cover-photo-box-content">
                    Talent Assessment & Development Program
                </div>
            </div>

            <div class="cover-title">Assessment & Management Talenta</div>
            <div class="cover-subtitle">Right Person in Right Position</div>

            <div class="cover-bottom">Outsourcing & Recruitment</div>
            <div class="cover-bottom-sub">Provide Talent by Needs</div>
        </div>
    </div>

    <!-- ================= PAGE 2 ================= -->
    <div class="page">
        <div class="header-logo">
            <div class="brand">Alpha Consulting</div>
            <div class="sub-brand">Psychological Service & Business Consulting</div>
            <div class="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div style="margin-top: 30px;">
            <p style="font-weight: bold; font-size: 13px; margin-bottom: 5px;">Potential Review :</p>
            <p style="font-weight: bold; font-size: 11px; margin-bottom: 10px;">Potential Review adalah</p>
            <p style="text-align: justify; line-height: 1.5; font-size: 10px; margin-bottom: 20px;">
                Potential review adalah Kemampuanmu dalam melakukan potential review ini sangat menunjang kariermu. Sebagian orang belum menyadari ini, terkadang mereka lebih sibuk mengembangkan diri menjadi calon pekerja yang qualified sesuai kebutuhan lapangan kerja, ketimbang menemukan passion melalui kepribadiannya sendiri.
            </p>

            <p style="font-weight: bold; font-size: 11px; margin-bottom: 10px;">Tujuan potensial review :</p>
            <ol style="padding-left: 20px; line-height: 1.6; font-size: 10px;">
                <li style="margin-bottom: 12px; text-align: justify;">
                    <strong>Mengetahui alasan dalam bertindak</strong><br>
                    Dengan menilai diri sendiri, kamu bisa mengetahui apa yang harus kamu lakukan ketika menghadapi masalah. Setelah kamu menyadari bagaimana kamu mengatasi persoalan, kamu bisa memahami apa yang membuatmu benar-benar berpikir.
                </li>
                <li style="margin-bottom: 12px; text-align: justify;">
                    <strong>Bisa Meningkatkan Kualitas kinerja</strong><br>
                    Setelah mengetahui berbagai kekuranganmu, kamu mulai terdorong untuk memperbaiki diri. Di sini kamu juga punya kesempatan untuk mencari tahu, bagaimana agar bisa bekerja dengan komitmen, jujur, dan penuh tanggung jawab.
                </li>
                <li style="margin-bottom: 12px; text-align: justify;">
                    <strong>Mengetahui progress pekerjaan</strong><br>
                    Sebelumnya kamu telah banyak belajar tentang motivasi diri dan bagaimana meningkatkan kualitas kinerja. Kini kamu bisa membandingkan kinerjamu yang sekarang dengan kinerjamu sebelumnya. Lebih baik, stabil, atau justru menurun?
                </li>
                <li style="margin-bottom: 12px; text-align: justify;">
                    <strong>Memiliki pola pikir yang strategis dan sistematis</strong><br>
                    Kamu sudah mampu melakukan penilaian terhadap cara berpikir, tindakan, dan pekerjaanmu. Dengan begitu kamu jadi punya pola pikir yang lebih strategis, artinya tepat sasaran dalam menentukan dan mencapai tujuan. Lalu berpikir sistematis, segala yang kamu pikirkan dan lakukan dapat disusun dengan baik dan terencana.
                </li>
                <li style="margin-bottom: 12px; text-align: justify;">
                    <strong>Mengevaluasi efektivitas tindakanmu</strong><br>
                    Poin yang nggak kalah penting adalah kamu bisa mengevaluasi diri dari setiap proyek yang kamu kerjakan. Kelebihan, kekurangan, motivasi diri, hingga cara berpikir. Pada tahap akhir, kamu bisa mengetahui implikasi yang ditimbulkan atas tindakanmu sebagai kesimpulan.
                </li>
            </ol>
        </div>
    </div>

    <!-- ================= PAGE 3 ================= -->
    <div class="page">
        <div class="header-logo">
            <div class="brand">Alpha Consulting</div>
            <div class="sub-brand">Psychological Service & Business Consulting</div>
            <div class="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div class="section-title">I. Identitas</div>
        <table class="identitas-table">
            <tr>
                <td class="label-num">1.</td>
                <td class="label-text">Nama</td>
                <td class="val-text">{{ $candidate->name }}</td>
                <td class="label-text">Pendidikan</td>
                <td class="val-text">{{ $education }}</td>
            </tr>
            <tr>
                <td class="label-num">2.</td>
                <td class="label-text">Jenis Kelamin</td>
                <td class="val-text">{{ $gender }}</td>
                <td class="label-text">Fakultas / Prodi</td>
                <td class="val-text">{{ $candidate->position_applied ?: '-' }}</td>
            </tr>
            <tr>
                <td class="label-num">3.</td>
                <td class="label-text">Umur</td>
                <td class="val-text">{{ $age }}</td>
                <td class="label-text">Tanggal Tes</td>
                <td class="val-text">{{ $session->completed_at?->format('d F Y') ?: now()->format('d F Y') }}</td>
            </tr>
        </table>

        <div class="section-title" style="margin-top: 10px;">II. Hasil Psikotes</div>
        <table class="hasil-table">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 25%;">Aspek Psikologi</th>
                    <th rowspan="2" style="width: 32%;">Gambaran Individu Bila Nilai Rendah</th>
                    <th colspan="5" style="width: 20%;">Skala Baku</th>
                    <th rowspan="2" style="width: 23%;">Gambaran Individu Bila Tinggi</th>
                </tr>
                <tr>
                    <th style="width: 4%;">1</th>
                    <th style="width: 4%;">2</th>
                    <th style="width: 4%;">3</th>
                    <th style="width: 4%;">4</th>
                    <th style="width: 4%;">5</th>
                </tr>
            </thead>
            <tbody>
                <!-- INTELEGENSI -->
                <tr>
                    <td class="aspect-header" colspan="8">INTELESENSI / KOGNITIF</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Pemahaman</td>
                    <td>Lambat dalam menangkap inti masalah, pemahaman lambat</td>
                    <td class="scale-val {{ $pemahaman == 1 ? 'active' : '' }}">{{ $pemahaman == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $pemahaman == 2 ? 'active' : '' }}">{{ $pemahaman == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $pemahaman == 3 ? 'active' : '' }}">{{ $pemahaman == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $pemahaman == 4 ? 'active' : '' }}">{{ $pemahaman == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $pemahaman == 5 ? 'active' : '' }}">{{ $pemahaman == 5 ? 'X' : '' }}</td>
                    <td>Cepat mengerti inti masalah, cepat tanggap.</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Analisis dan Sintesis Bahasa</td>
                    <td>Lambat dalam memahami dan memaknai bahasa dengan baik</td>
                    <td class="scale-val {{ $analisisBahasa == 1 ? 'active' : '' }}">{{ $analisisBahasa == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $analisisBahasa == 2 ? 'active' : '' }}">{{ $analisisBahasa == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $analisisBahasa == 3 ? 'active' : '' }}">{{ $analisisBahasa == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $analisisBahasa == 4 ? 'active' : '' }}">{{ $analisisBahasa == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $analisisBahasa == 5 ? 'active' : '' }}">{{ $analisisBahasa == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam memahami dan memaknai bahasa</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Berpikir Fleksibel</td>
                    <td>Lambat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya</td>
                    <td class="scale-val {{ $berpikirFleksibel == 1 ? 'active' : '' }}">{{ $berpikirFleksibel == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berpikirFleksibel == 2 ? 'active' : '' }}">{{ $berpikirFleksibel == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berpikirFleksibel == 3 ? 'active' : '' }}">{{ $berpikirFleksibel == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berpikirFleksibel == 4 ? 'active' : '' }}">{{ $berpikirFleksibel == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berpikirFleksibel == 5 ? 'active' : '' }}">{{ $berpikirFleksibel == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kemampuan Verbal</td>
                    <td>Lambat dalam mencerna konsep kata untuk mengambil kesimpulan secara umum</td>
                    <td class="scale-val {{ $kemampuanVerbal == 1 ? 'active' : '' }}">{{ $kemampuanVerbal == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanVerbal == 2 ? 'active' : '' }}">{{ $kemampuanVerbal == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanVerbal == 3 ? 'active' : '' }}">{{ $kemampuanVerbal == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanVerbal == 4 ? 'active' : '' }}">{{ $kemampuanVerbal == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanVerbal == 5 ? 'active' : '' }}">{{ $kemampuanVerbal == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam mencerna konsep kata dan mengambil kesimpulan secara umum</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Berfikir Praktis</td>
                    <td>Lambat dalam memahami realita dan mengambil keputusan berdasarkan fakta</td>
                    <td class="scale-val {{ $berfikirPraktis == 1 ? 'active' : '' }}">{{ $berfikirPraktis == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirPraktis == 2 ? 'active' : '' }}">{{ $berfikirPraktis == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirPraktis == 3 ? 'active' : '' }}">{{ $berfikirPraktis == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirPraktis == 4 ? 'active' : '' }}">{{ $berfikirPraktis == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirPraktis == 5 ? 'active' : '' }}">{{ $berfikirPraktis == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam memahami realita dan mengambil keputusan berdasarkan fakta</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kemampuan Numerikal</td>
                    <td>Lambat dalam mencerna angka dan hitungan dalam persoalan hitungan</td>
                    <td class="scale-val {{ $kemampuanNumerikal == 1 ? 'active' : '' }}">{{ $kemampuanNumerikal == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanNumerikal == 2 ? 'active' : '' }}">{{ $kemampuanNumerikal == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanNumerikal == 3 ? 'active' : '' }}">{{ $kemampuanNumerikal == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanNumerikal == 4 ? 'active' : '' }}">{{ $kemampuanNumerikal == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemampuanNumerikal == 5 ? 'active' : '' }}">{{ $kemampuanNumerikal == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam mencerna angka dan hitungan dalam persoalan hitungan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Berfikir Strategis</td>
                    <td>Lambat dalam membayangkan secara holistic, berfikir konkret menyeluruh</td>
                    <td class="scale-val {{ $berfikirStrategis == 1 ? 'active' : '' }}">{{ $berfikirStrategis == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirStrategis == 2 ? 'active' : '' }}">{{ $berfikirStrategis == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirStrategis == 3 ? 'active' : '' }}">{{ $berfikirStrategis == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirStrategis == 4 ? 'active' : '' }}">{{ $berfikirStrategis == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $berfikirStrategis == 5 ? 'active' : '' }}">{{ $berfikirStrategis == 5 ? 'X' : '' }}</td>
                    <td>Cepat dalam membayangkan secara holistic, berfikir konkret menyeluruh</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Memori</td>
                    <td>Lambat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi kurang</td>
                    <td class="scale-val {{ $memori == 1 ? 'active' : '' }}">{{ $memori == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $memori == 2 ? 'active' : '' }}">{{ $memori == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $memori == 3 ? 'active' : '' }}">{{ $memori == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $memori == 4 ? 'active' : '' }}">{{ $memori == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $memori == 5 ? 'active' : '' }}">{{ $memori == 5 ? 'X' : '' }}</td>
                    <td>Cepat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi menetap</td>
                </tr>

                <!-- POLA KERJA -->
                <tr>
                    <td class="aspect-header" colspan="8">POLA KERJA</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kecepatan Kerja</td>
                    <td>Lambat bekerja, lambat menyesuaikan diri dengan pekerjaan.</td>
                    <td class="scale-val {{ $kecepatanKerja == 1 ? 'active' : '' }}">{{ $kecepatanKerja == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kecepatanKerja == 2 ? 'active' : '' }}">{{ $kecepatanKerja == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kecepatanKerja == 3 ? 'active' : '' }}">{{ $kecepatanKerja == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kecepatanKerja == 4 ? 'active' : '' }}">{{ $kecepatanKerja == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kecepatanKerja == 5 ? 'active' : '' }}">{{ $kecepatanKerja == 5 ? 'X' : '' }}</td>
                    <td>Cepat, dan mudah menyesuaikan dengan pekerjaan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Ketelitian Kerja</td>
                    <td>Banyak kesalahan, tidak konsentrasi dalam bekerja</td>
                    <td class="scale-val {{ $ketelitianKerja == 1 ? 'active' : '' }}">{{ $ketelitianKerja == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $ketelitianKerja == 2 ? 'active' : '' }}">{{ $ketelitianKerja == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $ketelitianKerja == 3 ? 'active' : '' }}">{{ $ketelitianKerja == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $ketelitianKerja == 4 ? 'active' : '' }}">{{ $ketelitianKerja == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $ketelitianKerja == 5 ? 'active' : '' }}">{{ $ketelitianKerja == 5 ? 'X' : '' }}</td>
                    <td>Penuh konsentrasi, sedikit membuat kesalahan.</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Daya Tahan Kerja</td>
                    <td>Tidak tahan pada tugas dan cenderung cepat bosan</td>
                    <td class="scale-val {{ $dayaTahanKerja == 1 ? 'active' : '' }}">{{ $dayaTahanKerja == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $dayaTahanKerja == 2 ? 'active' : '' }}">{{ $dayaTahanKerja == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $dayaTahanKerja == 3 ? 'active' : '' }}">{{ $dayaTahanKerja == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $dayaTahanKerja == 4 ? 'active' : '' }}">{{ $dayaTahanKerja == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $dayaTahanKerja == 5 ? 'active' : '' }}">{{ $dayaTahanKerja == 5 ? 'X' : '' }}</td>
                    <td>Sabar dan tahan terhadap tugas rutin, tidak mudah bosan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Keuletan Kerja</td>
                    <td>Mudah menyerah pada kesulitan dan hambatan, kurang ulet.</td>
                    <td class="scale-val {{ $keuletanKerja == 1 ? 'active' : '' }}">{{ $keuletanKerja == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $keuletanKerja == 2 ? 'active' : '' }}">{{ $keuletanKerja == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $keuletanKerja == 3 ? 'active' : '' }}">{{ $keuletanKerja == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $keuletanKerja == 4 ? 'active' : '' }}">{{ $keuletanKerja == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $keuletanKerja == 5 ? 'active' : '' }}">{{ $keuletanKerja == 5 ? 'X' : '' }}</td>
                    <td>Ulet, telaten dan selalu penuh semangat, penuh harapan</td>
                </tr>

                <!-- KEPRIBADIAN -->
                <tr>
                    <td class="aspect-header" colspan="8">KEPRIBADIAN</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Stabilitas Emosi</td>
                    <td>Pengendalian diri lemah, mudah terpengaruh</td>
                    <td class="scale-val {{ $stabilitasEmosi == 1 ? 'active' : '' }}">{{ $stabilitasEmosi == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $stabilitasEmosi == 2 ? 'active' : '' }}">{{ $stabilitasEmosi == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $stabilitasEmosi == 3 ? 'active' : '' }}">{{ $stabilitasEmosi == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $stabilitasEmosi == 4 ? 'active' : '' }}">{{ $stabilitasEmosi == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $stabilitasEmosi == 5 ? 'active' : '' }}">{{ $stabilitasEmosi == 5 ? 'X' : '' }}</td>
                    <td>Pengendalian diri prima, akurat dan mantab.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ================= PAGE 4 ================= -->
    <div class="page">
        <div class="header-logo">
            <div class="brand">Alpha Consulting</div>
            <div class="sub-brand">Psychological Service & Business Consulting</div>
            <div class="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <table class="hasil-table">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 25%;">Aspek Kepribadian</th>
                    <th rowspan="2" style="width: 32%;">Gambaran Individu Bila Nilai Rendah</th>
                    <th colspan="5" style="width: 20%;">Skala Baku</th>
                    <th rowspan="2" style="width: 23%;">Gambaran Individu Bila Tinggi</th>
                </tr>
                <tr>
                    <th style="width: 4%;">1</th>
                    <th style="width: 4%;">2</th>
                    <th style="width: 4%;">3</th>
                    <th style="width: 4%;">4</th>
                    <th style="width: 4%;">5</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight: bold;">Percaya Diri/Mandiri</td>
                    <td>Tidak yakin akan kemampuan diri & mudah terpengaruh orang lain</td>
                    <td class="scale-val {{ $percayaDiri == 1 ? 'active' : '' }}">{{ $percayaDiri == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $percayaDiri == 2 ? 'active' : '' }}">{{ $percayaDiri == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $percayaDiri == 3 ? 'active' : '' }}">{{ $percayaDiri == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $percayaDiri == 4 ? 'active' : '' }}">{{ $percayaDiri == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $percayaDiri == 5 ? 'active' : '' }}">{{ $percayaDiri == 5 ? 'X' : '' }}</td>
                    <td>Penuh keyakinan akan kemampuan diri, penuh kepastian</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Tanggung jawab</td>
                    <td>Tidak berani menghadapi resiko, menghindar dari tugas atau beban</td>
                    <td class="scale-val {{ $tanggungJawab == 1 ? 'active' : '' }}">{{ $tanggungJawab == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $tanggungJawab == 2 ? 'active' : '' }}">{{ $tanggungJawab == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $tanggungJawab == 3 ? 'active' : '' }}">{{ $tanggungJawab == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $tanggungJawab == 4 ? 'active' : '' }}">{{ $tanggungJawab == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $tanggungJawab == 5 ? 'active' : '' }}">{{ $tanggungJawab == 5 ? 'X' : '' }}</td>
                    <td>Berani menghadapi segala resiko atas tugas/beban kerja.</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kemauan Melayani</td>
                    <td>Kurang simpati dalam memberi pelayanan</td>
                    <td class="scale-val {{ $kemauanMelayani == 1 ? 'active' : '' }}">{{ $kemauanMelayani == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemauanMelayani == 2 ? 'active' : '' }}">{{ $kemauanMelayani == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemauanMelayani == 3 ? 'active' : '' }}">{{ $kemauanMelayani == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemauanMelayani == 4 ? 'active' : '' }}">{{ $kemauanMelayani == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kemauanMelayani == 5 ? 'active' : '' }}">{{ $kemauanMelayani == 5 ? 'X' : '' }}</td>
                    <td>Penuh simpati dalam memberi pelayanan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kepatuhan dan ketaatan</td>
                    <td>Cenderung tidak puas terhadap atasan, cenderung mengabaikan peraturan</td>
                    <td class="scale-val {{ $kepatuhan == 1 ? 'active' : '' }}">{{ $kepatuhan == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepatuhan == 2 ? 'active' : '' }}">{{ $kepatuhan == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepatuhan == 3 ? 'active' : '' }}">{{ $kepatuhan == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepatuhan == 4 ? 'active' : '' }}">{{ $kepatuhan == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepatuhan == 5 ? 'active' : '' }}">{{ $kepatuhan == 5 ? 'X' : '' }}</td>
                    <td>Loyal, patuh kepada kebijaksanaan/ perintah, peraturan dan struktur organisasi</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Hasrat berprestasi</td>
                    <td>Bekerja asal jadi, tidak berusaha untuk mencapai hasil yang terbaik.</td>
                    <td class="scale-val {{ $hasratBerprestasi == 1 ? 'active' : '' }}">{{ $hasratBerprestasi == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hasratBerprestasi == 2 ? 'active' : '' }}">{{ $hasratBerprestasi == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hasratBerprestasi == 3 ? 'active' : '' }}">{{ $hasratBerprestasi == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hasratBerprestasi == 4 ? 'active' : '' }}">{{ $hasratBerprestasi == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hasratBerprestasi == 5 ? 'active' : '' }}">{{ $hasratBerprestasi == 5 ? 'X' : '' }}</td>
                    <td>Penuh kesungguhan, berusaha mencapai hasil terbaik.</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Penyesuaian Diri</td>
                    <td>Membatasi diri, tak mau terlihat, kaku</td>
                    <td class="scale-val {{ $penyesuaianDiri == 1 ? 'active' : '' }}">{{ $penyesuaianDiri == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $penyesuaianDiri == 2 ? 'active' : '' }}">{{ $penyesuaianDiri == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $penyesuaianDiri == 3 ? 'active' : '' }}">{{ $penyesuaianDiri == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $penyesuaianDiri == 4 ? 'active' : '' }}">{{ $penyesuaianDiri == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $penyesuaianDiri == 5 ? 'active' : '' }}">{{ $penyesuaianDiri == 5 ? 'X' : '' }}</td>
                    <td>Supel, mudah bekerjasama dan luwes dalam pergaulan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Minat bekerja dengan hal detail</td>
                    <td>Kurang menyukai pekerjaan dengan hal-hal yang detail</td>
                    <td class="scale-val {{ $minatDetail == 1 ? 'active' : '' }}">{{ $minatDetail == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $minatDetail == 2 ? 'active' : '' }}">{{ $minatDetail == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $minatDetail == 3 ? 'active' : '' }}">{{ $minatDetail == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $minatDetail == 4 ? 'active' : '' }}">{{ $minatDetail == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $minatDetail == 5 ? 'active' : '' }}">{{ $minatDetail == 5 ? 'X' : '' }}</td>
                    <td>Sangat menyukai kegiatan atau pekerjaan yang detail</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Inisiatif</td>
                    <td>Lambat memiliki gagasan baru, terlalu lama merenung, cenderung menghindar keputusan</td>
                    <td class="scale-val {{ $inisiatif == 1 ? 'active' : '' }}">{{ $inisiatif == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $inisiatif == 2 ? 'active' : '' }}">{{ $inisiatif == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $inisiatif == 3 ? 'active' : '' }}">{{ $inisiatif == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $inisiatif == 4 ? 'active' : '' }}">{{ $inisiatif == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $inisiatif == 5 ? 'active' : '' }}">{{ $inisiatif == 5 ? 'X' : '' }}</td>
                    <td>Aktif, sangat yakin keputusan diambil, memiliki ide baru, cepat tanggap terhadap situasi</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kepemimpinan</td>
                    <td>Belum memiliki potensi untuk melakukan fungsi pengarahan</td>
                    <td class="scale-val {{ $kepemimpinan == 1 ? 'active' : '' }}">{{ $kepemimpinan == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepemimpinan == 2 ? 'active' : '' }}">{{ $kepemimpinan == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepemimpinan == 3 ? 'active' : '' }}">{{ $kepemimpinan == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepemimpinan == 4 ? 'active' : '' }}">{{ $kepemimpinan == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $kepemimpinan == 5 ? 'active' : '' }}">{{ $kepemimpinan == 5 ? 'X' : '' }}</td>
                    <td>Memiliki potensi dan bertanggung jawab dalam melakukan fungsi pengarahan</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Hubungan Sosial</td>
                    <td>Lambat dalam menjalin hubungan sosial dengan orang lain</td>
                    <td class="scale-val {{ $hubunganSosial == 1 ? 'active' : '' }}">{{ $hubunganSosial == 1 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hubunganSosial == 2 ? 'active' : '' }}">{{ $hubunganSosial == 2 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hubunganSosial == 3 ? 'active' : '' }}">{{ $hubunganSosial == 3 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hubunganSosial == 4 ? 'active' : '' }}">{{ $hubunganSosial == 4 ? 'X' : '' }}</td>
                    <td class="scale-val {{ $hubunganSosial == 5 ? 'active' : '' }}">{{ $hubunganSosial == 5 ? 'X' : '' }}</td>
                    <td>Memiliki hubungan dengan empati tinggi sehingga mudah menjalin hubungan sosial.</td>
                </tr>
            </tbody>
        </table>

        <div class="type-box">
            Tipe Kepribadian : {{ $personalityType }}
        </div>

        <!-- Intelegensi range bar -->
        <table class="iq-bar-table">
            <tr>
                <td class="iq-label">Intelegensi : {{ $session->score }}</td>
                <td class="{{ $session->score < 80 ? 'active' : '' }}">Sangat Rendah</td>
                <td class="{{ ($session->score >= 80 && $session->score < 90) ? 'active' : '' }}">Rata-rata bawah</td>
                <td class="{{ ($session->score >= 90 && $session->score < 110) ? 'active' : '' }}">Rata-Rata</td>
                <td class="{{ ($session->score >= 110 && $session->score < 120) ? 'active' : '' }}">Rata-Rata Atas</td>
                <td class="{{ ($session->score >= 120 && $session->score < 130) ? 'active' : '' }}">Tinggi</td>
                <td class="{{ $session->score >= 130 ? 'active' : '' }}">Sangat Tinggi</td>
            </tr>
        </table>

        <div class="section-title">III. Personal Profile</div>
        <p class="profile-p">
            {{ $iqText }}
        </p>
    </div>

    <!-- ================= PAGE 5 ================= -->
    <div class="page-no-break">
        <div class="header-logo">
            <div class="brand">Alpha Consulting</div>
            <div class="sub-brand">Psychological Service & Business Consulting</div>
            <div class="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div style="margin-top: 15px;">
            <p class="profile-p" style="margin-top: 0;">
                {{ $workText }}
            </p>
            <p class="profile-p">
                {{ $persText }}
            </p>

            <div class="section-title" style="margin-top: 25px;">Kekuatan</div>
            <ol class="styled-list" type="a">
                @foreach($strengths as $strength)
                    <li>{{ $strength }}</li>
                @endforeach
            </ol>

            <div class="section-title" style="margin-top: 20px;">Saran Pengembangan</div>
            <ol class="styled-list" type="a">
                @foreach($developments as $dev)
                    <li>{{ $dev }}</li>
                @endforeach
            </ol>
        </div>

        <!-- Signature -->
        <div class="sig-container">
            <table class="sig-table">
                <tr>
                    <td class="left-space"></td>
                    <td class="sig-content">
                        <div class="sig-date">Bandar lampung, {{ $session->completed_at?->format('d F Y') ?: now()->format('d F Y') }}</div>
                        <div class="sig-placeholder">
                            <!-- signature graphic representation -->
                            <div style="width: 100px; height: 35px; border-bottom: 1px solid #475569; margin: 0 auto; margin-bottom: 5px;"></div>
                        </div>
                        <div class="sig-name">Ine Laynazka, M. Psi., Psikolog</div>
                        <div class="sig-license">SIPP. 4177-22-21</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

</body>
</html>
