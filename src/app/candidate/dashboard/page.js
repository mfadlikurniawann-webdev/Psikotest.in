import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import CandidatePositionManager from './CandidatePositionManager';
import { redirect } from 'next/navigation';

export default async function CandidateDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Find any active in-progress test sessions (independent of position, so they can resume)
  const inProgressSessions = await sql`
    SELECT * FROM test_sessions 
    WHERE user_id = ${user.id} AND test_type = 'psikotes' AND status = 'in_progress' 
    ORDER BY id DESC LIMIT 1
  `;
  const inProgressSession = inProgressSessions[0] || null;

  // Find completed session for the current applied position
  let completedSession = null;
  if (user.position_applied) {
    const completedSessions = await sql`
      SELECT * FROM test_sessions 
      WHERE user_id = ${user.id} 
        AND test_type = 'psikotes' 
        AND status = 'completed' 
        AND position_applied = ${user.position_applied}
      ORDER BY id DESC LIMIT 1
    `;
    completedSession = completedSessions[0] || null;
  }

  // Find disqualified session for the current applied position
  let disqualifiedSession = null;
  if (user.position_applied) {
    const disqualifiedSessions = await sql`
      SELECT * FROM test_sessions 
      WHERE user_id = ${user.id} 
        AND test_type = 'psikotes' 
        AND status = 'disqualified' 
        AND position_applied = ${user.position_applied}
      ORDER BY id DESC LIMIT 1
    `;
    disqualifiedSession = disqualifiedSessions[0] || null;
  }

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
              {user.position_applied ? (
                <>Posisi Aktif: <span className="font-semibold text-ink-700">{user.position_applied}</span></>
              ) : (
                'Tentukan posisi pekerjaan untuk memulai asesmen.'
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Position Manager & Test Status Cards */}
        <div className="mb-8 w-full">
          <CandidatePositionManager
            initialPosition={user.position_applied}
            inProgressSession={inProgressSession}
            completedSession={completedSession}
            disqualifiedSession={disqualifiedSession}
          />
        </div>

        {/* Rules */}
        <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-ink-900 text-sm mb-4">Tata Tertib Pelaksanaan Tes</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Izinkan akses kamera sebelum memulai tes — diperlukan untuk verifikasi identitas.',
              'Tes wajib dikerjakan dalam mode layar penuh. Jangan keluar dari fullscreen.',
              'Berpindah tab atau window akan tercatat sebagai pelanggaran secara otomatis.',
              'Lebih dari 3 pelanggaran akan mengakibatkan diskualifikasi permanen.',
              'Pastikan koneksi internet stabil selama pengerjaan berlangsung.',
              'Jawaban yang sudah dikumpulkan bersifat final dan tidak dapat diubah kembali.'
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-ink-50 text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
