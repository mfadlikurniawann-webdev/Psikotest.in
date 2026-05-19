'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartButton({ existing }) {
  const router    = useRouter();
  const videoRef  = useRef(null);
  const [stream, setStream]       = useState(null);
  const [camOk, setCamOk]         = useState(false);
  const [camMsg, setCamMsg]       = useState('Mengaktifkan kamera...');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (existing) return;
    async function init() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user' }, audio:false });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setCamOk(true); setCamMsg('');
      } catch {
        setCamMsg('Kamera tidak diizinkan. Aktifkan akses kamera di browser Anda.');
      }
    }
    init();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [existing]);

  return (
    <div className="flex flex-col items-center bg-ink-50 border border-ink-100 rounded-2xl p-6">
      <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Verifikasi Kamera</p>

      <div className="relative w-full max-w-[260px] aspect-[4/3] bg-ink-200 rounded-xl overflow-hidden border-2 mb-4"
        style={{ borderColor: camOk ? '#4A7C59' : '#C9CDD8' }}>
        <video ref={videoRef} autoPlay muted playsInline
          className={`absolute inset-0 w-full h-full object-cover ${camOk ? '' : 'hidden'}`}/>
        {!camOk && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <p className={`text-xs leading-relaxed ${camMsg.includes('tidak') ? 'text-rose font-medium' : 'text-ink-400'}`}>{camMsg}</p>
          </div>
        )}
        {camOk && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 rounded-full px-2 py-0.5">
            <div className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">Live</span>
          </div>
        )}
      </div>

      <p className="text-ink-400 text-xs text-center max-w-[240px] leading-relaxed mb-5">
        Pastikan wajah Anda terlihat jelas dengan pencahayaan yang cukup sebelum memulai tes.
      </p>

      {existing ? (
        <div className="w-full max-w-[240px] text-center bg-sage/10 border border-sage/20 text-sage text-sm font-semibold py-2.5 rounded-xl">
          Tes sudah diselesaikan
        </div>
      ) : (
        <button onClick={() => { setLoading(true); router.push('/candidate/test/psikotes/exam'); }}
          disabled={!camOk || loading}
          className="w-full max-w-[240px] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? 'Menyiapkan Ujian...' : 'Mulai Ujian'}
        </button>
      )}
    </div>
  );
}
