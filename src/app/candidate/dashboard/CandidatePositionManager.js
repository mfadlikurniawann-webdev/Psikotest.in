'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MODULE_CONFIG = [
  {
    key: 'cognitive',
    title: 'Tes Kognitif (IQ)',
    desc: 'Penalaran Logika & Aritmatika, Kemampuan Verbal, Tes Spasial',
    detail: '75 soal · 45 menit',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    href: '/candidate/test/cognitive',
    examHref: '/candidate/test/cognitive/exam',
    color: 'gold',
  },
  {
    key: 'personality',
    title: 'Tes Kepribadian',
    desc: 'EPPS, MBTI (16 Tipe), DISC Profile',
    detail: '90 soal · 30 menit',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    href: '/candidate/test/personality',
    examHref: '/candidate/test/personality/exam',
    color: 'sage',
  },
  {
    key: 'graphic',
    title: 'Tes Grafis (Proyektif)',
    desc: 'Wartegg, Draw-a-Man (DAM), Tes Pohon (BAUM)',
    detail: '3 tes gambar · 30 menit',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    href: '/candidate/test/graphic',
    examHref: '/candidate/test/graphic/exam',
    color: 'rose',
  },
  {
    key: 'kraepelin',
    title: 'Tes Kraepelin (Pauli)',
    desc: 'Penjumlahan angka vertikal — mengukur ketelitian, konsistensi, ketahanan',
    detail: '50 baris · 15 menit',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    href: '/candidate/test/kraepelin',
    examHref: '/candidate/test/kraepelin/exam',
    color: 'ink',
  },
];

const COLOR_MAP = {
  gold: { bg: 'bg-gold/10', text: 'text-gold', badge: 'bg-gold/10 text-gold-dark' },
  sage: { bg: 'bg-sage/10', text: 'text-sage', badge: 'bg-sage/10 text-sage-dark' },
  rose: { bg: 'bg-rose/10', text: 'text-rose', badge: 'bg-rose/10 text-rose-dark' },
  ink: { bg: 'bg-ink-100', text: 'text-ink-700', badge: 'bg-ink-100 text-ink-700' },
};

function ModuleCard({ config, moduleData, hasPosition }) {
  const { inProgress, completed, disqualified } = moduleData || {};
  const colors = COLOR_MAP[config.color];
  const isComplete = !!completed;
  const isActive = !!inProgress;
  const isDQ = !!disqualified;

  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm card-hover flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={config.icon}/>
          </svg>
        </div>
        {isComplete && <span className="text-[10px] font-bold px-2.5 py-1 bg-sage/10 text-sage rounded-full uppercase">Selesai</span>}
        {isActive && <span className="text-[10px] font-bold px-2.5 py-1 bg-gold/10 text-gold-dark rounded-full uppercase">Berlangsung</span>}
        {isDQ && <span className="text-[10px] font-bold px-2.5 py-1 bg-rose/10 text-rose rounded-full uppercase">DQ</span>}
        {!isComplete && !isActive && !isDQ && <span className="text-[10px] font-medium text-ink-300">{config.detail}</span>}
      </div>

      <h3 className="font-display font-bold text-ink-900 text-sm mb-1">{config.title}</h3>
      <p className="text-ink-400 text-xs leading-relaxed mb-4 flex-1">{config.desc}</p>

      {isComplete ? (
        <Link href={`/candidate/result/${completed.id}`}
          className="w-full text-center bg-sage/10 text-sage font-semibold py-2.5 rounded-xl text-xs transition hover:bg-sage/20">
          Lihat Hasil
        </Link>
      ) : isDQ ? (
        <button disabled className="w-full bg-ink-100 text-ink-400 font-semibold py-2.5 rounded-xl text-xs cursor-not-allowed">
          Diblokir
        </button>
      ) : isActive ? (
        <Link href={config.examHref}
          className="w-full text-center bg-gold hover:bg-gold-light text-ink-900 font-semibold py-2.5 rounded-xl text-xs transition">
          Lanjutkan
        </Link>
      ) : (
        <Link href={hasPosition ? config.href : '#'}
          className={`w-full text-center font-semibold py-2.5 rounded-xl text-xs transition ${
            hasPosition
              ? 'bg-ink-900 hover:bg-ink-700 text-white'
              : 'bg-ink-100 text-ink-400 cursor-not-allowed'
          }`}
          onClick={e => { if (!hasPosition) e.preventDefault(); }}
        >
          {hasPosition ? 'Mulai Tes' : 'Pilih Posisi Dulu'}
        </Link>
      )}
    </div>
  );
}

export default function CandidatePositionManager({ initialPosition, modules, legacyCompleted, legacyInProgress }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!initialPosition);
  const [position, setPosition] = useState(initialPosition || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!position.trim()) { setError('Nama posisi tidak boleh kosong'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/candidate/update-position', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionApplied: position }),
      });
      const data = await res.json();
      if (res.ok) { setIsEditing(false); router.refresh(); }
      else { setError(data.error || 'Gagal memperbarui posisi'); }
    } catch { setError('Terjadi kesalahan jaringan'); }
    finally { setLoading(false); }
  };

  // Count completed modules
  const completedCount = MODULE_CONFIG.filter(m => modules[m.key]?.completed).length;
  const allDone = completedCount === 4;

  if (isEditing) {
    return (
      <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col w-full max-w-lg">
        <h3 className="font-display font-bold text-ink-900 text-lg mb-2">Pilih Posisi Pekerjaan</h3>
        <p className="text-ink-400 text-sm mb-4 leading-relaxed">
          Silakan tentukan posisi pekerjaan yang ingin Anda lamar sebelum memulai asesmen psikotes.
        </p>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose/5 border border-rose/20 rounded-xl text-rose-dark text-xs">{error}</div>
          )}
          <div>
            <label className="block text-ink-700 text-xs font-semibold mb-1.5">Posisi yang Dilamar</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
              placeholder="Contoh: Marketing Executive, Frontend Developer"
              className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 text-sm bg-white focus:outline-none focus:border-gold transition"
              required />
          </div>
          <div className="flex gap-3">
            {initialPosition && (
              <button type="button" onClick={() => { setPosition(initialPosition); setIsEditing(false); }}
                className="flex-1 border border-ink-200 text-ink-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-ink-50 transition">
                Batal
              </button>
            )}
            <button type="submit" disabled={loading}
              className="flex-1 bg-ink-900 hover:bg-ink-700 text-white py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-60">
              {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress summary */}
      <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-ink-900 text-base">Asesmen Psikotes Terpadu</h3>
            {allDone && <span className="text-[10px] font-bold px-2.5 py-1 bg-sage/10 text-sage rounded-full uppercase">Semua Selesai</span>}
          </div>
          <p className="text-ink-400 text-xs">
            Posisi: <span className="font-semibold text-ink-700">{initialPosition}</span> · Progress: <span className="font-bold text-ink-900">{completedCount}/4</span> modul
          </p>
        </div>
        <button onClick={() => setIsEditing(true)}
          className="px-3 py-2 border border-ink-200 text-ink-600 rounded-xl text-xs font-semibold hover:bg-ink-50 transition">
          Ganti Posisi
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full progress-bar" style={{ width: `${(completedCount / 4) * 100}%` }}></div>
      </div>

      {/* Module cards grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {MODULE_CONFIG.map(config => (
          <ModuleCard
            key={config.key}
            config={config}
            moduleData={modules[config.key]}
            hasPosition={!!initialPosition}
          />
        ))}
      </div>
    </div>
  );
}
