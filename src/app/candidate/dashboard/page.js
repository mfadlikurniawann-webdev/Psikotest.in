import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import CandidatePositionManager from './CandidatePositionManager';
import { redirect } from 'next/navigation';

export default async function CandidateDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Fetch all sessions for this user grouped by module
  const allSessions = await sql`
    SELECT * FROM test_sessions 
    WHERE user_id = ${user.id}
    ORDER BY id DESC
  `;

  // Group sessions by module
  const getSession = (module, status) => {
    return allSessions.find(s => s.module === module && s.status === status) || null;
  };

  const modules = {
    cognitive: {
      inProgress: getSession('cognitive', 'in_progress'),
      completed: getSession('cognitive', 'completed'),
      disqualified: getSession('cognitive', 'disqualified'),
    },
    personality: {
      inProgress: getSession('personality', 'in_progress'),
      completed: getSession('personality', 'completed'),
      disqualified: getSession('personality', 'disqualified'),
    },
    graphic: {
      inProgress: getSession('graphic', 'in_progress'),
      completed: getSession('graphic', 'completed'),
      disqualified: getSession('graphic', 'disqualified'),
    },
    kraepelin: {
      inProgress: getSession('kraepelin', 'in_progress'),
      completed: getSession('kraepelin', 'completed'),
      disqualified: getSession('kraepelin', 'disqualified'),
    },
  };

  // Legacy support: check old 'psikotes' sessions
  const legacyCompleted = allSessions.find(s => s.test_type === 'psikotes' && s.status === 'completed') || null;
  const legacyInProgress = allSessions.find(s => s.test_type === 'psikotes' && s.status === 'in_progress') || null;

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto w-full">
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

        {/* Dynamic Position Manager & Test Module Cards */}
        <div className="mb-8 w-full">
          <CandidatePositionManager
            initialPosition={user.position_applied}
            modules={modules}
            legacyCompleted={legacyCompleted}
            legacyInProgress={legacyInProgress}
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
                <p className="text-ink-600 text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
