'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Generate random single-digit numbers for each row
function generateRows(numRows, numDigits) {
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const digits = [];
    for (let d = 0; d < numDigits; d++) {
      digits.push(Math.floor(Math.random() * 9) + 1); // 1-9
    }
    rows.push(digits);
  }
  return rows;
}

const TOTAL_ROWS = 50;
const DIGITS_PER_ROW = 30;
const TIME_PER_ROW = 15; // seconds per row
const TOTAL_TIME = 900; // 15 minutes

export default function KraepelinExam({ session }) {
  const router = useRouter();
  const [rows] = useState(() => generateRows(TOTAL_ROWS, DIGITS_PER_ROW));
  const [currentRow, setCurrentRow] = useState(0);
  const [answers, setAnswers] = useState({}); // { rowIdx: { pairIdx: digit } }
  const [rowTimers, setRowTimers] = useState({}); // { rowIdx: ms_elapsed }
  const [rowStartTime, setRowStartTime] = useState(Date.now());
  const [rowTimeLeft, setRowTimeLeft] = useState(TIME_PER_ROW);
  const [totalTimeLeft, setTotalTimeLeft] = useState(TOTAL_TIME);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRefs = useRef([]);
  const [currentInput, setCurrentInput] = useState(0);

  // Timer for total test
  useEffect(() => {
    if (session.started_at) {
      const elapsed = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
      setTotalTimeLeft(Math.max(0, TOTAL_TIME - elapsed));
    }
  }, []);

  useEffect(() => {
    if (done || submitting) return;
    const t = setInterval(() => {
      setTotalTimeLeft(p => {
        if (p <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return p - 1;
      });
      setRowTimeLeft(p => {
        if (p <= 1) { nextRow(); return TIME_PER_ROW; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, submitting, currentRow]);

  const nextRow = useCallback(() => {
    const elapsed = Date.now() - rowStartTime;
    setRowTimers(p => ({ ...p, [currentRow]: elapsed }));
    if (currentRow >= TOTAL_ROWS - 1) {
      handleSubmit();
      return;
    }
    setCurrentRow(p => p + 1);
    setRowTimeLeft(TIME_PER_ROW);
    setRowStartTime(Date.now());
    setCurrentInput(0);
  }, [currentRow, rowStartTime]);

  const handleInput = (pairIdx, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    setAnswers(p => ({
      ...p,
      [currentRow]: { ...(p[currentRow] || {}), [pairIdx]: value },
    }));

    // Auto-advance to next input
    if (value && pairIdx < DIGITS_PER_ROW - 2) {
      setTimeout(() => {
        const nextRef = inputRefs.current[pairIdx + 1];
        if (nextRef) nextRef.focus();
        setCurrentInput(pairIdx + 1);
      }, 50);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setDone(true);

    // Calculate scores per row
    const rowResults = [];
    for (let r = 0; r <= currentRow; r++) {
      const rowDigits = rows[r];
      const rowAns = answers[r] || {};
      let correct = 0;
      let total = 0;
      for (let p = 0; p < DIGITS_PER_ROW - 1; p++) {
        const expectedSum = rowDigits[p] + rowDigits[p + 1];
        const expectedDigit = expectedSum % 10;
        if (rowAns[p] !== undefined && rowAns[p] !== '') {
          total++;
          if (parseInt(rowAns[p]) === expectedDigit) correct++;
        }
      }
      rowResults.push({
        row_number: r + 1,
        answers: rowAns,
        correct_count: correct,
        total_count: total,
        time_ms: rowTimers[r] || (r === currentRow ? Date.now() - rowStartTime : TIME_PER_ROW * 1000),
      });
    }

    try {
      const res = await fetch('/api/test/submit-kraepelin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, rowResults }),
      });
      if (res.ok) router.push('/candidate/dashboard');
      else { alert('Gagal mengirim hasil.'); setSubmitting(false); setDone(false); }
    } catch { alert('Error jaringan.'); setSubmitting(false); setDone(false); }
  };

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const currentDigits = rows[currentRow] || [];
  const answeredInRow = Object.values(answers[currentRow] || {}).filter(v => v !== '').length;

  if (done && submitting) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-sm border border-ink-100">
          <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gold animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Mengirim Hasil...</h3>
          <p className="text-ink-400 text-sm">Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-ink-100 px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <div><p className="font-semibold text-ink-900 text-sm">Tes Kraepelin</p><p className="text-ink-400 text-xs">Baris {currentRow + 1}/{TOTAL_ROWS}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-gold/10 text-gold-dark px-3 py-1.5 rounded-xl font-semibold">
            Baris: {fmtTime(rowTimeLeft)}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${totalTimeLeft <= 120 ? 'bg-rose/5 border-rose/20 text-rose' : 'bg-ink-50 border-ink-200 text-ink-700'}`}>
            <span className="font-mono">{fmtTime(totalTimeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-4 h-2 bg-ink-100 rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full progress-bar" style={{ width: `${((currentRow + 1) / TOTAL_ROWS) * 100}%` }}></div>
        </div>

        {/* Current row */}
        <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink-900">Baris {currentRow + 1}</h2>
            <span className="text-xs text-ink-400">Terjawab: {answeredInRow}/{DIGITS_PER_ROW - 1}</span>
          </div>

          <p className="text-xs text-ink-400 mb-4">Jumlahkan dua angka bersebelahan, masukkan <strong>digit satuan</strong> hasilnya:</p>

          {/* Vertical number pairs display */}
          <div className="flex flex-wrap gap-2 justify-center">
            {currentDigits.slice(0, -1).map((digit, i) => {
              const nextDigit = currentDigits[i + 1];
              const ans = answers[currentRow]?.[i] || '';
              const expectedSum = digit + nextDigit;
              const expectedDigit = expectedSum % 10;
              const isAnswered = ans !== '';
              const isCorrect = isAnswered && parseInt(ans) === expectedDigit;

              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 bg-ink-100 rounded-lg flex items-center justify-center font-bold text-ink-900 text-sm">{digit}</div>
                  <div className="w-8 h-8 bg-ink-100 rounded-lg flex items-center justify-center font-bold text-ink-900 text-sm">{nextDigit}</div>
                  <input
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={ans}
                    onChange={e => handleInput(i, e.target.value)}
                    className={`w-8 h-8 text-center border-2 rounded-lg text-sm font-bold focus:outline-none transition ${
                      isAnswered ? (isCorrect ? 'border-sage bg-sage/5 text-sage' : 'border-rose bg-rose/5 text-rose') : 'border-gold bg-gold/5 text-ink-900 focus:border-gold'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Row history mini */}
        <div className="mt-4 bg-white border border-ink-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-ink-400 uppercase mb-3">Progress Baris</p>
          <div className="flex flex-wrap gap-1">
            {rows.slice(0, currentRow + 1).map((_, i) => {
              const rowAns = answers[i] || {};
              const filled = Object.values(rowAns).filter(v => v !== '').length;
              const pct = filled / (DIGITS_PER_ROW - 1);
              return (
                <div key={i}
                  className={`w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center ${
                    i === currentRow ? 'bg-gold text-ink-900' : pct > 0.7 ? 'bg-sage/30 text-sage' : pct > 0 ? 'bg-gold/30 text-gold-dark' : 'bg-ink-100 text-ink-300'
                  }`}>
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-ink-100 shadow-xl py-3.5 px-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-400">Baris {currentRow + 1} dari {TOTAL_ROWS}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={nextRow} className="bg-ink-900 hover:bg-ink-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
            Baris Selanjutnya →
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="bg-gold hover:bg-gold-light text-ink-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-60">
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
