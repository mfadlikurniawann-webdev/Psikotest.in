'use client';

import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HRCandidatesClient({ user, candidates, positions }) {
  const router = useRouter();
  const [search, setSearch]   = useState('');
  const [position, setPosition] = useState('');
  const [hrStatus, setHrStatus] = useState('');
  const [sortBy, setSortBy]     = useState('newest');
  
  // Selection states for comparison
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [delId, setDelId]     = useState(null);
  const [deleting, setDel]    = useState(false);

  // Helper: calculate age
  const getAge = (birthDate) => {
    if (!birthDate) return '—';
    return `${new Date().getFullYear() - new Date(birthDate).getFullYear()} Thn`;
  };

  // Helper: format date
  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
  };

  const handleSelectCandidate = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert('Anda hanya dapat membandingkan maksimal 3 kandidat sekaligus.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter logic
  const filtered = candidates.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    const matchPos    = !position || c.position_applied === position;
    
    const session = c.sessions?.find(s => s.status === 'completed');
    const status = session?.hr_status || 'unreviewed';
    const matchHrStatus = !hrStatus || status === hrStatus;

    return matchSearch && matchPos && matchHrStatus;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    const aSession = a.sessions?.find(s => s.status === 'completed') || a.sessions?.[0] || null;
    const bSession = b.sessions?.find(s => s.status === 'completed') || b.sessions?.[0] || null;

    if (sortBy === 'name-asc') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'name-desc') {
      return (b.name || '').localeCompare(a.name || '');
    }
    if (sortBy === 'iq-desc') {
      return (bSession?.score || 0) - (aSession?.score || 0);
    }
    if (sortBy === 'iq-asc') {
      const aScore = aSession?.status === 'completed' ? aSession.score : 9999;
      const bScore = bSession?.status === 'completed' ? bSession.score : 9999;
      return aScore - bScore;
    }
    if (sortBy === 'violations-desc') {
      return (bSession?.violation_count || 0) - (aSession?.violation_count || 0);
    }
    if (sortBy === 'newest') {
      const aTime = aSession?.completed_at ? new Date(aSession.completed_at).getTime() : 0;
      const bTime = bSession?.completed_at ? new Date(bSession.completed_at).getTime() : 0;
      return bTime - aTime;
    }
    return 0;
  });

  const handleDelete = async () => {
    if (!delId) return; setDel(true);
    await fetch(`/api/hr/delete/${delId}`, { method:'DELETE' });
    setSelectedIds(selectedIds.filter(x => x !== delId));
    setDelId(null); setDel(false); router.refresh();
  };

  // CSV Export logic
  const handleExportCSV = () => {
    if (sorted.length === 0) {
      alert('Tidak ada data kandidat untuk diekspor.');
      return;
    }

    const headers = [
      'Nama Kandidat',
      'Email',
      'No. HP',
      'Pendidikan',
      'Posisi Dilamar',
      'Status Ujian',
      'Rekomendasi HR',
      'Skor IQ',
      'Verbal (%)',
      'Numerik (%)',
      'Logika (%)',
      'Pelanggaran Proctoring',
      'Catatan HR'
    ];

    const rows = sorted.map(c => {
      const s = c.sessions?.find(session => session.status === 'completed') || c.sessions?.[0] || null;
      const completed = s?.status === 'completed';
      const detail = s?.result_detail || {};

      return [
        c.name || '—',
        c.email || '—',
        c.phone || '—',
        c.education || '—',
        c.position_applied || '—',
        s?.status === 'completed' ? 'Selesai' : s?.status === 'disqualified' ? 'Didiskualifikasi' : 'Belum Selesai',
        s?.hr_status === 'recommended' ? 'Disarankan' : s?.hr_status === 'consider' ? 'Dipertimbangkan' : s?.hr_status === 'not_recommended' ? 'Tidak Disarankan' : 'Belum Dievaluasi',
        completed ? s.score : '—',
        detail.verbal?.score !== undefined ? `${detail.verbal.score}%` : '—',
        detail.numerik?.score !== undefined ? `${detail.numerik.score}%` : '—',
        detail.logika?.score !== undefined ? `${detail.logika.score}%` : '—',
        s?.violation_count !== undefined ? s.violation_count : '—',
        s?.hr_notes ? `"${s.hr_notes.replace(/"/g, '""')}"` : '—'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kandidat_rekrutmen_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compareCandidates = candidates.filter(c => selectedIds.includes(c.id));

  const inp = "border border-ink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white text-ink-900 transition";

  return (
    <SidebarLayout user={user}>
      <div className="p-6 lg:p-8 max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Kandidat</h1>
            <p className="text-ink-400 text-sm">{candidates.length} kandidat terdaftar</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 border border-ink-200 hover:bg-ink-50 text-ink-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition bg-white shadow-sm"
          >
            <svg className="w-4 h-4 text-ink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ekspor CSV
          </button>
        </div>
 
        {/* Filter & Sorting Controls */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-5 flex flex-col lg:flex-row gap-3">
          <input 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            placeholder="Cari nama atau email..." 
            className={`${inp} flex-1`}
          />
          <select value={position} onChange={e=>setPosition(e.target.value)} className={inp}>
            <option value="">Semua Posisi</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={hrStatus} onChange={e=>setHrStatus(e.target.value)} className={inp}>
            <option value="">Semua Status Evaluasi</option>
            <option value="unreviewed">Belum Dievaluasi</option>
            <option value="recommended">Disarankan</option>
            <option value="consider">Dipertimbangkan</option>
            <option value="not_recommended">Tidak Disarankan</option>
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className={inp}>
            <option value="newest">Terbaru</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="iq-desc">IQ Tertinggi</option>
            <option value="iq-asc">IQ Terendah</option>
            <option value="violations-desc">Pelanggaran Terbanyak</option>
          </select>
          {(search || position || hrStatus || sortBy !== 'newest') && (
            <button 
              onClick={()=>{setSearch('');setPosition('');setHrStatus('');setSortBy('newest');}} 
              className="border border-ink-200 text-ink-500 px-4 py-2.5 rounded-xl text-sm hover:bg-ink-50 transition"
            >
              Reset
            </button>
          )}
        </div>
 
        {/* Candidates Table */}
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="px-6 py-4 w-12 text-center">
                    <span className="text-xs text-ink-300">Pilih</span>
                  </th>
                  <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3">Kandidat</th>
                  <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3">Posisi Dilamar</th>
                  <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3 hidden md:table-cell">Status Ujian</th>
                  <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3 hidden md:table-cell">Rekomendasi HR</th>
                  <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-widest px-6 py-3 hidden sm:table-cell text-center">Skor IQ</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-ink-300">
                      <p className="font-medium">Tidak ada kandidat</p>
                      <p className="text-xs mt-1">Coba ubah filter atau kriteria pencarian Anda.</p>
                    </td>
                  </tr>
                ) : (
                  sorted.map(c => {
                    const session = c.sessions?.find(s=>s.status==='completed') || c.sessions?.find(s=>s.status==='disqualified') || c.sessions?.[0] || null;
                    const completed = session?.status === 'completed';
                    const disq = session?.status === 'disqualified';
                    const score = completed ? session.score : null;
                    
                    const evalStatus = session?.hr_status || 'unreviewed';
                    
                    let evalBadge = <span className="bg-ink-100 text-ink-400 text-xs font-semibold px-2.5 py-1 rounded-full">Belum Dievaluasi</span>;
                    if (completed) {
                      if (evalStatus === 'recommended') {
                        evalBadge = <span className="bg-sage/10 text-sage text-xs font-semibold px-2.5 py-1 rounded-full">Disarankan</span>;
                      } else if (evalStatus === 'consider') {
                        evalBadge = <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-2.5 py-1 rounded-full">Dipertimbangkan</span>;
                      } else if (evalStatus === 'not_recommended') {
                        evalBadge = <span className="bg-rose/10 text-rose text-xs font-semibold px-2.5 py-1 rounded-full">Tidak Disarankan</span>;
                      }
                    } else {
                      evalBadge = <span className="text-ink-300">—</span>;
                    }
                    
                    return (
                      <tr key={c.id} className="hover:bg-ink-50 transition">
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox"
                            checked={selectedIds.includes(c.id)}
                            onChange={() => handleSelectCandidate(c.id)}
                            className="w-4.5 h-4.5 text-gold border-ink-300 rounded focus:ring-gold transition cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark text-xs font-bold flex-shrink-0">
                              {(c.name||'?').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-ink-900">{c.name}</p>
                              <p className="text-ink-400 text-xs">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-ink-600 text-sm">{c.position_applied || '—'}</td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {completed  && <span className="bg-sage/10 text-sage text-xs font-semibold px-2.5 py-1 rounded-full">Selesai</span>}
                          {disq       && <span className="bg-rose/10 text-rose text-xs font-semibold px-2.5 py-1 rounded-full">Diskualifikasi</span>}
                          {!completed && !disq && <span className="bg-ink-100 text-ink-500 text-xs font-semibold px-2.5 py-1 rounded-full">Belum Mulai</span>}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {evalBadge}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-center">
                          {score ? (
                            <span className={`font-display font-bold text-lg ${score>=110?'text-sage':score>=90?'text-gold-dark':'text-rose'}`}>
                              {score}
                            </span>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              href={`/hr/candidates/${c.id}`} 
                              className="text-ink-400 hover:text-ink-900 text-xs font-semibold transition"
                            >
                              Detail
                            </Link>
                            <button 
                              onClick={() => setDelId(c.id)} 
                              className="text-rose/60 hover:text-rose text-xs transition"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Comparison Bar */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-ink-900 text-white rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl border border-ink-700 backdrop-blur-md">
          <div className="text-sm font-semibold">
            <span className="text-gold font-bold">{selectedIds.length}</span> Kandidat Terpilih
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 border border-ink-600 text-ink-300 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button 
              onClick={() => setShowCompareModal(true)}
              className="bg-gold hover:bg-gold-light text-ink-900 px-5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              Bandingkan Hasil Asesmen
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-ink-900 mb-2">Hapus Kandidat?</h3>
            <p className="text-ink-400 text-sm mb-5">Semua data tes kandidat ini akan dihapus secara permanen dari basis data.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDelId(null)} 
                className="flex-1 border border-ink-200 text-ink-700 py-2.5 rounded-xl text-sm font-medium hover:bg-ink-50 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete} 
                disabled={deleting} 
                className="flex-1 bg-rose text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-dark transition disabled:opacity-60"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden border border-ink-100 my-8">
            {/* Modal Header */}
            <div className="bg-ink-900 text-white px-8 py-5 flex items-center justify-between border-b border-ink-800">
              <div>
                <h3 className="font-display font-bold text-lg">Perbandingan Hasil Psikotes</h3>
                <p className="text-ink-400 text-xs">Evaluasi komparatif kognitif dan kepribadian kerja kandidat</p>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="text-ink-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Comparison Grid) */}
            <div className="p-8 overflow-x-auto max-h-[calc(100vh-160px)]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink-150">
                    <th className="text-left font-semibold text-ink-400 text-xs uppercase tracking-widest pb-4 w-1/4">Parameter</th>
                    {compareCandidates.map(c => (
                      <th key={c.id} className="pb-4 w-1/4 text-center px-4">
                        <div className="font-display font-bold text-ink-900 text-base">{c.name}</div>
                        <div className="text-ink-400 text-xs font-normal mt-0.5">{c.position_applied || '—'}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  
                  {/* Profil Identitas */}
                  <tr className="bg-ink-50/50">
                    <td className="font-semibold text-ink-900 py-3 text-xs uppercase tracking-wider">Identitas</td>
                    {compareCandidates.map(c => (
                      <td key={c.id} className="py-3 text-center px-4 text-xs text-ink-600">
                        <div className="font-semibold text-ink-800">{c.education || '—'}</div>
                        <div>{getAge(c.birth_date)} &middot; {c.gender === 'female' ? 'Perempuan' : 'Laki-laki'}</div>
                        <div className="mt-1 font-mono text-[10px]">{c.email}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Skor IQ */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-4">Taraf &amp; Skor IQ</td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const score = s?.score || 0;
                      let classLabel = 'Belum Ujian';
                      let classColor = 'bg-ink-100 text-ink-500';
                      if (s) {
                        if (score >= 120) { classLabel = 'Tinggi / Superior'; classColor = 'bg-sage/10 text-sage'; }
                        else if (score >= 90) { classLabel = 'Rata-Rata'; classColor = 'bg-gold/10 text-gold-dark'; }
                        else { classLabel = 'Di Bawah Rata-Rata'; classColor = 'bg-rose/10 text-rose'; }
                      }
                      return (
                        <td key={c.id} className="py-4 text-center px-4">
                          {s ? (
                            <div>
                              <div className="font-display font-black text-2xl text-ink-900">{score}</div>
                              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${classColor}`}>
                                {classLabel}
                              </span>
                            </div>
                          ) : (
                            <span className="text-ink-300 font-medium">Belum Menyelesaikan Ujian</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Verbal */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-3.5">
                      Kemampuan Verbal
                      <span className="block text-xs font-normal text-ink-400 mt-0.5">Pemahaman kata &amp; analisis bahasa</span>
                    </td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const val = s?.result_detail?.verbal?.score ?? 0;
                      return (
                        <td key={c.id} className="py-3.5 px-4 text-center">
                          {s ? (
                            <div className="max-w-[140px] mx-auto">
                              <div className="flex justify-between text-xs font-semibold text-ink-800 mb-1">
                                <span>{val}%</span>
                                <span className="font-normal text-ink-400">Verbal</span>
                              </div>
                              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gold rounded-full" style={{ width: `${val}%` }}></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Numerik */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-3.5">
                      Kemampuan Numerik
                      <span className="block text-xs font-normal text-ink-400 mt-0.5">Daya cerna angka &amp; perhitungan</span>
                    </td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const val = s?.result_detail?.numerik?.score ?? 0;
                      return (
                        <td key={c.id} className="py-3.5 px-4 text-center">
                          {s ? (
                            <div className="max-w-[140px] mx-auto">
                              <div className="flex justify-between text-xs font-semibold text-ink-800 mb-1">
                                <span>{val}%</span>
                                <span className="font-normal text-ink-400">Numerik</span>
                              </div>
                              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gold rounded-full" style={{ width: `${val}%` }}></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Logika */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-3.5">
                      Penalaran Logika
                      <span className="block text-xs font-normal text-ink-400 mt-0.5">Penalaran logis &amp; spasial</span>
                    </td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const val = s?.result_detail?.logika?.score ?? 0;
                      return (
                        <td key={c.id} className="py-3.5 px-4 text-center">
                          {s ? (
                            <div className="max-w-[140px] mx-auto">
                              <div className="flex justify-between text-xs font-semibold text-ink-800 mb-1">
                                <span>{val}%</span>
                                <span className="font-normal text-ink-400">Logika</span>
                              </div>
                              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gold rounded-full" style={{ width: `${val}%` }}></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Karakteristik Kepribadian */}
                  <tr className="bg-ink-50/50">
                    <td className="font-semibold text-ink-900 py-3 text-xs uppercase tracking-wider">Profil Kepribadian Kerja</td>
                    {compareCandidates.map(c => (
                      <td key={c.id} className="py-3 text-center px-4"></td>
                    ))}
                  </tr>

                  {/* Kepribadian: Integritas, Kolaborasi, Kepemimpinan, Stabilitas, Ketelitian */}
                  {['integritas', 'kolaborasi', 'kepemimpinan', 'stabilitas', 'ketelitian'].map(key => {
                    const labels = {
                      integritas: 'Integritas & Etika Kerja',
                      kolaborasi: 'Kerjasama Tim',
                      kepemimpinan: 'Kepemimpinan & Inisiatif',
                      stabilitas: 'Stabilitas Emosi',
                      ketelitian: 'Ketelitian & Tgg. Jawab'
                    };
                    return (
                      <tr key={key}>
                        <td className="font-medium text-ink-700 py-2.5 pl-4 text-xs">{labels[key]}</td>
                        {compareCandidates.map(c => {
                          const s = c.sessions?.find(x => x.status === 'completed') || null;
                          const val = s?.result_detail?.kepribadian?.[key] ?? 0;
                          const barColor = val >= 75 ? 'bg-sage' : val >= 50 ? 'bg-gold' : 'bg-rose';
                          return (
                            <td key={c.id} className="py-2.5 px-4 text-center">
                              {s ? (
                                <div className="max-w-[140px] mx-auto flex items-center gap-2">
                                  <div className="w-8 text-left text-xs font-bold text-ink-800">{val}%</div>
                                  <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${val}%` }}></div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-ink-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Tipe Kepribadian */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-4">Tipe Kepribadian</td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const personalityType = s?.personality_type || '—';
                      return (
                        <td key={c.id} className="py-4 text-center px-4 font-medium text-xs text-amber-800 bg-amber-50/20 max-w-[180px] truncate-2-lines">
                          {personalityType}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Proctoring & Pelanggaran */}
                  <tr className="bg-ink-50/50">
                    <td className="font-semibold text-ink-900 py-3 text-xs uppercase tracking-wider">Integritas Proctoring</td>
                    {compareCandidates.map(c => (
                      <td key={c.id} className="py-3 text-center px-4"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="font-semibold text-ink-900 py-4">
                      Pelanggaran Proctoring
                      <span className="block text-xs font-normal text-ink-400 mt-0.5">Toleransi maksimal: 3 kali</span>
                    </td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || c.sessions?.[0] || null;
                      const vCount = s?.violation_count || 0;
                      return (
                        <td key={c.id} className="py-4 text-center px-4">
                          {s ? (
                            <div>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${vCount === 0 ? 'bg-sage/10 text-sage' : vCount <= 2 ? 'bg-gold/10 text-gold-dark' : 'bg-rose/10 text-rose'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${vCount === 0 ? 'bg-sage' : vCount <= 2 ? 'bg-gold' : 'bg-rose'}`}></span>
                                {vCount} Pelanggaran
                              </span>
                            </div>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Rekomendasi HR */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-4">Rekomendasi Evaluasi HR</td>
                    {compareCandidates.map(c => {
                      const s = c.sessions?.find(x => x.status === 'completed') || null;
                      const evalStatus = s?.hr_status || 'unreviewed';
                      
                      let badge = <span className="bg-ink-100 text-ink-400 text-xs font-semibold px-3 py-1.5 rounded-full">Belum Dievaluasi</span>;
                      if (s) {
                        if (evalStatus === 'recommended') {
                          badge = <span className="bg-sage/10 text-sage text-xs font-semibold px-3 py-1.5 rounded-full">Disarankan</span>;
                        } else if (evalStatus === 'consider') {
                          badge = <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1.5 rounded-full">Dipertimbangkan</span>;
                        } else if (evalStatus === 'not_recommended') {
                          badge = <span className="bg-rose/10 text-rose text-xs font-semibold px-3 py-1.5 rounded-full">Tidak Disarankan</span>;
                        }
                      } else {
                        badge = <span className="text-ink-300">—</span>;
                      }

                      return (
                        <td key={c.id} className="py-4 text-center px-4">
                          {badge}
                          {s?.hr_notes && (
                            <p className="text-[11px] text-ink-400 italic mt-2 max-w-[200px] mx-auto truncate-2-lines" title={s.hr_notes}>
                              "{s.hr_notes}"
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Aksi */}
                  <tr>
                    <td className="font-semibold text-ink-900 py-4">Tindakan</td>
                    {compareCandidates.map(c => (
                      <td key={c.id} className="py-4 text-center px-4">
                        <Link 
                          href={`/hr/candidates/${c.id}`}
                          className="inline-flex bg-ink-900 hover:bg-ink-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                        >
                          Buka Detail
                        </Link>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-ink-50 px-8 py-4 flex items-center justify-between border-t border-ink-100">
              <span className="text-xs text-ink-400">Pilih kandidat lain di daftar untuk mengganti perbandingan.</span>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="bg-ink-900 hover:bg-ink-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
