'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Email atau password salah'); setLoading(false); return; }
      router.push(data.user.role === 'hr' ? '/hr/dashboard' : '/candidate/dashboard');
      router.refresh();
    } catch { setError('Terjadi kesalahan jaringan'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F6F7F9' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 flex-col justify-between p-12" style={{ background: 'linear-gradient(145deg,#0D1117,#161C2E)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
          </div>
          <span className="font-display font-semibold text-white text-lg">Psikotest.in</span>
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">Selamat Datang<br />Kembali</h2>
          <p className="text-ink-400 text-sm leading-relaxed mb-8">Masuk ke akun Anda untuk melanjutkan asesmen atau memantau hasil kandidat rekrutmen.</p>
          <div className="space-y-3">
            {['Monitoring kamera realtime selama tes', 'Anti tab-switch & fullscreen wajib', 'Laporan hasil terperinci per dimensi'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-ink-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-ink-600 text-xs">Psikotest.in &copy; {new Date().getFullYear()}</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
            </div>
            <span className="font-display font-semibold text-ink-900">Psikotest.in</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Masuk ke Akun</h1>
          <p className="text-ink-400 text-sm mb-8">Belum punya akun?{' '}<Link href="/register" className="text-gold hover:text-gold-dark font-medium">Daftar sekarang</Link></p>

          {error && (
            <div className="mb-4 p-3.5 bg-rose/5 border border-rose/20 rounded-xl text-rose-dark text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-rose flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-ink-700 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="form-input w-full border border-ink-200 rounded-xl px-4 py-3 text-ink-900 text-sm bg-white placeholder-ink-300 focus:outline-none transition"
                placeholder="nama@email.com" />
            </div>
            <div>
              <label className="block text-ink-700 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="form-input w-full border border-ink-200 rounded-xl px-4 py-3 text-ink-900 text-sm bg-white placeholder-ink-300 focus:outline-none transition"
                placeholder="Masukkan password" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-60 mt-2">
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-ink-300 text-xs mt-6 pt-6 border-t border-ink-100 leading-relaxed">
            Dengan masuk, Anda menyetujui bahwa pengerjaan tes dilakukan secara mandiri dan jujur.
          </p>
        </div>
      </div>
    </div>
  );
}
