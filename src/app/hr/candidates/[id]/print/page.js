import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import AutoPrint from './AutoPrint';

function formatIndoDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export default async function HRPrintResultPage({ params }) {
  const { id } = params;
  const user = await getCurrentUser();

  // Verify user is HR
  if (user.role !== 'hr') {
    return <div className="p-8 text-red-600 font-bold">Akses Ditolak: Hanya HR yang dapat mengakses halaman ini.</div>;
  }

  // Get candidate user details
  const candidates = await sql`
    SELECT * FROM users WHERE id = ${id} AND role = 'candidate' LIMIT 1
  `;
  if (candidates.length === 0) {
    notFound();
  }
  const candidate = candidates[0];

  // Get completed test session
  const sessions = await sql`
    SELECT * FROM test_sessions 
    WHERE user_id = ${candidate.id} AND test_type = 'psikotes' AND status = 'completed'
    ORDER BY id DESC LIMIT 1
  `;
  if (sessions.length === 0) {
    return <div className="p-8 text-amber-600 font-bold">Kandidat belum menyelesaikan ujian psikotes atau status belum selesai.</div>;
  }
  const session = sessions[0];
  const detail = session.result_detail || {};

  // Formulating variables identical to original Laravel template logic
  const name = candidate.name;
  const seed = name.length % 3;

  const verbalScore = detail.verbal?.score ?? 60;
  const numerikScore = detail.numerik?.score ?? 50;
  const logikaScore = detail.logika?.score ?? 50;

  const pemahaman = Math.max(1, Math.min(5, Math.round((verbalScore / 100) * 3) + 2 - (seed % 2)));
  const analisisBahasa = Math.max(1, Math.min(5, Math.round((verbalScore / 100) * 3) + 2 + (seed % 2)));
  const berpikirFleksibel = Math.max(1, Math.min(5, Math.round((verbalScore / 100) * 3) + 1 + (seed % 2)));
  const kemampuanVerbal = Math.max(1, Math.min(5, Math.round((verbalScore / 100) * 3) + 2));

  const berfikirPraktis = Math.max(1, Math.min(5, Math.round((numerikScore / 100) * 3) + 2 - (seed % 2)));
  const kemampuanNumerikal = Math.max(1, Math.min(5, Math.round((numerikScore / 100) * 3) + 1 + (seed % 2)));

  const berfikirStrategis = Math.max(1, Math.min(5, Math.round((logikaScore / 100) * 3) + 2));
  const memori = Math.max(1, Math.min(5, Math.round((logikaScore / 100) * 3) + 2 - (seed % 2)));

  const kolabScore = detail.kepribadian?.kolaborasi ?? 60;
  const telitScore = detail.kepribadian?.ketelitian ?? 60;
  const stabScore = detail.kepribadian?.stabilitas ?? 60;
  const leadScore = detail.kepribadian?.kepemimpinan ?? 60;
  const integScore = detail.kepribadian?.integritas ?? 60;

  const kecepatanKerja = Math.max(1, Math.min(5, Math.round((kolabScore / 100) * 3) + 2));
  const ketelitianKerja = Math.max(1, Math.min(5, Math.round((telitScore / 100) * 3) + 2));
  const dayaTahanKerja = Math.max(1, Math.min(5, Math.round((stabScore / 100) * 3) + 2));
  const keuletanKerja = Math.max(1, Math.min(5, Math.round((leadScore / 100) * 3) + 1));

  const stabilitasEmosi = Math.max(1, Math.min(5, Math.round((stabScore / 100) * 3) + 2));
  const percayaDiri = Math.max(1, Math.min(5, Math.round((leadScore / 100) * 3) + 2));
  const tanggungJawab = Math.max(1, Math.min(5, Math.round((telitScore / 100) * 3) + 2));
  const kemauanMelayani = Math.max(1, Math.min(5, Math.round((kolabScore / 100) * 3) + 2));
  const kepatuhan = Math.max(1, Math.min(5, Math.round((integScore / 100) * 3) + 2));
  const hasratBerprestasi = Math.max(1, Math.min(5, Math.round((integScore / 100) * 3) + 2));
  const penyesuaianDiri = Math.max(1, Math.min(5, Math.round((kolabScore / 100) * 3) + 2));
  const minatDetail = Math.max(1, Math.min(5, Math.round((telitScore / 100) * 3) + 2));
  const inisiatif = Math.max(1, Math.min(5, Math.round((leadScore / 100) * 3) + 2));
  const kepemimpinan = Math.max(1, Math.min(5, Math.round((leadScore / 100) * 3) + 1));
  const hubunganSosial = Math.max(1, Math.min(5, Math.round((kolabScore / 100) * 3) + 2));

  const gender = candidate.gender === 'female' ? 'Perempuan' : candidate.gender === 'male' ? 'Laki-laki' : 'Perempuan';
  const age = candidate.birth_date ? `${new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()} Tahun` : '23 Tahun';
  const education = candidate.education || 'D4 / Sarjana Terapan';

  const iq = session.score;
  let iqText = "";
  if (iq >= 120) {
    iqText = `Sdr/Sdri ${name} memiliki taraf intelegensi superior dengan skor ${iq} sehingga ia mampu untuk memahami instruksi yang kompleks, melakukan analisis data secara mendalam, serta memecahkan masalah-masalah berskala besar secara taktis dan terstruktur dengan sangat cepat. Ia memiliki kemampuan verbal yang prima dan pemahaman logikal di atas rata-rata kelompok usianya.`;
  } else if (iq >= 90) {
    iqText = `Sdr/Sdri ${name} memiliki taraf intelegensi rata-rata yang stabil dengan skor ${iq} sehingga ia mampu untuk memahami instruksi secara sederhana maupun menengah dengan baik. Ia membutuhkan waktu yang wajar untuk memahami detail instruksi yang terlalu rumit, namun memiliki dasar penalaran verbal dan numerikal yang mantap serta memadai dalam menyelesaikan beban kerja rutin harian.`;
  } else {
    iqText = `Sdr/Sdri ${name} lebih siap dalam memahami instruksi kerja operasional yang sifatnya praktis dan terstruktur dengan skor ${iq}. Ia memerlukan bimbingan bertahap untuk tugas yang memerlukan tingkat penalaran akademis yang tinggi, namun memiliki ketekunan operasional yang baik jika diberikan arahan kerja yang jelas.`;
  }

  const workText = `Sdr/Sdri ${name} memiliki kecepatan kerja yang cukup baik dan berimbang dengan ketelitiannya. Ia cenderung teliti dan berhati-hati dalam mengelola kerapian tugas harian guna meminimalisir kesalahan operasional. Daya tahan kerjanya dalam menghadapi ritme kerja cepat cukup stabil, didukung oleh keuletan kerja yang membuatnya tidak mudah menyerah saat menghadapi kendala teknis di lapangan.`;

  const persText = `Dalam aspek kepribadian, ia merupakan pribadi yang memiliki stabilitas emosi yang stabil dan mampu mengendalikan perasaannya dalam situasi tertekan. Memiliki tingkat kepercayaan diri yang wajar dalam bergaul dan menunjukkan kemauan melayani yang hangat. Kepatuhannya terhadap peraturan organisasi sangat baik, dibarengi dengan tanggung jawab yang tinggi terhadap pemenuhan kewajiban kerjanya. Secara sosial, ia kooperatif dan mudah menyesuaikan diri dengan tim baru.`;

  const strengths = [
    "Memiliki kemampuan analisis logikal dan verbal yang memadai dalam menangkap inti instruksi kerja.",
    "Tanggung jawab tinggi dalam menuntaskan penugasan kerja operasional dengan teliti.",
    "Stabilitas emosi stabil sehingga mampu beradaptasi di bawah tekanan ritme kerja perusahaan."
  ];

  const developments = [
    "Perlu meningkatkan inisiatif mandiri untuk tidak selalu menunggu instruksi formal dari atasan.",
    "Meningkatkan rasa percaya diri untuk berani menyampaikan gagasan orisinal dalam forum tim.",
    "Perlu mengoptimalkan kemampuan numerikal dan penyusunan strategi pemecahan masalah teknis."
  ];

  const personalityType = "Advocate atau Kolaborator Mandiri yang berusaha membangun hubungan yang positif di tempat kerja.";

  const renderCells = (val) => {
    return [1, 2, 3, 4, 5].map((i) => (
      <td key={i} className={`scale-val ${val === i ? 'active' : ''}`}>
        {val === i ? 'X' : ''}
      </td>
    ));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          margin: 1.5cm;
          size: A4;
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
          height: auto;
          box-sizing: border-box;
        }
        .page-no-break {
          position: relative;
          height: auto;
          box-sizing: border-box;
        }
        
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

        .hasil-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .hasil-table th {
          background-color: #fed7aa;
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
          background-color: #cbd5e1 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color: #000000;
        }
        
        .type-box {
          border: 1px solid #475569;
          padding: 8px 12px;
          font-weight: bold;
          background-color: #f8fafc;
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 10px;
        }

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
          background-color: #94a3b8 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color: #ffffff;
        }

        .profile-p {
          text-align: justify;
          text-indent: 1cm;
          margin-bottom: 12px;
          line-height: 1.5;
          font-size: 10px;
        }
        
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
      ` }} />

      <AutoPrint />

      {/* ================= PAGE 1 ================= */}
      <div className="page">
        <div className="cover-container">
          <div className="cover-logo">ALPHA CONSULTING</div>
          <div className="cover-logo-desc">Psychological Service &amp; Business Consulting</div>
          
          <div className="cover-photo-box">
            <div className="cover-photo-box-content">
              Talent Assessment &amp; Development Program
            </div>
          </div>

          <div className="cover-title">Assessment &amp; Management Talenta</div>
          <div className="cover-subtitle">Right Person in Right Position</div>

          <div className="cover-bottom">Outsourcing &amp; Recruitment</div>
          <div className="cover-bottom-sub">Provide Talent by Needs</div>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="page">
        <div className="header-logo">
          <div className="brand">Alpha Consulting</div>
          <div className="sub-brand">Psychological Service &amp; Business Consulting</div>
          <div className="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Potential Review :</p>
          <p style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '10px' }}>Potential Review adalah</p>
          <p style={{ textAlign: 'justify', lineHeight: '1.5', fontSize: '10px', marginBottom: '20px' }}>
            Potential review adalah Kemampuanmu dalam melakukan potential review ini sangat menunjang kariermu. Sebagian orang belum menyadari ini, terkadang mereka lebih sibuk mengembangkan diri menjadi calon pekerja yang qualified sesuai kebutuhan lapangan kerja, ketimbang menemukan passion melalui kepribadiannya sendiri.
          </p>

          <p style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '10px' }}>Tujuan potensial review :</p>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.6', fontSize: '10px' }}>
            <li style={{ marginBottom: '12px', textAlign: 'justify' }}>
              <strong>Mengetahui alasan dalam bertindak</strong><br />
              Dengan menilai diri sendiri, kamu bisa mengetahui apa yang harus kamu lakukan ketika menghadapi masalah. Setelah kamu menyadari bagaimana kamu mengatasi persoalan, kamu bisa memahami apa yang membuatmu benar-benar berpikir.
            </li>
            <li style={{ marginBottom: '12px', textAlign: 'justify' }}>
              <strong>Bisa Meningkatkan Kualitas kinerja</strong><br />
              Setelah mengetahui berbagai kekuranganmu, kamu mulai terdorong untuk memperbaiki diri. Di sini kamu juga punya kesempatan untuk mencari tahu, bagaimana agar bisa bekerja dengan komitmen, jujur, dan penuh tanggung jawab.
            </li>
            <li style={{ marginBottom: '12px', textAlign: 'justify' }}>
              <strong>Mengetahui progress pekerjaan</strong><br />
              Sebelumnya kamu telah banyak belajar tentang motivasi diri dan bagaimana meningkatkan kualitas kinerja. Kini kamu bisa membandingkan kinerjamu yang sekarang dengan kinerjamu sebelumnya. Lebih baik, stabil, atau justru menurun?
            </li>
            <li style={{ marginBottom: '12px', textAlign: 'justify' }}>
              <strong>Memiliki pola pikir yang strategis dan sistematis</strong><br />
              Kamu sudah mampu melakukan penilaian terhadap cara berpikir, tindakan, dan pekerjaanmu. Dengan begitu kamu jadi punya pola pikir yang lebih strategis, artinya tepat sasaran dalam menentukan dan mencapai tujuan. Lalu berpikir sistematis, segala yang kamu pikirkan dan lakukan dapat disusun dengan baik dan terencana.
            </li>
            <li style={{ marginBottom: '12px', textAlign: 'justify' }}>
              <strong>Mengevaluasi efektivitas tindakanmu</strong><br />
              Poin yang nggak kalah penting adalah kamu bisa mengevaluasi diri dari setiap proyek yang kamu kerjakan. Kelebihan, kekurangan, motivasi diri, hingga cara berpikir. Pada tahap akhir, kamu bisa mengetahui implikasi yang ditimbulkan atas tindakanmu sebagai kesimpulan.
            </li>
          </ol>
        </div>
      </div>

      {/* ================= PAGE 3 ================= */}
      <div className="page">
        <div className="header-logo">
          <div className="brand">Alpha Consulting</div>
          <div className="sub-brand">Psychological Service &amp; Business Consulting</div>
          <div className="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div className="section-title">I. Identitas</div>
        <table className="identitas-table">
          <tbody>
            <tr>
              <td className="label-num">1.</td>
              <td className="label-text">Nama</td>
              <td className="val-text">{candidate.name}</td>
              <td className="label-text">Pendidikan</td>
              <td className="val-text">{education}</td>
            </tr>
            <tr>
              <td className="label-num">2.</td>
              <td className="label-text">Jenis Kelamin</td>
              <td className="val-text">{gender}</td>
              <td className="label-text">Fakultas / Prodi</td>
              <td className="val-text">{candidate.position_applied || '-'}</td>
            </tr>
            <tr>
              <td className="label-num">3.</td>
              <td className="label-text">Umur</td>
              <td className="val-text">{age}</td>
              <td className="label-text">Tanggal Tes</td>
              <td className="val-text">{formatIndoDate(session.completed_at)}</td>
            </tr>
          </tbody>
        </table>

        <div className="section-title" style={{ marginTop: '10px' }}>II. Hasil Psikotes</div>
        <table className="hasil-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '25%' }}>Aspek Psikologi</th>
              <th rowSpan={2} style={{ width: '32%' }}>Gambaran Individu Bila Nilai Rendah</th>
              <th colSpan={5} style={{ width: '20%' }}>Skala Baku</th>
              <th rowSpan={2} style={{ width: '23%' }}>Gambaran Individu Bila Tinggi</th>
            </tr>
            <tr>
              <th style={{ width: '4%' }}>1</th>
              <th style={{ width: '4%' }}>2</th>
              <th style={{ width: '4%' }}>3</th>
              <th style={{ width: '4%' }}>4</th>
              <th style={{ width: '4%' }}>5</th>
            </tr>
          </thead>
          <tbody>
            {/* INTELEGENSI */}
            <tr>
              <td className="aspect-header" colSpan={8}>INTELESENSI / KOGNITIF</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Pemahaman</td>
              <td>Lambat dalam menangkap inti masalah, pemahaman lambat</td>
              {renderCells(pemahaman)}
              <td>Cepat mengerti inti masalah, cepat tanggap.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Analisis dan Sintesis Bahasa</td>
              <td>Lambat dalam memahami dan memaknai bahasa dengan baik</td>
              {renderCells(analisisBahasa)}
              <td>Cepat dalam memahami dan memaknai bahasa</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Berpikir Fleksibel</td>
              <td>Lambat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya</td>
              {renderCells(berpikirFleksibel)}
              <td>Cepat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kemampuan Verbal</td>
              <td>Lambat dalam mencerna konsep kata untuk mengambil kesimpulan secara umum</td>
              {renderCells(kemampuanVerbal)}
              <td>Cepat dalam mencerna konsep kata dan mengambil kesimpulan secara umum</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Berfikir Praktis</td>
              <td>Lambat dalam memahami realita dan mengambil keputusan berdasarkan fakta</td>
              {renderCells(berfikirPraktis)}
              <td>Cepat dalam memahami realita dan mengambil keputusan berdasarkan fakta</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kemampuan Numerikal</td>
              <td>Lambat dalam mencerna angka dan hitungan dalam persoalan hitungan</td>
              {renderCells(kemampuanNumerikal)}
              <td>Cepat dalam mencerna angka dan hitungan dalam persoalan hitungan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Berfikir Strategis</td>
              <td>Lambat dalam membayangkan secara holistic, berfikir konkret menyeluruh</td>
              {renderCells(berfikirStrategis)}
              <td>Cepat dalam membayangkan secara holistic, berfikir konkret menyeluruh</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Memori</td>
              <td>Lambat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi kurang</td>
              {renderCells(memori)}
              <td>Cepat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi menetap</td>
            </tr>

            {/* POLA KERJA */}
            <tr>
              <td className="aspect-header" colSpan={8}>POLA KERJA</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kecepatan Kerja</td>
              <td>Lambat bekerja, lambat menyesuaikan diri dengan pekerjaan.</td>
              {renderCells(kecepatanKerja)}
              <td>Cepat, dan mudah menyesuaikan dengan pekerjaan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Ketelitian Kerja</td>
              <td>Banyak kesalahan, tidak konsentrasi dalam bekerja</td>
              {renderCells(ketelitianKerja)}
              <td>Penuh konsentrasi, sedikit membuat kesalahan.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Daya Tahan Kerja</td>
              <td>Tidak tahan pada tugas dan cenderung cepat bosan</td>
              {renderCells(dayaTahanKerja)}
              <td>Sabar dan tahan terhadap tugas rutin, tidak mudah bosan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Keuletan Kerja</td>
              <td>Mudah menyerah pada kesulitan dan hambatan, kurang ulet.</td>
              {renderCells(keuletanKerja)}
              <td>Ulet, telaten dan selalu penuh semangat, penuh harapan</td>
            </tr>

            {/* KEPRIBADIAN */}
            <tr>
              <td className="aspect-header" colSpan={8}>KEPRIBADIAN</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Stabilitas Emosi</td>
              <td>Pengendalian diri lemah, mudah terpengaruh</td>
              {renderCells(stabilitasEmosi)}
              <td>Pengendalian diri prima, akurat dan mantab.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= PAGE 4 ================= */}
      <div className="page">
        <div className="header-logo">
          <div className="brand">Alpha Consulting</div>
          <div className="sub-brand">Psychological Service &amp; Business Consulting</div>
          <div className="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <table className="hasil-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '25%' }}>Aspek Kepribadian</th>
              <th rowSpan={2} style={{ width: '32%' }}>Gambaran Individu Bila Nilai Rendah</th>
              <th colSpan={5} style={{ width: '20%' }}>Skala Baku</th>
              <th rowSpan={2} style={{ width: '23%' }}>Gambaran Individu Bila Tinggi</th>
            </tr>
            <tr>
              <th style={{ width: '4%' }}>1</th>
              <th style={{ width: '4%' }}>2</th>
              <th style={{ width: '4%' }}>3</th>
              <th style={{ width: '4%' }}>4</th>
              <th style={{ width: '4%' }}>5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Percaya Diri/Mandiri</td>
              <td>Tidak yakin akan kemampuan diri &amp; mudah terpengaruh orang lain</td>
              {renderCells(percayaDiri)}
              <td>Penuh keyakinan akan kemampuan diri, penuh kepastian</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Tanggung jawab</td>
              <td>Tidak berani menghadapi resiko, menghindar dari tugas atau beban</td>
              {renderCells(tanggungJawab)}
              <td>Berani menghadapi segala resiko atas tugas/beban kerja.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kemauan Melayani</td>
              <td>Kurang simpati dalam memberi pelayanan</td>
              {renderCells(kemauanMelayani)}
              <td>Penuh simpati dalam memberi pelayanan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kepatuhan dan ketaatan</td>
              <td>Cenderung tidak puas terhadap atasan, cenderung mengabaikan peraturan</td>
              {renderCells(kepatuhan)}
              <td>Loyal, patuh kepada kebijaksanaan/ perintah, peraturan dan struktur organisasi</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Hasrat berprestasi</td>
              <td>Bekerja asal jadi, tidak berusaha untuk mencapai hasil yang terbaik.</td>
              {renderCells(hasratBerprestasi)}
              <td>Penuh kesungguhan, berusaha mencapai hasil terbaik.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Penyesuaian Diri</td>
              <td>Membatasi diri, tak mau terlihat, kaku</td>
              {renderCells(penyesuaianDiri)}
              <td>Supel, mudah bekerjasama dan luwes dalam pergaulan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Minat bekerja dengan hal detail</td>
              <td>Kurang menyukai pekerjaan dengan hal-hal yang detail</td>
              {renderCells(minatDetail)}
              <td>Sangat menyukai kegiatan atau pekerjaan yang detail</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Inisiatif</td>
              <td>Lambat memiliki gagasan baru, terlalu lama merenung, cenderung menghindar keputusan</td>
              {renderCells(inisiatif)}
              <td>Aktif, sangat yakin keputusan diambil, memiliki ide baru, cepat tanggap terhadap situasi</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Kepemimpinan</td>
              <td>Belum memiliki potensi untuk melakukan fungsi pengarahan</td>
              {renderCells(kepemimpinan)}
              <td>Memiliki potensi dan bertanggung jawab dalam melakukan fungsi pengarahan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Hubungan Sosial</td>
              <td>Lambat dalam menjalin hubungan sosial dengan orang lain</td>
              {renderCells(hubunganSosial)}
              <td>Memiliki hubungan dengan empati tinggi sehingga mudah menjalin hubungan sosial.</td>
            </tr>
          </tbody>
        </table>

        <div className="type-box">
          Tipe Kepribadian : {personalityType}
        </div>

        {/* Intelegensi range bar */}
        <table className="iq-bar-table">
          <tbody>
            <tr>
              <td className="iq-label">Intelegensi : {session.score}</td>
              <td className={session.score < 80 ? 'active' : ''}>Sangat Rendah</td>
              <td className={(session.score >= 80 && session.score < 90) ? 'active' : ''}>Rata-rata bawah</td>
              <td className={(session.score >= 90 && session.score < 110) ? 'active' : ''}>Rata-Rata</td>
              <td className={(session.score >= 110 && session.score < 120) ? 'active' : ''}>Rata-Rata Atas</td>
              <td className={(session.score >= 120 && session.score < 130) ? 'active' : ''}>Tinggi</td>
              <td className={session.score >= 130 ? 'active' : ''}>Sangat Tinggi</td>
            </tr>
          </tbody>
        </table>

        <div className="section-title">III. Personal Profile</div>
        <p className="profile-p">
          {iqText}
        </p>
      </div>

      {/* ================= PAGE 5 ================= */}
      <div className="page-no-break">
        <div className="header-logo">
          <div className="brand">Alpha Consulting</div>
          <div className="sub-brand">Psychological Service &amp; Business Consulting</div>
          <div className="contact">E-mail: alphaconsulting.id@gmail.com | HP: 082269899003</div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <p className="profile-p" style={{ marginTop: 0 }}>
            {workText}
          </p>
          <p className="profile-p">
            {persText}
          </p>

          <div className="section-title" style={{ marginTop: '25px' }}>Kekuatan</div>
          <ol className="styled-list" type="a">
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ol>

          <div className="section-title" style={{ marginTop: '20px' }}>Saran Pengembangan</div>
          <ol className="styled-list" type="a">
            {developments.map((dev, i) => (
              <li key={i}>{dev}</li>
            ))}
          </ol>
        </div>

        {/* Signature */}
        <div className="sig-container">
          <table className="sig-table">
            <tbody>
              <tr>
                <td className="left-space"></td>
                <td className="sig-content">
                  <div className="sig-date">Bandar lampung, {formatIndoDate(session.completed_at)}</div>
                  <div className="sig-placeholder">
                    <div style={{ width: '100px', height: '35px', borderBottom: '1px solid #475569', margin: '0 auto', marginBottom: '5px' }}></div>
                  </div>
                  <div className="sig-name">Ine Laynazka, M. Psi., Psikolog</div>
                  <div className="sig-license">SIPP. 4177-22-21</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
