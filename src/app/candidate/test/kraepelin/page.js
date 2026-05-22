import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function KraepelinStartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  const existing = await sql`
    SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'kraepelin' AND status = 'completed' LIMIT 1
  `;

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
              <div className="w-12 h-12 bg-ink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-ink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Tes Kraepelin (Pauli)</h1>
                <p className="text-ink-400 text-sm">Mengukur ketelitian, konsistensi, dan ketahanan terhadap stres melalui penjumlahan angka.</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-ink-50 border border-ink-100 rounded-xl p-4 text-sm text-ink-600 leading-relaxed">
                <p className="font-semibold text-ink-900 mb-2">Cara Mengerjakan:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Anda akan melihat baris-baris angka vertikal</li>
                  <li>Jumlahkan dua angka yang bersebelahan (atas-bawah)</li>
                  <li>Masukkan <strong>digit satuan</strong> dari hasil penjumlahan (misal: 7+8=15 → masukkan 5)</li>
                  <li>Setiap baris memiliki waktu 15 detik, otomatis pindah ke baris berikutnya</li>
                  <li>Kerjakan secepat dan seteliti mungkin selama 15 menit</li>
                </ol>
              </div>
            </div>
            {existing.length > 0 ? (
              <div className="text-center bg-sage/10 border border-sage/20 text-sage text-sm font-semibold py-3 rounded-xl">Tes sudah diselesaikan</div>
            ) : (
              <Link href="/candidate/test/kraepelin/exam"
                className="block text-center bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl text-sm transition">
                Mulai Tes Kraepelin
              </Link>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
