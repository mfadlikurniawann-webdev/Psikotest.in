'use client';
import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';

function timeAgo(d) {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 60000);
  if (diff < 1) return 'baru saja';
  if (diff < 60) return `${diff} menit lalu`;
  const h = Math.floor(diff/60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h/24)} hari lalu`;
}

const ICONS = {
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  list:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  ban:   'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  star:  'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
};

export default function HRDashboardClient({ user, stats, recentSessions, scoreDistribution }) {
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm]   = useState({ name:'', email:'', position_applied:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]     = useState(null);
  const [err, setErr]     = useState(null);
  const upd = e => setForm(p => ({...p,[e.target.name]:e.target.value}));

  const handleInvite = async (e) => {
    e.preventDefault(); setLoading(true); setMsg(null); setErr(null);
    const res  = await fetch('/api/hr/invite',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMsg(`Kandidat ${form.name} berhasil didaftarkan. Password: ${data.password}`); setForm({name:'',email:'',position_applied:'',password:''}); }
    else setErr(data.error||'Gagal mendaftarkan');
    setLoading(false);
  };

  const maxVal = Math.max(...Object.values(scoreDistribution))||1;
  const statCards = [
    { label:'Total Kandidat',  value:stats.total_candidates, icon:'users',  color:'text-ink-900', bg:'bg-ink-100' },
    { label:'Total Sesi Tes',  value:stats.total_sessions,   icon:'list',   color:'text-ink-700', bg:'bg-ink-100' },
    { label:'Tes Selesai',     value:stats.completed,         icon:'check',  color:'text-sage',    bg:'bg-sage/10' },
    { label:'Diskualifikasi',  value:stats.disqualified,      icon:'ban',    color:'text-rose',    bg:'bg-rose/10' },
    { label:'Rata-rata IQ',    value:Math.round(stats.avg_iq||0), icon:'star', color:'text-gold-dark', bg:'bg-gold/10' },
  ];

  const inp = "w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm text-ink-900 bg-white focus:outline-none focus:border-gold transition";

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard HR</h1>
            <p className="text-ink-400 text-sm">Ringkasan aktivitas psikotest rekrutmen</p>
          </div>
          <button onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Undang Kandidat
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
          {statCards.map(c => (
            <div key={c.label} className="card-hover bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-ink-400 text-xs font-medium leading-tight">{c.label}</p>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${c.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={ICONS[c.icon]}/></svg>
                </div>
              </div>
              <p className="font-display font-bold text-2xl text-ink-900">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent sessions */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-ink-50 flex items-center justify-between">
              <h2 className="font-semibold text-ink-900 text-sm">Sesi Terbaru</h2>
              <Link href="/hr/candidates" className="text-gold text-xs font-medium hover:text-gold-dark">Lihat semua</Link>
            </div>
            <div className="divide-y divide-ink-50">
              {recentSessions.length === 0
                ? <div className="px-6 py-12 text-center text-ink-300 text-sm">Belum ada sesi tes.</div>
                : recentSessions.map(s => (
                  <div key={s.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-ink-50 transition">
                    <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 text-xs font-semibold flex-shrink-0">
                      {(s.user_name||'?').slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{s.user_name}</p>
                      <p className="text-xs text-ink-400">{s.position_applied||'—'} &middot; {timeAgo(s.updated_at)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {s.status==='completed'    && <span className="bg-sage/10 text-sage text-xs font-semibold px-2 py-0.5 rounded-full">IQ {s.score}</span>}
                      {s.status==='disqualified' && <span className="bg-rose/10 text-rose text-xs font-semibold px-2 py-0.5 rounded-full">DQ</span>}
                      {s.status==='in_progress'  && <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-2 py-0.5 rounded-full">Berlangsung</span>}
                    </div>
                    <Link href={`/hr/candidates/${s.user_id}`} className="text-ink-300 hover:text-ink-700 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {/* Score distribution */}
          <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-ink-900 text-sm mb-5">Distribusi Skor IQ</h2>
            <div className="space-y-3">
              {Object.entries(scoreDistribution).map(([range, count]) => (
                <div key={range}>
                  <div className="flex justify-between text-xs mb-1"><span className="text-ink-500">{range}</span><span className="text-ink-700 font-semibold">{count}</span></div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full progress-bar" style={{width:`${(count/maxVal)*100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-ink-50">
              <p className="text-ink-400 text-xs">Rata-rata IQ Keseluruhan</p>
              <p className="font-display font-bold text-2xl text-ink-900 mt-0.5">{Math.round(stats.avg_iq||0)}<span className="text-ink-300 text-base font-normal"> poin</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink-900">Undang Kandidat</h3>
              <button onClick={() => {setShowInvite(false);setMsg(null);setErr(null);}} className="text-ink-400 hover:text-ink-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {msg && <div className="mb-3 p-3 bg-sage/10 border border-sage/20 text-sage-dark rounded-xl text-xs leading-relaxed">{msg}</div>}
            {err && <div className="mb-3 p-3 bg-rose/10 border border-rose/20 text-rose-dark rounded-xl text-xs">{err}</div>}
            <form onSubmit={handleInvite} className="space-y-3">
              <div><label className="block text-ink-600 text-xs font-semibold mb-1.5">Nama Lengkap</label><input name="name" value={form.name} onChange={upd} required className={inp} placeholder="Budi Santoso"/></div>
              <div><label className="block text-ink-600 text-xs font-semibold mb-1.5">Email</label><input type="email" name="email" value={form.email} onChange={upd} required className={inp} placeholder="budi@email.com"/></div>
              <div><label className="block text-ink-600 text-xs font-semibold mb-1.5">Posisi Dilamar</label><input name="position_applied" value={form.position_applied} onChange={upd} className={inp} placeholder="Marketing Manager"/></div>
              <div><label className="block text-ink-600 text-xs font-semibold mb-1.5">Password Sementara</label><input name="password" value={form.password} onChange={upd} required className={inp} placeholder="Min. 8 karakter"/></div>
              <button type="submit" disabled={loading} className="w-full bg-ink-900 hover:bg-ink-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 mt-1">
                {loading ? 'Mendaftarkan...' : 'Daftarkan Kandidat'}
              </button>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
