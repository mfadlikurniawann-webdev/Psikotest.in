'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamTaker({ session, questions, module = 'cognitive' }) {
  const router     = useRouter();
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const startRef   = useRef(Date.now());

  const TIME_LIMIT = module === 'cognitive' ? 2700 : module === 'personality' ? 1800 : 3600;

  const [idx, setIdx]           = useState(0);
  const [answers, setAnswers]   = useState({});
  const [violations, setViol]   = useState(session.violation_count || 0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [disq, setDisq]         = useState(session.status === 'disqualified');
  const [disqReason, setDisqR]  = useState(session.disqualify_reason || '');
  const [showWarn, setShowWarn] = useState(false);
  const [warnMsg, setWarnMsg]   = useState('');
  const [showSubmit, setShowSub] = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [camOn, setCamOn]       = useState(false);

  useEffect(() => {
    if (session.started_at) {
      const elapsed = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
      setTimeLeft(Math.max(0, TIME_LIMIT - elapsed));
    }
  }, []);

  // Anti-cheat: context menu
  useEffect(() => {
    const h = e => e.preventDefault();
    document.addEventListener('contextmenu', h);
    return () => document.removeEventListener('contextmenu', h);
  }, []);

  // Anti-cheat: keyboard
  useEffect(() => {
    const h = e => {
      const forbidden = ['F12','F5','F11'];
      const combo = (e.ctrlKey||e.metaKey) && ['t','n','w','r','s','a','u','c','v'].includes(e.key.toLowerCase());
      const alt = e.altKey && e.key === 'Tab';
      if (forbidden.includes(e.key) || combo || alt) { e.preventDefault(); logViolation('FORBIDDEN_KEY', e.key); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // Anti-cheat: copy/paste
  useEffect(() => {
    const h = e => { e.preventDefault(); logViolation('COPY_PASTE', e.type); };
    ['copy','paste','cut'].forEach(ev => document.addEventListener(ev, h));
    return () => ['copy','paste','cut'].forEach(ev => document.removeEventListener(ev, h));
  }, []);

  // Anti-cheat: visibility
  useEffect(() => {
    const hVis  = () => { if (document.hidden && !submitting) logViolation('TAB_SWITCH'); };
    const hBlur = () => { if (!submitting) logViolation('WINDOW_BLUR'); };
    document.addEventListener('visibilitychange', hVis);
    window.addEventListener('blur', hBlur);
    return () => { document.removeEventListener('visibilitychange', hVis); window.removeEventListener('blur', hBlur); };
  }, [submitting]);

  // Anti-cheat: fullscreen
  useEffect(() => {
    const h = () => { if (!document.fullscreenElement && !submitting) logViolation('FULLSCREEN_EXIT'); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, [submitting]);

  // Timer
  useEffect(() => {
    if (disq || submitting) return;
    const t = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(t); doSubmit(true); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [disq, submitting]);

  // Camera
  useEffect(() => {
    if (disq) return;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video:{ width:320, height:240, facingMode:'user' }, audio:false });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCamOn(true);
      } catch { setCamOn(false); }
    })();
    try { document.documentElement.requestFullscreen?.(); } catch {}
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [disq]);

  // Heartbeat
  useEffect(() => {
    if (disq) return;
    const hb = setInterval(async () => {
      const res  = await fetch('/api/proctor/heartbeat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: session.id }) });
      const data = await res.json();
      if (data.status === 'disqualified') { setDisq(true); setDisqR(data.disqualify_reason || ''); }
    }, 30000);
    return () => clearInterval(hb);
  }, [disq]);

  async function logViolation(type, detail = '') {
    const res  = await fetch('/api/proctor/violation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: session.id, type, detail }) });
    const data = await res.json();
    setViol(data.violations ?? violations + 1);
    if (data.disqualified) { setDisq(true); setDisqR(`Batas pelanggaran tercapai (${type})`); }
    else {
      const msgs = { TAB_SWITCH:'Anda berpindah tab browser.', WINDOW_BLUR:'Anda meninggalkan jendela tes.', FULLSCREEN_EXIT:'Anda keluar dari mode fullscreen.', FORBIDDEN_KEY:'Penggunaan tombol tidak diizinkan.', COPY_PASTE:'Aktivitas copy/paste terdeteksi.' };
      setWarnMsg(msgs[type] || 'Aktivitas mencurigakan terdeteksi.'); setShowWarn(true);
    }
  }

  function closeWarn() { setShowWarn(false); try { document.documentElement.requestFullscreen?.(); } catch {} }

  async function doSubmit(forced = false) {
    if (submitting) return;
    setSubmit(true); setShowSub(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    try { document.exitFullscreen?.(); } catch {}
    const duration = Math.floor((Date.now() - startRef.current) / 1000);
    const res = await fetch('/api/test/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: session.id, answers, duration, module }) });
    const data = await res.json();
    if (res.ok) router.push(`/candidate/result/${session.id}`);
    else { alert('Terjadi kesalahan saat mengumpulkan jawaban.'); setSubmit(false); }
  }

  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  
  const getCat = (i) => {
    if (module === 'cognitive') {
      if (i < 25) return { stage:'Tahap 1: Penalaran Logika & Aritmatika', label:'Logika', range:'Soal 1–25' };
      if (i < 50) return { stage:'Tahap 2: Kemampuan Verbal', label:'Verbal', range:'Soal 26–50' };
      return { stage:'Tahap 3: Tes Spasial', label:'Spasial', range:'Soal 51–75' };
    }
    if (module === 'personality') {
      if (i < 30) return { stage:'EPPS — Edwards Personal Preference', label:'EPPS', range:'Soal 1–30' };
      if (i < 60) return { stage:'MBTI — Myers-Briggs Type Indicator', label:'MBTI', range:'Soal 31–60' };
      return { stage:'DISC — Dominance, Influence, Steadiness, Compliance', label:'DISC', range:'Soal 61–90' };
    }
    return { stage:'Tes', label:'Soal', range:`Soal ${i+1}` };
  };

  if (disq) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm border border-ink-100">
          <div className="w-14 h-14 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Tes Dihentikan</h3>
          <p className="text-ink-400 text-sm mb-6">{disqReason || 'Anda telah melebihi batas pelanggaran yang diizinkan.'}</p>
          <button onClick={() => router.push('/candidate/dashboard')} className="w-full bg-ink-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-ink-700 transition">Kembali ke Dashboard</button>
        </div>
      </div>
    );
  }

  const q       = questions[idx] || {};
  const rawOpts = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];
  // Handle both simple string options and object options (for personality)
  const opts = rawOpts.map(o => typeof o === 'object' ? o.text : o);
  const cat     = getCat(idx);
  const pct     = Math.round(((idx + 1) / questions.length) * 100);
  const answered = Object.keys(answers).length;

  const getStages = () => {
    if (module === 'cognitive') return [
      { label:'Logika (1–25)', range:[0,25] },
      { label:'Verbal (26–50)', range:[25,50] },
      { label:'Spasial (51–75)', range:[50,75] },
    ];
    if (module === 'personality') return [
      { label:'EPPS (1–30)', range:[0,30] },
      { label:'MBTI (31–60)', range:[30,60] },
      { label:'DISC (61–90)', range:[60,90] },
    ];
    return [{ label:'Soal', range:[0, questions.length] }];
  };

  const stages = getStages();
  const moduleTitle = module === 'cognitive' ? 'Tes Kognitif' : module === 'personality' ? 'Tes Kepribadian' : 'Tes';

  return (
    <div className="bg-ink-50 min-h-screen" style={{userSelect:'none',WebkitUserSelect:'none'}} onContextMenu={e=>e.preventDefault()}>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-ink-100 px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-ink-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
          </div>
          <div className="min-w-0"><p className="font-semibold text-ink-900 text-sm truncate">{moduleTitle}</p><p className="text-ink-400 text-xs">Psikotest.in</p></div>
        </div>

        <div className="hidden sm:flex flex-col items-center flex-1 mx-6 max-w-xs">
          <div className="flex justify-between w-full mb-1">
            <span className="text-xs text-ink-400">Soal {idx+1}/{questions.length}</span>
            <span className="text-xs text-ink-400">{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full progress-bar" style={{width:`${pct}%`}}></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${timeLeft <= 300 ? 'bg-rose/5 border-rose/20 text-rose animate-pulse' : 'bg-ink-50 border-ink-200 text-ink-700'}`}>
            <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="font-mono">{fmtTime(timeLeft)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink-50 border border-ink-200 text-xs">
            <div className={`w-2 h-2 rounded-full ${violations===0?'bg-sage':violations===1?'bg-gold':'bg-rose'}`}></div>
            <span className="text-ink-500 font-medium"><span className="font-bold text-ink-900">{violations}</span>/3</span>
          </div>
          <div className="relative">
            <video ref={videoRef} autoPlay muted playsInline className={`rounded-lg object-cover w-14 h-10 border-2 ${camOn?'border-sage bg-black':'border-ink-300 bg-ink-100'}`}/>
            <div className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full ${camOn?'bg-sage':'bg-rose'}`}/>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-16 pb-24 min-h-screen flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-3xl">
          <div className="mb-4 bg-white border border-ink-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Tahap Aktif</p>
                <p className="text-sm font-semibold text-ink-900">{cat.stage}</p>
              </div>
            </div>
            <span className="text-xs bg-gold/10 text-gold-dark px-2.5 py-1 rounded-full font-semibold">{cat.range}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-hidden mb-5">
            <div className="px-6 pt-6 pb-5 border-b border-ink-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold bg-gold/10 text-gold-dark px-3 py-1 rounded-full">{cat.label}</span>
                <span className="text-xs text-ink-400 font-medium">Soal {idx+1} dari {questions.length}</span>
              </div>
              <p className="font-display text-ink-900 text-lg font-semibold leading-relaxed">{q.question}</p>
            </div>

            <div className="px-6 py-5 space-y-3">
              {opts.map((opt, i) => {
                const sel = answers[idx] === i;
                return (
                  <button key={i} onClick={() => setAnswers(p => ({...p,[idx]:i}))}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left text-sm transition border-2 ${
                      sel ? 'border-gold bg-gold/5 text-ink-900 font-medium' : 'border-ink-100 bg-white hover:border-gold/50 hover:bg-gold/5 text-ink-600'
                    }`}>
                    <span className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 relative flex items-center justify-center transition ${sel?'border-gold bg-gold':'border-ink-300'}`}>
                      {sel && <span className="block w-[7px] h-[7px] rounded-full bg-white"/>}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-ink-50 border-t border-ink-100 flex items-center justify-between">
              <button onClick={() => setIdx(p => Math.max(0,p-1))} disabled={idx===0}
                className="flex items-center gap-2 text-ink-500 hover:text-ink-900 text-sm font-medium transition disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                Sebelumnya
              </button>
              <span className="sm:hidden text-xs text-ink-400">{idx+1}/{questions.length}</span>
              {idx === questions.length-1 ? (
                <button onClick={() => setShowSub(true)} className="flex items-center gap-2 bg-gold hover:bg-gold-light text-ink-900 font-semibold px-5 py-2 rounded-xl text-sm transition">
                  Kumpulkan Jawaban
                </button>
              ) : (
                <button onClick={() => setIdx(p => Math.min(questions.length-1,p+1))} className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition">
                  Selanjutnya
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Question navigator */}
          <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Navigasi Soal</p>
            <div className="space-y-4">
              {stages.map((stage, si) => (
                <div key={si} className={si>0?'border-t border-ink-50 pt-4':''}>
                  <p className="text-xs font-medium text-ink-400 mb-2">{stage.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {questions.slice(stage.range[0], stage.range[1]).map((_, ai) => {
                      const ri = stage.range[0] + ai;
                      const cur = ri === idx, ans = answers[ri] !== undefined;
                      return (
                        <button key={ri} onClick={() => setIdx(ri)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${cur?'bg-gold text-ink-900':ans?'bg-ink-700 text-white':'bg-ink-100 text-ink-500 hover:bg-ink-200'}`}>
                          {ri+1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-ink-100 shadow-xl py-3.5 px-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-400 font-medium uppercase tracking-wider">Status Jawaban</p>
          <p className="text-sm font-semibold text-ink-900">Terjawab: <span className="text-gold font-bold">{answered}</span>/{questions.length} soal</p>
        </div>
        <button onClick={() => setShowSub(true)} className="bg-gold hover:bg-gold-light text-ink-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-sm">
          Kumpulkan Jawaban
        </button>
      </div>

      {/* Warning Modal */}
      {showWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full mx-4 text-center shadow-2xl border border-ink-100">
            <div className="w-12 h-12 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.062 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            </div>
            <h3 className="font-display font-bold text-ink-900 text-lg mb-2">Peringatan {violations}/3</h3>
            <p className="text-ink-400 text-sm mb-5 leading-relaxed">{warnMsg}</p>
            <p className="text-xs text-rose font-semibold mb-5">Sisa toleransi: {3-violations}x lagi</p>
            <button onClick={closeWarn} className="w-full bg-ink-900 hover:bg-ink-700 text-white py-2.5 rounded-xl text-sm font-semibold transition">Kembali ke Tes</button>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full mx-4 text-center shadow-2xl border border-ink-100">
            <h3 className="font-display font-bold text-ink-900 text-xl mb-2">Kumpulkan Jawaban?</h3>
            <p className="text-ink-400 text-sm mb-2">Sudah terjawab: <span className="font-bold text-ink-900">{answered}</span>/{questions.length} soal.</p>
            <p className="text-ink-300 text-xs bg-ink-50 border border-ink-100 rounded-xl p-3 mb-6 leading-relaxed">Jawaban yang sudah dikumpulkan bersifat final dan tidak dapat diubah kembali.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSub(false)} className="flex-1 border border-ink-200 text-ink-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-ink-50 transition">Kembali</button>
              <button onClick={() => doSubmit(false)} disabled={submitting} className="flex-1 bg-gold hover:bg-gold-light text-ink-900 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                {submitting ? 'Mengirim...' : 'Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
