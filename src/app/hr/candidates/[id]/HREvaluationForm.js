'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HREvaluationForm({ sessionId, initialStatus, initialNotes }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || 'unreviewed');
  const [notes, setNotes] = useState(initialNotes || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);

    try {
      const res = await fetch('/api/hr/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, hrStatus: status, hrNotes: notes }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Evaluasi berhasil disimpan!');
        router.refresh();
      } else {
        setErr(data.error || 'Gagal menyimpan evaluasi');
      }
    } catch (e) {
      setErr('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  const selectClasses = "w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white text-ink-900 transition";
  const textareaClasses = "w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white text-ink-900 transition h-28 resize-none";

  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-ink-50 pb-2">
        <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">Penilaian Rekrutmen</h3>
        {status === 'recommended' && <span className="w-2.5 h-2.5 rounded-full bg-sage block"></span>}
        {status === 'consider' && <span className="w-2.5 h-2.5 rounded-full bg-gold block"></span>}
        {status === 'not_recommended' && <span className="w-2.5 h-2.5 rounded-full bg-rose block"></span>}
        {status === 'unreviewed' && <span className="w-2.5 h-2.5 rounded-full bg-ink-200 block"></span>}
      </div>

      {msg && <div className="p-2.5 bg-sage/10 border border-sage/20 text-sage-dark text-xs rounded-xl">{msg}</div>}
      {err && <div className="p-2.5 bg-rose/10 border border-rose/20 text-rose-dark text-xs rounded-xl">{err}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-ink-500 text-xs font-semibold mb-1.5">Rekomendasi Kelayakan</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className={selectClasses}>
            <option value="unreviewed">Belum Ditentukan (Review)</option>
            <option value="recommended">Disarankan (Fit)</option>
            <option value="consider">Dipertimbangkan (Keep)</option>
            <option value="not_recommended">Tidak Disarankan (Unfit)</option>
          </select>
        </div>

        <div>
          <label className="block text-ink-500 text-xs font-semibold mb-1.5">Catatan Evaluasi / Keterangan</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Tuliskan catatan tambahan mengenai hasil psikotes, sikap, atau catatan interview kandidat di sini..."
            className={textareaClasses}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-ink-900 hover:bg-ink-700 text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Simpan Evaluasi'}
        </button>
      </form>
    </div>
  );
}
