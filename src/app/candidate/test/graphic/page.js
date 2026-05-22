import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function GraphicStartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  const existingSessions = await sql`
    SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'graphic' AND status = 'completed' LIMIT 1
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
              <div className="w-12 h-12 bg-rose/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Tes Grafis (Proyektif)</h1>
                <p className="text-ink-400 text-sm">Menilai emosi, imajinasi, stabilitas emosi, dan kepercayaan diri melalui gambar.</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              {[
                { title:'Tes Wartegg', desc:'Lengkapi 8 kotak berisi pola dasar tertentu. Menilai emosi, imajinasi, dan kontrol diri.', icon:'▪' },
                { title:'Tes Menggambar Orang (DAM)', desc:'Gambar manusia dan ceritakan usia, jenis kelamin, serta aktivitasnya.', icon:'👤' },
                { title:'Tes Pohon (BAUM)', desc:'Gambar pohon berkayu untuk melihat stabilitas emosi dan kedewasaan.', icon:'🌳' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-ink-50 border border-ink-100 rounded-xl p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-ink-900 text-sm">{item.title}</h3>
                    <p className="text-ink-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {existing ? (
              <div className="text-center bg-sage/10 border border-sage/20 text-sage text-sm font-semibold py-3 rounded-xl">Tes sudah diselesaikan</div>
            ) : (
              <Link href="/candidate/test/graphic/exam"
                className="block text-center bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl text-sm transition">
                Mulai Tes Grafis
              </Link>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
