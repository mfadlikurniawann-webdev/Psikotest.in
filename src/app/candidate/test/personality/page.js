import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import StartButton from '../cognitive/StartButton';
import { redirect } from 'next/navigation';

export default async function PersonalityStartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  const existingSessions = await sql`
    SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'personality' AND status = 'completed' LIMIT 1
  `;
  const existing = existingSessions.length > 0;

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <Link href="/candidate/dashboard" className="inline-flex items-center gap-2 text-ink-400 hover:text-ink-900 text-sm font-medium transition mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          Kembali ke Dashboard
        </Link>
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-ink-50">
              <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Tes Kepribadian</h1>
                <p className="text-ink-400 text-sm">Mengukur karakteristik kepribadian melalui EPPS, MBTI, dan DISC.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest">Struktur Tes Kepribadian</p>
                <div className="space-y-4">
                  {[
                    { title: 'EPPS (30 soal)', desc: 'Edwards Personal Preference Schedule — pilih pernyataan yang paling sesuai dengan diri Anda.' },
                    { title: 'MBTI (30 soal)', desc: 'Myers-Briggs Type Indicator — mengkategorikan kepribadian ke 16 tipe (E/I, S/N, T/F, J/P).' },
                    { title: 'DISC (30 soal)', desc: 'Mengukur profil perilaku: Dominance, Influence, Steadiness, Compliance.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sage font-bold text-sm">{i+1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink-900 text-sm">{item.title}</h3>
                        <p className="text-ink-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-sage/5 border border-sage/15 rounded-xl p-4 text-xs text-sage-dark leading-relaxed">
                  <p className="font-semibold mb-1">💡 Tidak ada jawaban benar atau salah</p>
                  Tes ini mengukur karakteristik kepribadian Anda. Jawablah dengan jujur sesuai kecenderungan alami Anda.
                </div>
              </div>
              <StartButton existing={existing} module="personality" />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
