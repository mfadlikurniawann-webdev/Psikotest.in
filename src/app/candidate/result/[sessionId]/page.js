import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d), mn = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${dt.getDate()} ${mn[dt.getMonth()]} ${dt.getFullYear()}, ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
}
function fmtDur(s) { if (!s) return '0 menit'; const m=Math.floor(s/60),sc=s%60; return sc>0?`${m}m ${sc}d`:`${m} menit`; }

export default async function ResultPage({ params }) {
  const user    = await getCurrentUser();
  if (!user) redirect('/login');
  const sessions = await sql`SELECT ts.*, u.name as user_name, u.email as user_email FROM test_sessions ts JOIN users u ON ts.user_id = u.id WHERE ts.id = ${params.sessionId} LIMIT 1`;
  if (!sessions.length) notFound();
  const s = sessions[0];
  if (s.user_id !== user.id && user.role !== 'hr') redirect('/candidate/dashboard');

  const detail = s.result_detail || {};
  const traits = [
    { key:'integritas',   label:'Integritas & Etika Kerja',       desc:'Keselarasan perkataan, etika, dan tindakan profesional.' },
    { key:'kolaborasi',   label:'Kerjasama Tim',                   desc:'Kemampuan berkolaborasi positif dalam kelompok kerja.' },
    { key:'kepemimpinan', label:'Kepemimpinan & Inisiatif',        desc:'Keberanian memimpin dan mengambil inisiatif mandiri.' },
    { key:'stabilitas',   label:'Stabilitas Emosi & Manajemen Stres', desc:'Tetap tenang di bawah tekanan dan tenggat waktu.' },
    { key:'ketelitian',   label:'Ketelitian & Tanggung Jawab',     desc:'Keakuratan kerja, kerapian data, dan pemenuhan tugas.' },
  ];

  const cogPct = Math.round(((s.correct_answers||0)/75)*100);
  const iq = detail.iq || s.score || 0;
  const iqColor = iq >= 120 ? '#4A7C59' : iq >= 100 ? '#C9A84C' : '#C94A6A';

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-5xl">
        {/* Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-100 pb-6">
          <div className="flex items-center gap-4">
            <Link href={user.role==='hr'?`/hr/candidates/${s.user_id}`:'/candidate/dashboard'}
              className="w-9 h-9 bg-white border border-ink-200 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-900 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-ink-900">Hasil Asesmen Psikotes Terpadu</h1>
              <p className="text-ink-400 text-sm">{s.user_name} &middot; {fmtDate(s.completed_at)} WIB</p>
            </div>
          </div>
          {s.status === 'disqualified'
            ? <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose/10 border border-rose/20 text-rose text-xs font-semibold rounded-full">Didiskualifikasi</span>
            : <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage/10 border border-sage/20 text-sage text-xs font-semibold rounded-full"><span className="w-1.5 h-1.5 bg-sage rounded-full"></span>Proctoring Terverifikasi</span>
          }
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: IQ Card */}
          <div className="space-y-5">
            <div className="bg-white border border-ink-100 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Skor IQ</p>
              {/* SVG ring */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#E8EAF0" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="46" fill="none" stroke={iqColor} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray="289.0" strokeDashoffset={289*(1-(iq-70)/70)} style={{transition:'stroke-dashoffset 1.5s ease'}}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-black text-3xl text-ink-900">{iq}</span>
                  <span className="text-ink-400 text-xs">IQ</span>
                </div>
              </div>
              <span className="inline-block bg-gold/10 text-gold-dark text-sm font-semibold px-4 py-1.5 rounded-full">{s.personality_type || detail.classification}</span>

              <div className="mt-5 pt-4 border-t border-ink-50 space-y-2 text-sm text-left">
                <div className="flex justify-between"><span className="text-ink-400">Benar Kognitif</span><span className="font-semibold text-ink-900">{s.correct_answers||0}/75</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Durasi</span><span className="font-semibold text-ink-900">{fmtDur(s.duration_seconds)}</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Pelanggaran</span><span className={`font-semibold ${(s.violation_count||0)>0?'text-rose':'text-sage'}`}>{s.violation_count||0}x</span></div>
              </div>
            </div>

            {/* Cognitive breakdown */}
            {detail.verbal && (
              <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Skor Kognitif</p>
                <div className="space-y-3">
                  {[['Verbal',detail.verbal],['Numerik',detail.numerik],['Logika',detail.logika]].map(([lbl,d]) => (
                    <div key={lbl}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ink-600">{lbl}</span>
                        <span className="font-semibold text-ink-900">{d?.correct||0}/{d?.total||25}</span>
                      </div>
                      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full progress-bar" style={{width:`${d?.score||0}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Personality + Recommendation */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personality traits */}
            <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-5">Profil Kepribadian Kerja</p>
              <div className="space-y-4">
                {traits.map(t => {
                  const val = detail.kepribadian?.[t.key] ?? 0;
                  const color = val >= 75 ? '#4A7C59' : val >= 50 ? '#C9A84C' : '#C94A6A';
                  return (
                    <div key={t.key}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-ink-700">{t.label}</span>
                        <span className="text-sm font-bold text-ink-900">{val}%</span>
                      </div>
                      <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full progress-bar" style={{width:`${val}%`, background:color}}></div>
                      </div>
                      <p className="text-xs text-ink-400">{t.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6">
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">Rekomendasi HR</p>
              {iq >= 110
                ? <div className="flex items-start gap-3"><div className="w-5 h-5 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3 h-3 text-sage-light" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div><p className="text-ink-300 text-sm leading-relaxed">Kandidat memiliki kapasitas intelektual <strong className="text-white">di atas rata-rata</strong>. Disarankan untuk dilanjutkan ke tahap wawancara dan assessment lanjutan.</p></div>
                : iq >= 90
                ? <div className="flex items-start gap-3"><div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><p className="text-ink-300 text-sm leading-relaxed">Kandidat berada pada kapasitas intelektual <strong className="text-white">rata-rata</strong>. Pertimbangkan berdasarkan aspek kepribadian dan kompetensi teknis posisi.</p></div>
                : <div className="flex items-start gap-3"><div className="w-5 h-5 bg-rose/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3 h-3 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></div><p className="text-ink-300 text-sm leading-relaxed">Kandidat memerlukan <strong className="text-white">pertimbangan lebih</strong>. Kapasitas kognitif berada di bawah rata-rata untuk posisi yang dilamar.</p></div>
              }
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
