'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CandidatePositionManager({ 
  initialPosition, 
  inProgressSession, 
  completedSession, 
  disqualifiedSession 
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!initialPosition);
  const [position, setPosition] = useState(initialPosition || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!position.trim()) {
      setError('Nama posisi tidak boleh kosong');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/candidate/update-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionApplied: position }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(data.error || 'Gagal memperbarui posisi');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveTest = !!inProgressSession;
  const isCompleted = !!completedSession;
  const isDisqualified = !!disqualifiedSession;

  if (isEditing) {
    return (
      <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col w-full">
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
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Contoh: Marketing Executive, Frontend Developer"
              className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 text-sm bg-white focus:outline-none focus:border-gold transition"
              required
            />
          </div>
          <div className="flex gap-3">
            {initialPosition && (
              <button
                type="button"
                onClick={() => {
                  setPosition(initialPosition);
                  setIsEditing(false);
                }}
                className="flex-1 border border-ink-200 text-ink-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-ink-50 transition"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-ink-900 hover:bg-ink-700 text-white py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5 w-full">
      {/* Modul Asesmen Card */}
      <div className="md:col-span-2 bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-gold/10 text-gold-dark rounded-full">Asesmen Utama</span>
            {isCompleted && <span className="text-xs font-semibold px-2.5 py-1 bg-sage/10 text-sage rounded-full">Selesai</span>}
            {isDisqualified && <span className="text-xs font-semibold px-2.5 py-1 bg-rose/10 text-rose rounded-full">Didiskualifikasi</span>}
            {hasActiveTest && <span className="text-xs font-semibold px-2.5 py-1 bg-gold/10 text-gold-dark rounded-full">Sedang Berjalan</span>}
            {!isCompleted && !isDisqualified && !hasActiveTest && <span className="text-xs text-ink-400">Durasi: 60 Menit</span>}
          </div>
          <h3 className="font-display font-bold text-ink-900 text-lg mb-1">Psikotes Terpadu Karyawan</h3>
          <p className="text-xs text-ink-400 mb-3">
            Posisi Dilamar: <span className="font-semibold text-ink-700">{initialPosition}</span>
          </p>
          <p className="text-ink-400 text-sm mb-5 leading-relaxed">
            Mengukur potensi akademik, daya penalaran, serta karakteristik kepribadian kerja untuk mencocokkan profil kompetensi Anda.
          </p>

          {isCompleted ? (
            <div className="bg-sage/5 border border-sage/15 rounded-xl p-4 mb-5 text-xs text-sage-dark leading-relaxed flex items-start gap-2.5">
              <svg className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-semibold block text-sm text-ink-900 mb-1">Asesmen Selesai!</span>
                Anda telah menyelesaikan psikotes untuk posisi <strong className="text-ink-900">{initialPosition}</strong>. Hasil psikotes Anda telah dievaluasi dan dikirim ke tim rekrutmen.
              </div>
            </div>
          ) : isDisqualified ? (
            <div className="bg-rose/5 border border-rose/20 rounded-xl p-4 mb-5 text-xs text-rose-dark leading-relaxed flex items-start gap-2.5">
              <svg className="w-5 h-5 text-rose mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <span className="font-semibold block text-sm text-ink-900 mb-1">Tes Dihentikan</span>
                Pengerjaan tes untuk posisi ini dihentikan karena terdeteksi adanya pelanggaran tata tertib. Silakan hubungi tim HR.
              </div>
            </div>
          ) : (
            <div className="border-t border-ink-50 pt-4 mb-5">
              <p className="text-xs font-semibold text-ink-400 uppercase mb-3">Struktur Ujian (100 Soal):</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-ink-600">
                {['Tahap 1: Tes Verbal (25 Soal)', 'Tahap 2: Tes Numerik (25 Soal)', 'Tahap 3: Logika & Spasial (25 Soal)', 'Tahap 4: Karakteristik Kerja (25 Soal)'].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0"></div>
                    <span className="text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {!isCompleted && !isDisqualified && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 border border-ink-200 text-ink-700 font-semibold rounded-xl text-sm hover:bg-ink-50 transition"
            >
              Ganti Posisi
            </button>
          )}

          {isCompleted && (
            <Link
              href={`/candidate/result/${completedSession.id}`}
              className="flex-1 text-center bg-gold hover:bg-gold-light text-ink-900 font-semibold py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              Lihat Laporan Hasil Psikotes
            </Link>
          )}

          {isDisqualified && (
            <button
              disabled
              className="flex-1 text-center bg-ink-100 text-ink-400 font-semibold py-2.5 rounded-xl text-sm cursor-not-allowed"
            >
              Ujian Diblokir
            </button>
          )}

          {hasActiveTest && (
            <Link
              href="/candidate/test/psikotes/exam"
              className="flex-1 text-center bg-gold hover:bg-gold-light text-ink-900 font-semibold py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              Lanjutkan Pengerjaan
            </Link>
          )}

          {!isCompleted && !isDisqualified && !hasActiveTest && (
            <Link
              href="/candidate/test/psikotes"
              className="flex-1 text-center bg-ink-900 hover:bg-ink-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
            >
              Mulai Asesmen Psikotes
            </Link>
          )}
        </div>
      </div>

      {/* Recruitment Status Card */}
      <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Status Rekrutmen</p>
        
        {isCompleted ? (
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="font-display font-bold text-base text-ink-900">Menunggu Evaluasi</p>
              <p className="text-xs text-ink-400 mt-1">Status: Sedang Direview oleh HR</p>
            </div>
            
            <div className="border-t border-ink-50 pt-4 space-y-3 text-xs">
              <div>
                <span className="text-ink-400 block mb-0.5">Posisi Dilamar:</span>
                <span className="font-semibold text-ink-800">{initialPosition}</span>
              </div>
              <div>
                <span className="text-ink-400 block mb-0.5">Metode Tes:</span>
                <span className="font-semibold text-ink-800">Online &amp; Proctoring Aktif</span>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg text-ink-500 leading-relaxed text-[11px]">
                Hasil detail psikotes berupa klasifikasi aspek dan kepribadian kerja dapat Anda lihat pada Laporan. Nilai numerik mentah bersifat rahasia untuk kebutuhan internal rekrutmen.
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-center border border-ink-200 text-ink-700 py-2 rounded-xl text-xs font-semibold hover:bg-ink-50 transition"
              >
                Lamar Posisi Lain
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-ink-300 py-8">
            <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed text-ink-400">
              {initialPosition 
                ? `Silakan mulai ujian untuk mengirim hasil psikotes untuk posisi ${initialPosition} ke HR.`
                : 'Silakan pilih posisi terlebih dahulu.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
