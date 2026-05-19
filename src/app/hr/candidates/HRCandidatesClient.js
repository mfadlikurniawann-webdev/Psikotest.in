'use client';
import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HRCandidatesClient({ user, candidates, positions }) {
  const router = useRouter();
  const [search, setSearch]   = useState('');
  const [position, setPosition] = useState('');
  const [delId, setDelId]     = useState(null);
  const [deleting, setDel]    = useState(false);

  const filtered = candidates.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    const matchPos    = !position || c.position_applied === position;
    return matchSearch && matchPos;
  });

  const handleDelete = async () => {
    if (!delId) return; setDel(true);
    await fetch(`/api/hr/delete/${delId}`, { method:'DELETE' });
    setDelId(null); setDel(false); router.refresh();
  };

  const inp = "border border-ink-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gold bg-white text-ink-900 transition";

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="font-display text-2xl font-bold text-ink-900">Kandidat</h1><p className="text-ink-400 text-sm">{candidates.length} kandidat terdaftar</p></div>
        </div>

        {/* Filter */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama atau email..." className={`${inp} flex-1`}/>
          <select value={position} onChange={e=>setPosition(e.target.value)} className={inp}>
            <option value="">Semua Posisi</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(search||position) && <button onClick={()=>{setSearch('');setPosition('');}} className="border border-ink-200 text-ink-500 px-4 py-2 rounded-xl text-sm hover:bg-ink-50 transition">Reset</button>}
        </div>

        {/* Table */}
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  {['Kandidat','Posisi','Pendidikan','Status Tes','Skor IQ',''].map((h,i) => (
                    <th key={i} className={`text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3 ${i>1&&i<4?'hidden md:table-cell':''} ${i===4?'hidden sm:table-cell text-center':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="px-6 py-16 text-center text-ink-300"><p className="font-medium">Tidak ada kandidat</p><p className="text-xs mt-1">Coba ubah filter pencarian.</p></td></tr>
                  : filtered.map(c => {
                    const avgScore = c.sessions?.length > 0 ? Math.round(c.sessions.filter(s=>s.status==='completed').reduce((a,s)=>a+(s.score||0),0)/Math.max(1,c.sessions.filter(s=>s.status==='completed').length)) : null;
                    const completed = c.sessions?.some(s=>s.status==='completed');
                    const disq = c.sessions?.some(s=>s.status==='disqualified');
                    return (
                      <tr key={c.id} className="hover:bg-ink-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark text-xs font-bold flex-shrink-0">{(c.name||'?').slice(0,2).toUpperCase()}</div>
                            <div><p className="font-medium text-ink-900">{c.name}</p><p className="text-ink-400 text-xs">{c.email}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell text-ink-600 text-sm">{c.position_applied||'—'}</td>
                        <td className="px-4 py-4 hidden md:table-cell text-ink-600 text-sm">{c.education||'—'}</td>
                        <td className="px-4 py-4">
                          {completed  && <span className="bg-sage/10 text-sage text-xs font-semibold px-2.5 py-1 rounded-full">Selesai</span>}
                          {disq       && <span className="bg-rose/10 text-rose text-xs font-semibold px-2.5 py-1 rounded-full">Diskualifikasi</span>}
                          {!completed && !disq && <span className="bg-ink-100 text-ink-500 text-xs font-semibold px-2.5 py-1 rounded-full">Belum</span>}
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell text-center">
                          {avgScore ? <span className={`font-display font-bold text-lg ${avgScore>=110?'text-sage':avgScore>=90?'text-gold-dark':'text-rose'}`}>{avgScore}</span> : <span className="text-ink-300">—</span>}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/hr/candidates/${c.id}`} className="text-ink-400 hover:text-ink-900 text-xs font-medium transition">Detail</Link>
                            <button onClick={() => setDelId(c.id)} className="text-rose/60 hover:text-rose text-xs transition">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 className="font-display font-bold text-ink-900 mb-2">Hapus Kandidat?</h3>
            <p className="text-ink-400 text-sm mb-5">Semua data tes kandidat ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 border border-ink-200 text-ink-700 py-2.5 rounded-xl text-sm font-medium hover:bg-ink-50 transition">Batal</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-rose text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-dark transition disabled:opacity-60">
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
