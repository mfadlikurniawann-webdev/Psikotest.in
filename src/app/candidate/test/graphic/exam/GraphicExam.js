'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const WARTEGG_STIMULI = [
  { id: 1, desc: 'Titik di tengah', draw: (ctx) => { ctx.beginPath(); ctx.arc(60,60,3,0,Math.PI*2); ctx.fill(); }},
  { id: 2, desc: 'Garis gelombang', draw: (ctx) => { ctx.beginPath(); ctx.moveTo(20,80); ctx.bezierCurveTo(40,40,80,100,100,60); ctx.stroke(); }},
  { id: 3, desc: 'Tiga garis naik', draw: (ctx) => { for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(30+i*20,90);ctx.lineTo(30+i*20,90-20-i*10);ctx.stroke();} }},
  { id: 4, desc: 'Kotak kecil', draw: (ctx) => { ctx.fillRect(70,10,30,30); }},
  { id: 5, desc: 'Dua garis diagonal', draw: (ctx) => { ctx.beginPath(); ctx.moveTo(20,100); ctx.lineTo(40,80); ctx.moveTo(20,80); ctx.lineTo(40,100); ctx.stroke(); }},
  { id: 6, desc: 'Garis horizontal & vertikal', draw: (ctx) => { ctx.beginPath(); ctx.moveTo(20,60); ctx.lineTo(100,60); ctx.moveTo(60,20); ctx.lineTo(60,100); ctx.stroke(); }},
  { id: 7, desc: 'Titik-titik kecil', draw: (ctx) => { for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(30+i*10,50+Math.sin(i)*10,2,0,Math.PI*2);ctx.fill();} }},
  { id: 8, desc: 'Lengkungan', draw: (ctx) => { ctx.beginPath(); ctx.arc(60,120,50,Math.PI*1.2,Math.PI*1.8); ctx.stroke(); }},
];

const TESTS = [
  { key: 'wartegg', title: 'Tes Wartegg', desc: 'Lengkapi 8 kotak di bawah ini dengan menggambar apapun yang Anda inginkan berdasarkan pola yang sudah ada.' },
  { key: 'dam', title: 'Tes Menggambar Orang (DAM)', desc: 'Gambar seorang manusia di area kanvas berikut. Setelah selesai, isi keterangan di bawah.' },
  { key: 'baum', title: 'Tes Pohon (BAUM)', desc: 'Gambar sebuah pohon berkayu (bukan pohon kelapa/pisang/bambu) di area kanvas berikut.' },
];

function DrawingCanvas({ width, height, canvasRef, onInit }) {
  const drawing = useRef(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (onInit) onInit(ctx);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => { drawing.current = false; };

  return (
    <canvas ref={canvasRef} width={width} height={height}
      className="border-2 border-ink-200 rounded-xl cursor-crosshair bg-white touch-none"
      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
  );
}

export default function GraphicExam({ session }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [damMeta, setDamMeta] = useState({ age: '', gender: '', activity: '' });

  // Canvas refs for each test
  const warteggRefs = useRef(Array(8).fill(null).map(() => ({ current: null })));
  const damRef = useRef(null);
  const baumRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (session.started_at) {
      const elapsed = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
      setTimeLeft(Math.max(0, 1800 - elapsed));
    }
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); handleSubmitAll(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  // Initialize wartegg refs properly
  const getWarteggRef = useCallback((index) => {
    if (!warteggRefs.current[index]) warteggRefs.current[index] = { current: null };
    return warteggRefs.current[index];
  }, []);

  const clearCanvas = (ref, w, h, initFn) => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    if (initFn) initFn(ctx);
  };

  const handleSubmitAll = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const submissions = [];

      // Wartegg: 8 canvases
      for (let i = 0; i < 8; i++) {
        const ref = warteggRefs.current[i];
        if (ref?.current) {
          submissions.push({
            test_subtype: 'wartegg',
            image_data: ref.current.toDataURL('image/png'),
            metadata: { box: i + 1, stimulus: WARTEGG_STIMULI[i].desc },
          });
        }
      }

      // DAM
      if (damRef.current) {
        submissions.push({
          test_subtype: 'dam',
          image_data: damRef.current.toDataURL('image/png'),
          metadata: damMeta,
        });
      }

      // BAUM
      if (baumRef.current) {
        submissions.push({
          test_subtype: 'baum',
          image_data: baumRef.current.toDataURL('image/png'),
          metadata: {},
        });
      }

      const res = await fetch('/api/test/submit-graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, submissions }),
      });

      if (res.ok) router.push('/candidate/dashboard');
      else { alert('Gagal mengirim hasil tes grafis.'); setSubmitting(false); }
    } catch { alert('Error jaringan.'); setSubmitting(false); }
  };

  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const test = TESTS[step];

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-ink-100 px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-rose rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
            </svg>
          </div>
          <div><p className="font-semibold text-ink-900 text-sm">Tes Grafis</p><p className="text-ink-400 text-xs">Psikotest.in</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {TESTS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === step ? 'bg-rose text-white' : i < step ? 'bg-sage/20 text-sage' : 'bg-ink-100 text-ink-400'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink-50 border border-ink-200 text-sm font-semibold text-ink-700">
            <span className="font-mono">{fmtTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-display font-bold text-ink-900 text-lg mb-1">{test.title}</h2>
          <p className="text-ink-400 text-sm leading-relaxed">{test.desc}</p>
        </div>

        {/* Wartegg */}
        {step === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WARTEGG_STIMULI.map((stim, i) => {
              const ref = getWarteggRef(i);
              return (
                <div key={i} className="bg-white border border-ink-100 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-semibold text-ink-400 mb-2 text-center">Kotak {i + 1}</p>
                  <DrawingCanvas width={120} height={120} canvasRef={ref}
                    onInit={(ctx) => { ctx.strokeStyle = '#999'; ctx.lineWidth = 1.5; stim.draw(ctx); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; }} />
                  <button onClick={() => clearCanvas(ref, 120, 120, (ctx) => { ctx.strokeStyle = '#999'; ctx.lineWidth = 1.5; stim.draw(ctx); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; })}
                    className="mt-2 w-full text-xs text-ink-400 hover:text-ink-700 transition">Hapus</button>
                </div>
              );
            })}
          </div>
        )}

        {/* DAM */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white border border-ink-100 rounded-xl p-4 shadow-sm flex justify-center">
              <DrawingCanvas width={500} height={400} canvasRef={damRef} />
            </div>
            <div className="bg-white border border-ink-100 rounded-xl p-4 shadow-sm grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1">Usia Orang</label>
                <input value={damMeta.age} onChange={e => setDamMeta(p => ({...p, age: e.target.value}))}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" placeholder="cth: 25 tahun" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1">Jenis Kelamin</label>
                <select value={damMeta.gender} onChange={e => setDamMeta(p => ({...p, gender: e.target.value}))}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm">
                  <option value="">Pilih</option><option value="male">Laki-laki</option><option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1">Aktivitas</label>
                <input value={damMeta.activity} onChange={e => setDamMeta(p => ({...p, activity: e.target.value}))}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm" placeholder="cth: Berjalan" />
              </div>
            </div>
          </div>
        )}

        {/* BAUM */}
        {step === 2 && (
          <div className="bg-white border border-ink-100 rounded-xl p-4 shadow-sm flex justify-center">
            <DrawingCanvas width={500} height={500} canvasRef={baumRef} />
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-ink-100 shadow-xl py-3.5 px-6 flex items-center justify-between">
        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}
          className="text-ink-500 hover:text-ink-900 text-sm font-medium transition disabled:opacity-30">← Sebelumnya</button>
        {step === 2 ? (
          <button onClick={handleSubmitAll} disabled={submitting}
            className="bg-gold hover:bg-gold-light text-ink-900 font-semibold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-60">
            {submitting ? 'Mengirim...' : 'Kumpulkan Semua Gambar'}
          </button>
        ) : (
          <button onClick={() => setStep(p => p + 1)}
            className="bg-ink-900 hover:bg-ink-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition">
            Selanjutnya →
          </button>
        )}
      </div>
    </div>
  );
}
