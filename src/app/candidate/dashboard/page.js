import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';

function fmtDur(s) {
  if (!s) return '0 menit';
  const m = Math.floor(s/60), sec = s%60;
  return sec > 0 ? `${m} mnt ${sec} dtk` : `${m} menit`;
}

export default async function CandidateDashboardPage() {
  const user = await getCurrentUser();
  const sessions = await sql`SELECT * FROM test_sessions WHERE user_id = ${user.id} AND test_type = 'psikotes' ORDER BY id DESC LIMIT 1`;
  const session     = sessions[0] || null;
  const completed   = session?.status === 'completed';
  const disqualified = session?.status === 'disqualified';
  const inProgress  = session?.status === 'in_progress';

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold font-display font-bold">
            {user.name ? user.name.slice(0,2).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-ink-900">Selamat datang, {user.name?.split(' ')[0]}</h1>
            <p className="text-ink-400 text-sm">
              {user.position_applied ? <>Posisi: <span className="font-medium text-ink-700">{user.position_applied}</span></> : 'Selesaikan asesmen untuk melanjutkan rekrutmen.'}
            </p>
          </div>
        </div>

        {/* Test Module */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Modul Asesmen</p>
          <div className="grid md:grid-cols-3 gap-5">
            {/* Main test card */}
            <div className="md:col-span-2 bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 bg-gold/10 text-gold-dark rounded-full">Asesmen Utama</span>
                {completed   && <span className="text-xs font-semibold px-2.5 py-1 bg-sage/10 text-sage rounded-full">Selesai</span>}
                {disqualified && <span className="text-xs font-semibold px-2.5 py-1 bg-rose/10 text-rose rounded-full">Didiskualifikasi</span>}
                {inProgress  && <span className="text-xs font-semibold px-2.5 py-1 bg-gold/10 text-gold-dark rounded-full">Sedang Berjalan</span>}
                {!session    && <span className="text-xs text-ink-400">Durasi: 60 Menit</span>}
              </div>
              <h3 className="font-display font-bold text-ink-900 text-lg mb-2">Psikotes Terpadu Karyawan</h3>
              <p className="text-ink-400 text-sm mb-5 leading-relaxed">Mengukur potensi akademik, daya penalaran, serta karakteristik kepribadian kerja untuk mencocokkan profil kompetensi Anda.</p>
              <div className="border-t border-ink-50 pt-4 mb-5">
                <p className="text-xs font-semibold text-ink-400 uppercase mb-3">Struktur Ujian (100 Soal):</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-ink-600">
                  {['Tahap 1: Tes Verbal (25 Soal)','Tahap 2: Tes Numerik (25 Soal)','Tahap 3: Logika & Spasial (25 Soal)','Tahap 4: Karakteristik Kerja (25 Soal)'].map((t,i) => (
                    <div key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0"></div><span className="text-xs">{t}</span></div>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                {completed    && <Link href={`/candidate/result/${session.id}`} className="block text-center bg-gold hover:bg-gold-light text-ink-900 font-semibold py-2.5 rounded-xl text-sm transition">Lihat Laporan Hasil Tes</Link>}
                {disqualified && <div className="bg-rose/5 border border-rose/20 rounded-xl p-4 text-xs text-rose-dark leading-relaxed">Pengerjaan tes dihentikan karena pelanggaran. Hubungi tim HR untuk informasi lebih lanjut.</div>}
                {inProgress   && <Link href="/candidate/test/psikotes/exam" className="block text-center bg-gold hover:bg-gold-light text-ink-900 font-semibold py-2.5 rounded-xl text-sm transition">Lanjutkan Pengerjaan</Link>}
                {!session     && <Link href="/candidate/test/psikotes" className="block text-center bg-ink-900 hover:bg-ink-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">Mulai Asesmen Psikotes</Link>}
              </div>
            </div>

            {/* Score card */}
            <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Ringkasan Hasil</p>
              {completed ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <p className="text-ink-400 text-xs mb-1">Skor IQ Anda</p>
                  <p className="font-display font-black text-5xl text-gold mb-2">{session.score}</p>
                  <span className="inline-block bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full mb-5">{session.personality_type}</span>
                  <div className="w-full border-t border-ink-50 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-ink-400">Jawaban benar</span><span className="font-semibold text-ink-900">{session.correct_answers}/75</span></div>
                    <div className="flex justify-between"><span className="text-ink-400">Durasi</span><span className="font-semibold text-ink-900">{fmtDur(session.duration_seconds)}</span></div>
                    <div className="flex justify-between"><span className="text-ink-400">Pelanggaran</span><span className={`font-semibold ${session.violation_count > 0 ? 'text-rose' : 'text-sage'}`}>{session.violation_count}x</span></div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-ink-300 py-8">
                  <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <p className="text-sm leading-relaxed">Selesaikan ujian untuk melihat skor dan profil kepribadian kerja Anda.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <h3 className="font-semibold text-ink-900 text-sm mb-4">Tata Tertib Pelaksanaan Tes</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {['Izinkan akses kamera sebelum memulai tes — diperlukan untuk verifikasi identitas.',
              'Tes wajib dikerjakan dalam mode layar penuh. Jangan keluar dari fullscreen.',
              'Berpindah tab atau window akan tercatat sebagai pelanggaran secara otomatis.',
              'Lebih dari 3 pelanggaran akan mengakibatkan diskualifikasi permanen.',
              'Pastikan koneksi internet stabil selama pengerjaan berlangsung.',
              'Jawaban yang sudah dikumpulkan bersifat final dan tidak dapat diubah kembali.'].map((r,i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-ink-500 text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
