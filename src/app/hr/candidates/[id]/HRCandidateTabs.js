'use client';
import { useState } from 'react';

function fmtDur(s) { if (!s) return '0 menit'; const m=Math.floor(s/60),sc=s%60; return sc>0?`${m}m ${sc}d`:`${m} menit`; }

export default function HRCandidateTabs({ sessions, details, graphicSubmissions, kraepelinResults }) {
  const [activeTab, setActiveTab] = useState('cognitive');

  const tabs = [
    { id: 'cognitive', label: 'Kognitif (IQ)' },
    { id: 'personality', label: 'Kepribadian' },
    { id: 'graphic', label: 'Grafis (Proyektif)' },
    { id: 'kraepelin', label: 'Kraepelin' },
  ];

  return (
    <div className="bg-white border border-ink-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex overflow-x-auto border-b border-ink-100 bg-ink-50 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-3.5 text-sm font-semibold transition border-b-2 ${
              activeTab === tab.id 
                ? 'border-ink-900 text-ink-900 bg-white' 
                : 'border-transparent text-ink-500 hover:text-ink-700 hover:bg-ink-100/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 overflow-y-auto">
        {/* Kognitif Tab */}
        {activeTab === 'cognitive' && (
          <div>
            {!sessions.cognitive ? (
              <p className="text-ink-400 text-sm text-center py-8">Kandidat belum memulai tes kognitif.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-ink-50 rounded-xl p-4 border border-ink-100">
                  <div>
                    <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold">Status Ujian</p>
                    <p className="font-semibold text-ink-900 mt-1">
                      {sessions.cognitive.status === 'completed' ? 'Selesai' : sessions.cognitive.status === 'in_progress' ? 'Sedang Berlangsung' : 'Diskualifikasi'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold">Durasi</p>
                    <p className="font-semibold text-ink-900 mt-1">{fmtDur(sessions.cognitive.duration_seconds)}</p>
                  </div>
                </div>

                {details.cognitive?.logika && (
                  <div>
                    <h3 className="font-display font-bold text-ink-900 mb-4">Breakdown Kognitif</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[['Verbal',details.cognitive.verbal],['Logika',details.cognitive.logika],['Spasial',details.cognitive.spasial]].map(([l,d]) => (
                        <div key={l} className="bg-white border border-ink-100 rounded-xl p-4 text-center shadow-sm">
                          <p className="text-xs font-semibold text-ink-400 uppercase mb-2">{l}</p>
                          <p className="font-display font-black text-2xl text-ink-900">{d?.correct??0}<span className="text-ink-400 text-xs font-normal">/{d?.total??25}</span></p>
                          <div className="mt-2 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full" style={{width:`${d?.score??0}%`}}></div>
                          </div>
                          <span className="text-[10px] text-ink-500 font-medium mt-1 inline-block">{d?.score??0}% Akurasi</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Kepribadian Tab */}
        {activeTab === 'personality' && (
          <div>
            {!sessions.personality ? (
              <p className="text-ink-400 text-sm text-center py-8">Kandidat belum memulai tes kepribadian.</p>
            ) : (
              <div className="space-y-6">
                {details.personality?.mbti ? (
                  <>
                    <div className="bg-white border border-ink-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-ink-400 uppercase font-semibold tracking-wider">Tipe MBTI</p>
                        <p className="font-display font-bold text-2xl text-ink-900 mt-1">{details.personality.mbti.type}</p>
                      </div>
                      <div className="flex gap-2">
                        {Object.entries(details.personality.mbti.scores).map(([k, v]) => (
                          <div key={k} className="text-center px-2">
                            <p className="text-[10px] text-ink-400 font-bold">{k}</p>
                            <p className="text-xs font-semibold text-ink-900">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-ink-100 rounded-xl p-5 shadow-sm">
                      <h3 className="font-display font-bold text-ink-900 mb-4 text-sm">DISC Profile</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(details.personality.disc?.profile || {}).map(([k, v]) => {
                          const labels = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Compliance' };
                          const colors = { D: 'bg-rose', I: 'bg-gold', S: 'bg-sage', C: 'bg-ink-700' };
                          return (
                            <div key={k} className="flex flex-col items-center">
                              <div className="w-full bg-ink-50 rounded-t-lg relative h-24 flex items-end justify-center">
                                <div className={`w-8 ${colors[k]} rounded-t-sm`} style={{height:`${v}%`}}></div>
                              </div>
                              <p className="text-[10px] font-bold text-ink-900 mt-2">{k}</p>
                              <p className="text-[9px] text-ink-500 uppercase">{labels[k]}</p>
                              <p className="text-xs font-semibold mt-1">{v}%</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-ink-400 text-sm">Hasil kepribadian sedang diproses.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Grafis Tab */}
        {activeTab === 'graphic' && (
          <div>
            {!sessions.graphic ? (
              <p className="text-ink-400 text-sm text-center py-8">Kandidat belum memulai tes grafis.</p>
            ) : graphicSubmissions.length === 0 ? (
              <p className="text-ink-400 text-sm text-center py-8">Tidak ada gambar yang disubmit.</p>
            ) : (
              <div className="space-y-8">
                {/* DAM & BAUM */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {graphicSubmissions.filter(s => ['dam', 'baum'].includes(s.test_subtype)).map(sub => (
                    <div key={sub.id} className="border border-ink-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-ink-50 px-4 py-2 border-b border-ink-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-ink-900 uppercase">{sub.test_subtype === 'dam' ? 'Tes Orang (DAM)' : 'Tes Pohon (BAUM)'}</span>
                      </div>
                      <div className="p-2 bg-white flex justify-center">
                        <img src={sub.image_data} alt={sub.test_subtype} className="max-w-full max-h-[300px] object-contain border border-ink-100" />
                      </div>
                      {sub.test_subtype === 'dam' && sub.metadata && (
                        <div className="p-3 bg-ink-50 border-t border-ink-100 text-xs text-ink-700 grid grid-cols-3 gap-2">
                          <div><span className="block text-[10px] text-ink-400 uppercase">Usia</span><span className="font-semibold">{sub.metadata.age||'-'}</span></div>
                          <div><span className="block text-[10px] text-ink-400 uppercase">Gender</span><span className="font-semibold">{sub.metadata.gender||'-'}</span></div>
                          <div><span className="block text-[10px] text-ink-400 uppercase">Aktivitas</span><span className="font-semibold">{sub.metadata.activity||'-'}</span></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Wartegg */}
                <div>
                  <h3 className="font-display font-bold text-ink-900 mb-3 text-sm">Tes Wartegg (8 Kotak)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {graphicSubmissions.filter(s => s.test_subtype === 'wartegg')
                      .sort((a,b) => (a.metadata.box || 0) - (b.metadata.box || 0))
                      .map(sub => (
                      <div key={sub.id} className="border border-ink-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="bg-ink-50 px-2 py-1.5 border-b border-ink-200 text-center">
                          <span className="text-[10px] font-bold text-ink-900">Kotak {sub.metadata.box}</span>
                        </div>
                        <img src={sub.image_data} alt={`Wartegg ${sub.metadata.box}`} className="w-full aspect-square object-contain border-b border-ink-50" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kraepelin Tab */}
        {activeTab === 'kraepelin' && (
          <div>
            {!sessions.kraepelin ? (
              <p className="text-ink-400 text-sm text-center py-8">Kandidat belum memulai tes Kraepelin.</p>
            ) : kraepelinResults.length === 0 ? (
              <p className="text-ink-400 text-sm text-center py-8">Tidak ada hasil baris.</p>
            ) : (
              <div className="space-y-6">
                {/* Summary metrics */}
                {details.kraepelin && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      ['Total Benar', details.kraepelin.total_correct],
                      ['Akurasi', `${details.kraepelin.accuracy}%`],
                      ['Stabilitas (StdDev)', details.kraepelin.consistency_stddev],
                      ['Daya Tahan', `${details.kraepelin.endurance_ratio}%`]
                    ].map(([l, v]) => (
                      <div key={l} className="bg-white border border-ink-100 rounded-xl p-4 text-center shadow-sm">
                        <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1">{l}</p>
                        <p className="font-display font-bold text-xl text-ink-900">{v}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chart of rows */}
                <div className="bg-white border border-ink-100 rounded-xl p-5 shadow-sm">
                  <h3 className="font-display font-bold text-ink-900 mb-4 text-sm">Grafik Kecepatan & Ketelitian (Per Baris)</h3>
                  <div className="flex items-end gap-1 h-40 border-b border-l border-ink-200 pb-2 pl-2">
                    {kraepelinResults.map((r, i) => {
                      const pct = Math.round((r.correct_count / 29) * 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 bg-ink-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 transition">
                            Baris {r.row_number}: {r.correct_count} benar
                          </div>
                          <div className="w-full bg-ink-700 hover:bg-gold transition rounded-t-sm" style={{ height: `${pct}%`, minHeight:'2px' }}></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-ink-400 font-semibold mt-1 px-2">
                    <span>Baris 1</span>
                    <span>Baris {kraepelinResults.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
