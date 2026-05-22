import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import HREvaluationForm from './HREvaluationForm';
import HRCandidateTabs from './HRCandidateTabs';

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d), mn=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${dt.getDate()} ${mn[dt.getMonth()]} ${dt.getFullYear()}, ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
}
function fmtDur(s) { if (!s) return '0 menit'; const m=Math.floor(s/60),sc=s%60; return sc>0?`${m}m ${sc}d`:`${m} menit`; }

export default async function HRCandidateDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const candidates = await sql`SELECT * FROM users WHERE id = ${params.id} AND role='candidate' LIMIT 1`;
  if (!candidates.length) notFound();
  const candidate = candidates[0];

  const sessions = await sql`SELECT * FROM test_sessions WHERE user_id = ${candidate.id} ORDER BY started_at DESC`;
  
  const cognitiveSession = sessions.find(s => s.module === 'cognitive');
  const personalitySession = sessions.find(s => s.module === 'personality');
  const graphicSession = sessions.find(s => s.module === 'graphic');
  const kraepelinSession = sessions.find(s => s.module === 'kraepelin');

  // Load graphic submissions if session exists
  let graphicSubmissions = [];
  if (graphicSession) {
    graphicSubmissions = await sql`SELECT * FROM graphic_submissions WHERE session_id = ${graphicSession.id}`;
  }

  // Load kraepelin results if session exists
  let kraepelinResults = [];
  if (kraepelinSession) {
    kraepelinResults = await sql`SELECT * FROM kraepelin_results WHERE session_id = ${kraepelinSession.id} ORDER BY row_number ASC`;
  }

  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const isDisqualified = sessions.some(s => s.status === 'disqualified');
  
  const iq = cognitiveSession?.score || 0;
  const iqColor = iq >= 120 ? 'text-sage' : iq >= 100 ? 'text-gold-dark' : 'text-rose';
  
  const cogDetail = cognitiveSession?.result_detail || {};
  const perDetail = personalitySession?.result_detail || {};
  const kraepelinDetail = kraepelinSession?.result_detail || {};

  const totalViolations = sessions.reduce((sum, s) => sum + (s.violation_count || 0), 0);

  // Use the cognitive session for HR evaluation form as the primary anchor
  const primarySession = cognitiveSession || sessions[0];

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-7 flex items-center gap-4 border-b border-ink-100 pb-6">
          <Link href="/hr/candidates" className="w-9 h-9 bg-white border border-ink-200 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-900 transition shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-ink-900 truncate">{candidate.name}</h1>
            <p className="text-ink-400 text-sm">{candidate.email} &middot; {candidate.position_applied||'Posisi belum diisi'}</p>
          </div>
          {isDisqualified && <span className="bg-rose/10 text-rose text-xs font-semibold px-3 py-1 rounded-full">Diskualifikasi</span>}
          <span className="bg-ink-100 text-ink-700 text-xs font-semibold px-3 py-1 rounded-full">{completedCount}/4 Modul Selesai</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left column: Overview */}
          <div className="space-y-5">
            {/* IQ Score */}
            <div className="bg-white border border-ink-100 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Skor IQ</p>
              <p className={`font-display font-black text-5xl ${iqColor} mb-2`}>{iq || '—'}</p>
              <span className="inline-block bg-gold/10 text-gold-dark text-sm font-semibold px-3 py-1 rounded-full">
                {cognitiveSession?.personality_type || cogDetail.classification || 'Belum Tersedia'}
              </span>
              <div className="mt-4 pt-4 border-t border-ink-50 space-y-2 text-sm text-left">
                <div className="flex justify-between"><span className="text-ink-400">Total Pelanggaran</span><span className={`font-semibold ${totalViolations>0?'text-rose':'text-sage'}`}>{totalViolations}x</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Tipe Kepribadian</span><span className="font-semibold text-xs">{personalitySession?.personality_type || perDetail.mbti?.type || '—'}</span></div>
              </div>
            </div>

            {/* Profil */}
            <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Profil Pelamar</p>
              <div className="space-y-3 text-sm">
                {[['Nama', candidate.name],['Email', candidate.email],['Posisi', candidate.position_applied||'—'],['Pendidikan', candidate.education||'—'], ['Usia', candidate.birth_date ? `${new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()} Tahun` : '—']].map(([k,v]) => (
                  <div key={k}><p className="text-xs text-ink-400 uppercase font-semibold tracking-wider mb-0.5">{k}</p><p className="font-medium text-ink-900">{v}</p></div>
                ))}
              </div>
            </div>

            {/* HR Evaluation Form */}
            {primarySession && (
              <HREvaluationForm
                sessionId={primarySession.id}
                initialStatus={primarySession.hr_status}
                initialNotes={primarySession.hr_notes}
              />
            )}
          </div>

          {/* Right column: Tabs for modules */}
          <div className="lg:col-span-2">
            <HRCandidateTabs 
              sessions={{ cognitive: cognitiveSession, personality: personalitySession, graphic: graphicSession, kraepelin: kraepelinSession }}
              details={{ cognitive: cogDetail, personality: perDetail, kraepelin: kraepelinDetail }}
              graphicSubmissions={graphicSubmissions}
              kraepelinResults={kraepelinResults}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
