'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', email:'', password:'', password_confirmation:'', phone:'', birth_date:'', education:'', position_applied:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const update = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.password_confirmation) { setError('Konfirmasi password tidak cocok'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'register', ...form }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal mendaftar'); setLoading(false); return; }
      router.push('/candidate/dashboard'); router.refresh();
    } catch { setError('Terjadi kesalahan jaringan'); setLoading(false); }
  };

  const inp = "form-input w-full border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 text-sm bg-white placeholder-ink-300 focus:outline-none transition";

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
            </div>
            <span className="font-display font-semibold text-ink-900 text-lg">Psikotest.in</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink-900">Buat Akun Kandidat</h1>
          <p className="text-ink-400 text-sm mt-1">Sudah punya akun?{' '}<Link href="/login" className="text-gold hover:text-gold-dark font-medium">Masuk di sini</Link></p>
        </div>

        <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3.5 bg-rose/5 border border-rose/20 rounded-xl text-rose-dark text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Nama Lengkap</label>
              <input type="text" name="name" value={form.name} onChange={update} required className={inp} placeholder="Nama lengkap Anda"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={update} required className={inp} placeholder="email@anda.com"/>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={update} required className={inp} placeholder="Min. 8 karakter"/>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Konfirmasi Password</label>
              <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={update} required className={inp} placeholder="Ulangi password"/>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Nomor Telepon</label>
              <input type="tel" name="phone" value={form.phone} onChange={update} className={inp} placeholder="08xxxxxxxxxx"/>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Tanggal Lahir</label>
              <input type="date" name="birth_date" value={form.birth_date} onChange={update} className={inp}/>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Pendidikan Terakhir</label>
              <select name="education" value={form.education} onChange={update} className={inp} style={{appearance:'none'}}>
                <option value="">Pilih pendidikan</option>
                {['SMA/SMK','D3','S1','S2','S3'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold mb-1.5">Posisi Dilamar</label>
              <input type="text" name="position_applied" value={form.position_applied} onChange={update} className={inp} placeholder="Marketing Manager"/>
            </div>
            <div className="sm:col-span-2 pt-2">
              <button type="submit" disabled={loading}
                className="w-full bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-60">
                {loading ? 'Mendaftarkan...' : 'Buat Akun & Mulai Tes'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-ink-400 text-xs mt-4">Dengan mendaftar, Anda setuju mengerjakan tes secara jujur dan mandiri.</p>
      </div>
    </div>
  );
}
