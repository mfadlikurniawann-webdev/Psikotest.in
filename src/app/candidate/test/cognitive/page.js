import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import StartButton from './StartButton';
import { redirect } from 'next/navigation';

export default async function CognitiveStartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  const existingSessions = await sql`
    SELECT * FROM test_sessions 
    WHERE user_id = ${user.id} AND module = 'cognitive' AND status = 'completed'
    LIMIT 1
  `;
  const existing = existingSessions.length > 0;

  const infos = [
    { icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title:'Durasi 45 Menit', desc:'Timer berjalan otomatis sejak tombol mulai diklik.' },
    { icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title:'Total 75 Soal', desc:'3 tahap: Logika & Aritmatika, Verbal, Spasial.' },
    { icon:'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', title:'Proctoring Aktif', desc:'Kamera memantau identitas Anda selama ujian berlangsung.' },
  ];

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
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Tes Kemampuan Kognitif</h1>
                <p className="text-ink-400 text-sm">Mengukur IQ melalui penalaran logika, kemampuan verbal, dan kemampuan spasial.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest">Informasi Sebelum Memulai</p>
                <div className="space-y-4">
                  {infos.map((info, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={info.icon}/></svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink-900 text-sm">{info.title}</h3>
                        <p className="text-ink-400 text-xs mt-0.5">{info.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ink-50 pt-4">
                  <p className="text-xs font-semibold text-ink-400 uppercase mb-3">Struktur Ujian:</p>
                  <div className="space-y-2 text-sm text-ink-600">
                    {['Tahap 1: Penalaran Logika & Aritmatika (25 Soal)', 'Tahap 2: Kemampuan Verbal — Sinonim, Antonim, Analogi (25 Soal)', 'Tahap 3: Tes Spasial — Visualisasi 2D/3D (25 Soal)'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0"></div>
                        <span className="text-xs">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-ink-900 rounded-xl p-4 text-sm leading-relaxed">
                  <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-2">Peraturan Penting</p>
                  <ul className="space-y-1.5">
                    {['Keluar fullscreen = pelanggaran dicatat', 'Buka tab lain = pelanggaran dicatat', '3 pelanggaran = diskualifikasi otomatis'].map((r,i) => (
                      <li key={i} className="flex items-center gap-2 text-ink-300 text-xs">
                        <div className="w-1 h-1 bg-gold rounded-full flex-shrink-0"></div>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <StartButton existing={existing} module="cognitive" />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
