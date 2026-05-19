import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d), mn=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${dt.getDate()} ${mn[dt.getMonth()]} ${dt.getFullYear()}, ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
}
function fmtTime(d) {
  if (!d) return '—'; const dt = new Date(d);
  return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}:${String(dt.getSeconds()).padStart(2,'0')}`;
}
function fmtDur(s) { if (!s) return '0 menit'; const m=Math.floor(s/60),sc=s%60; return sc>0?`${m}m ${sc}d`:`${m} menit`; }

export default async function HRCandidateDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const candidates = await sql`SELECT * FROM users WHERE id = ${params.id} AND role='candidate' LIMIT 1`;
  if (!candidates.length) notFound();
  const candidate = candidates[0];

  const sessions = await sql`SELECT * FROM test_sessions WHERE user_id = ${candidate.id} AND test_type='psikotes' ORDER BY id DESC LIMIT 1`;
  const session  = sessions[0] || null;
  const detail   = session?.result_detail || {};

  let violations = [], snapshots = [];
  if (session) {
    violations = await sql`SELECT * FROM test_violations WHERE session_id = ${session.id} AND type != 'SNAPSHOT' ORDER BY occurred_at ASC`;
    snapshots  = await sql`SELECT id, snapshot_path, occurred_at FROM test_violations WHERE session_id = ${session.id} AND type = 'SNAPSHOT' AND snapshot_path IS NOT NULL ORDER BY occurred_at ASC`;
  }

  const completed   = session?.status === 'completed';
  const disq        = session?.status === 'disqualified';
  const iq          = detail.iq || session?.score || 0;
  const iqColor     = iq >= 120 ? 'text-sage' : iq >= 100 ? 'text-gold-dark' : 'text-rose';

  const traits = [
    { key:'integritas',   label:'Integritas & Etika Kerja',     desc:'Keselarasan perkataan, etika, dan tindakan.' },
    { key:'kolaborasi',   label:'Kerjasama Tim',                desc:'Kolaborasi positif dalam kelompok kerja.' },
    { key:'kepemimpinan', label:'Kepemimpinan & Inisiatif',     desc:'Keberanian memimpin dan mengambil inisiatif.' },
    { key:'stabilitas',   label:'Stabilitas Emosi & Stres',     desc:'Tenang di bawah tekanan dan tenggat waktu.' },
    { key:'ketelitian',   label:'Ketelitian & Tanggung Jawab',  desc:'Keakuratan kerja dan pemenuhan tugas.' },
  ];

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-7 flex items-center gap-4 border-b border-ink-100 pb-6">
          <Link href="/hr/candidates" className="w-9 h-9 bg-white border border-ink-200 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-900 transition shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-ink-900 truncate">{candidate.name}</h1>
            <p className="text-ink-400 text-sm">{candidate.email} &middot; {candidate.position_applied||'Posisi belum diisi'}</p>
          </div>
          {disq && <span className="bg-rose/10 text-rose text-xs font-semibold px-3 py-1 rounded-full">Diskualifikasi</span>}
          {completed && <Link href={`/candidate/result/${session.id}`} className="bg-gold hover:bg-gold-light text-ink-900 text-xs font-semibold px-4 py-2 rounded-xl transition">Lihat Laporan</Link>}
        </div>

        {!session ? (
          <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-ink-400">Kandidat ini belum mengerjakan tes apapun.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* IQ Score */}
              <div className="bg-white border border-ink-100 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Skor IQ</p>
                <p className={`font-display font-black text-5xl ${iqColor} mb-2`}>{iq}</p>
                <span className="inline-block bg-gold/10 text-gold-dark text-sm font-semibold px-3 py-1 rounded-full">{session.personality_type||detail.classification||'—'}</span>
                <div className="mt-4 pt-4 border-t border-ink-50 space-y-2 text-sm text-left">
                  <div className="flex justify-between"><span className="text-ink-400">Jawaban Benar</span><span className="font-semibold">{session.correct_answers||0}/75</span></div>
                  <div className="flex justify-between"><span className="text-ink-400">Durasi</span><span className="font-semibold">{fmtDur(session.duration_seconds)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-400">Selesai</span><span className="font-semibold text-xs">{fmtDate(session.completed_at)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-400">Pelanggaran</span><span className={`font-semibold ${(session.violation_count||0)>0?'text-rose':'text-sage'}`}>{session.violation_count||0}x</span></div>
                </div>
              </div>

              {/* Profil */}
              <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Profil Pelamar</p>
                <div className="space-y-3 text-sm">
                  {[['Nama', candidate.name],['Email', candidate.email],['Posisi', candidate.position_applied||'—'],['Pendidikan', candidate.education||'—']].map(([k,v]) => (
                    <div key={k}><p className="text-xs text-ink-400 uppercase font-semibold tracking-wider mb-0.5">{k}</p><p className="font-medium text-ink-900">{v}</p></div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-ink-900 border border-ink-700 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">Rekomendasi</p>
                <p className="text-ink-300 text-xs leading-relaxed">
                  {iq >= 110 ? 'Kapasitas kognitif superior. Direkomendasikan untuk posisi strategis dan kepemimpinan.' :
                   iq >= 90  ? 'Kapasitas rata-rata yang stabil. Cocok untuk posisi operasional standar.' :
                               'Pertimbangkan posisi dengan instruksi terstruktur dan supervisi berkala.'}
                </p>
              </div>
            </div>

            {/* Right columns */}
            <div className="lg:col-span-2 space-y-5">
              {/* Personality traits */}
              <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-display font-bold text-ink-900 mb-1">Profil Kepribadian Kerja</h2>
                <p className="text-ink-400 text-xs mb-5">Analisis kompetensi kepribadian dari Tahap 4 ujian.</p>
                {detail.kepribadian ? (
                  <div className="space-y-4">
                    {traits.map(t => {
                      const val = detail.kepribadian[t.key] ?? 0;
                      const c = val>=75?'#4A7C59':val>=50?'#C9A84C':'#C94A6A';
                      return (
                        <div key={t.key}>
                          <div className="flex justify-between mb-1.5"><span className="text-sm font-medium text-ink-700">{t.label}</span><span className="text-sm font-bold text-ink-900">{val}%</span></div>
                          <div className="h-2 bg-ink-100 rounded-full overflow-hidden mb-1"><div className="h-full rounded-full progress-bar" style={{width:`${val}%`,background:c}}></div></div>
                          <p className="text-ink-400 text-xs">{t.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-ink-400 text-sm">Data kepribadian tidak tersedia.</p>}
              </div>

              {/* Cognitive breakdown */}
              {detail.verbal && (
                <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-display font-bold text-ink-900 mb-4">Breakdown Kemampuan Kognitif</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[['Verbal',detail.verbal],['Numerik',detail.numerik],['Logika',detail.logika]].map(([l,d]) => (
                      <div key={l} className="bg-ink-50 border border-ink-100 rounded-xl p-4 text-center">
                        <p className="text-xs font-semibold text-ink-400 uppercase mb-2">{l}</p>
                        <p className="font-display font-black text-2xl text-ink-900">{d?.correct??0}<span className="text-ink-400 text-xs font-normal">/{d?.total??25}</span></p>
                        <span className="text-xs bg-white border border-ink-200 text-ink-600 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">{d?.score??0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Violations log */}
              {violations.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-display font-bold text-ink-900 mb-4">Log Pelanggaran Proctoring</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-ink-100"><th className="text-left text-ink-400 font-semibold px-3 py-2">Waktu</th><th className="text-left text-ink-400 font-semibold px-3 py-2">Tipe</th><th className="text-left text-ink-400 font-semibold px-3 py-2">Detail</th></tr></thead>
                      <tbody className="divide-y divide-ink-50">
                        {violations.map(v => (
                          <tr key={v.id} className="hover:bg-ink-50">
                            <td className="px-3 py-2.5 text-ink-500 font-mono">{fmtTime(v.occurred_at)}</td>
                            <td className="px-3 py-2.5 font-semibold text-rose">{v.type}</td>
                            <td className="px-3 py-2.5 text-ink-600">{v.detail||'—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
