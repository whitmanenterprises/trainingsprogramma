'use client';

import { useState, useEffect, useCallback } from 'react';
import { sessions } from './data';
import { DayRecord, Exercise } from './types';

// ─── Storage helpers ───
const STORAGE_KEY = 'trainingsprogramma-records';

function loadRecords(): DayRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveRecord(record: DayRecord) {
  const records = loadRecords();
  // Update existing or add new
  const idx = records.findIndex(r => r.date === record.date && r.sessionId === record.sessionId);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getCurrentWeekSession(): 'a' | 'b' | 'c' {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const cycle = weekNum % 3;
  const today = new Date().getDay(); // 0=Sun, 6=Sat
  const sessionOrder: ('a' | 'b' | 'c')[][] = [
    ['a', 'b', 'c'],  // Week 0
    ['b', 'c', 'a'],  // Week 1
    ['c', 'a', 'b'],  // Week 2
  ];
  // Map day of week to session index
  const dayOrder: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 0, 5: 1, 6: 2, 0: 2 }; // Mon=0, Sat=2, Sun=2
  const idx = dayOrder[today] || 0;
  return sessionOrder[cycle][idx];
}

// ─── SVG Muscle Figures ───
function MuscleFigure({ sessionId, activeIndex }: { sessionId: 'a' | 'b' | 'c'; activeIndex: number }) {
  const green = sessionId === 'a' ? '#22c55e' : sessionId === 'b' ? '#3b82f6' : '#eab308';
  const green30 = sessionId === 'a' ? 'rgba(34,197,94,0.3)' : sessionId === 'b' ? 'rgba(59,130,246,0.3)' : 'rgba(234,179,8,0.3)';
  const green50 = sessionId === 'a' ? 'rgba(34,197,94,0.55)' : sessionId === 'b' ? 'rgba(59,130,246,0.55)' : 'rgba(234,179,8,0.55)';

  return (
    <svg viewBox="0 0 200 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Body base — front view silhouette */}
      <g fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="1.5">
        {/* Head */}
        <ellipse cx="100" cy="38" rx="22" ry="28" />
        {/* Neck */}
        <rect x="92" y="65" width="16" height="10" rx="4" />
        {/* Torso */}
        <path d="M70 78 Q60 85 55 100 L50 140 Q48 165 52 180 Q58 195 70 200 L130 200 Q142 195 148 180 Q152 165 150 140 L145 100 Q140 85 130 78 Z" />
        {/* Left arm */}
        <path d="M55 85 Q38 100 32 135 Q28 165 30 195 Q32 210 38 218 L50 212 Q46 195 44 170 Q42 140 53 100" />
        {/* Right arm */}
        <path d="M145 85 Q162 100 168 135 Q172 165 170 195 Q168 210 162 218 L150 212 Q154 195 156 170 Q158 140 147 100" />
        {/* Left leg */}
        <path d="M68 200 L62 260 Q58 300 60 350 Q62 375 70 390 L88 390 Q86 365 83 340 Q80 300 83 260 L88 200 Z" />
        {/* Right leg */}
        <path d="M132 200 L138 260 Q142 300 140 350 Q138 375 130 390 L112 390 Q114 365 117 340 Q120 300 117 260 L112 200 Z" />
      </g>

      {/* ─── SESSION A: Knee/Lower Body ─── */}
      {sessionId === 'a' && (
        <g>
          {/* Completed muscles based on activeIndex */}
          {/* Quads */}
          {activeIndex >= 1 && (
            <path d="M70 220 L65 260 Q63 295 65 340 L80 340 Q78 310 80 270 Q82 245 82 220 Z"
                  fill={green50} stroke={green} strokeWidth="1.5" />
          )}
          {activeIndex >= 1 && (
            <path d="M130 220 L135 260 Q137 295 135 340 L120 340 Q122 310 120 270 Q118 245 118 220 Z"
                  fill={activeIndex >= 6 ? green50 : green30} stroke={activeIndex >= 6 ? green : green} strokeWidth="1.5" />
          )}
          {/* Glutes */}
          {activeIndex >= 6 && (
            <ellipse cx="100" cy="195" rx="35" ry="12" fill={green50} stroke={green} strokeWidth="1.5" />
          )}
          {/* Hip abductors */}
          {activeIndex >= 3 && (
            <g>
              <ellipse cx="58" cy="210" rx="8" ry="12" fill={green30} stroke={green} strokeWidth="1.2" />
              <ellipse cx="142" cy="210" rx="8" ry="12" fill={green30} stroke={green} strokeWidth="1.2" />
            </g>
          )}
          {/* Calves */}
          {activeIndex >= 5 && (
            <g>
              <path d="M62 345 Q58 370 65 388 L75 385 Q72 365 73 345 Z" fill={activeIndex >= 6 ? green50 : green30} stroke={green} strokeWidth="1" />
              <path d="M138 345 Q142 370 135 388 L125 385 Q128 365 127 345 Z" fill={activeIndex >= 6 ? green50 : green30} stroke={green} strokeWidth="1" />
            </g>
          )}
        </g>
      )}

      {/* ─── SESSION B: Posture/Upper Body ─── */}
      {sessionId === 'b' && (
        <g>
          {/* Neck */}
          {activeIndex >= 0 && (
            <rect x="92" y="62" width="16" height="14" rx="6" fill={green30} stroke={green} strokeWidth="1.2" />
          )}
          {/* Upper back / between shoulder blades */}
          {activeIndex >= 1 && (
            <rect x="75" y="78" width="50" height="18" rx="6" fill={green50} stroke={green} strokeWidth="1.5" />
          )}
          {/* Chest */}
          {activeIndex >= 5 && (
            <ellipse cx="100" cy="95" rx="30" ry="12" fill={green30} stroke={green} strokeWidth="1.2" />
          )}
          {/* Shoulders */}
          {activeIndex >= 0 && (
            <g>
              <ellipse cx="65" cy="82" rx="12" ry="8" fill={activeIndex >= 4 ? green50 : green30} stroke={green} strokeWidth="1.2" />
              <ellipse cx="135" cy="82" rx="12" ry="8" fill={activeIndex >= 4 ? green50 : green30} stroke={green} strokeWidth="1.2" />
            </g>
          )}
          {/* Thoracic spine */}
          {activeIndex >= 2 && (
            <line x1="100" y1="96" x2="100" y2="155" stroke={green} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          )}
          {/* Upper arms */}
          {activeIndex >= 0 && (
            <g>
              <path d="M48 100 Q42 115 40 135 Q38 150 42 160" fill="none" stroke={green} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              <path d="M152 100 Q158 115 160 135 Q162 150 158 160" fill="none" stroke={green} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>
      )}

      {/* ─── SESSION C: Mobility/Balance ─── */}
      {sessionId === 'c' && (
        <g>
          {/* Hip joints */}
          {activeIndex >= 0 && (
            <g>
              <circle cx="72" cy="205" r="10" fill={green30} stroke={green} strokeWidth="1.5" />
              <circle cx="128" cy="205" r="10" fill={green30} stroke={green} strokeWidth="1.5" />
            </g>
          )}
          {/* Full legs for squat/ankle */}
          {activeIndex >= 1 && (
            <g>
              <path d="M70 210 L67 250 Q65 290 68 350" fill="none" stroke={green} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              <path d="M130 210 L133 250 Q135 290 132 350" fill="none" stroke={green} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            </g>
          )}
          {/* Ankles */}
          {activeIndex >= 3 && (
            <g>
              <circle cx="65" cy="348" r="8" fill={green30} stroke={green} strokeWidth="1.5" />
              <circle cx="135" cy="348" r="8" fill={green30} stroke={green} strokeWidth="1.5" />
            </g>
          )}
          {/* Spine for full body awareness */}
          {activeIndex >= 6 && (
            <line x1="100" y1="72" x2="100" y2="198" stroke={green} strokeWidth="2" strokeLinecap="round" opacity="0.4" strokeDasharray="4,3" />
          )}
        </g>
      )}
    </svg>
  );
}

// ─── Main App ───
export default function HomePage() {
  const [view, setView] = useState<'home' | 'session' | 'exercise' | 'history'>('home');
  const [activeSession, setActiveSession] = useState<'a' | 'b' | 'c'>('a');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [notes, setNotes] = useState('');
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  useEffect(() => {
    setRecords(loadRecords());
    const today = new Date().toISOString().slice(0, 10);
    const session = getCurrentWeekSession();
    const todayRecord = loadRecords().find(r => r.date === today && r.sessionId === session);
    if (todayRecord) {
      setCompleted(new Set(Array.from({ length: todayRecord.completed }, (_, i) => `done-${i}`)));
      setNotes(todayRecord.notes || '');
    }
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentSession = sessions.find(s => s.id === activeSession)!;

  // ─── HOME ───
  if (view === 'home') {
    const recommendedSession = sessions.find(s => s.id === getCurrentWeekSession())!;
    const streak = records.filter(r => {
      const d = new Date(r.date);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000*60*60*24));
      return diff <= 14 && r.completed / r.total >= 0.7;
    }).length;

    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-lg mx-auto px-5 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">Bewegen</h1>
            <p className="text-stone-500 mt-1 text-sm">Knie · Mobiliteit · Houding</p>
          </div>

          {/* Session cards */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Vandaag</h2>

            <button
              onClick={() => {
                setActiveSession(recommendedSession.id);
                setExerciseIndex(0);
                setView('session');
              }}
              className="w-full bg-white rounded-2xl p-6 border border-stone-200 text-left hover:shadow-lg transition-shadow"
              style={{ borderLeftWidth: '4px', borderLeftColor: recommendedSession.colorHex }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-extrabold" style={{ color: recommendedSession.colorHex }}>
                  {recommendedSession.id.toUpperCase()}
                </span>
                <div>
                  <div className="font-semibold text-stone-900">{recommendedSession.name}</div>
                  <div className="text-xs text-stone-400">{recommendedSession.exercises.length} oefeningen · {recommendedSession.focus}</div>
                </div>
                <span className="ml-auto text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">Aanbevolen</span>
              </div>
            </button>

            {sessions.filter(s => s.id !== recommendedSession.id).map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSession(s.id); setExerciseIndex(0); setView('session'); }}
                className="w-full bg-white rounded-2xl p-5 border border-stone-100 text-left hover:shadow-lg transition-opacity opacity-70 hover:opacity-100"
                style={{ borderLeftWidth: '4px', borderLeftColor: s.colorHex }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold" style={{ color: s.colorHex }}>{s.id.toUpperCase()}</span>
                  <div>
                    <div className="font-medium text-stone-800">{s.name}</div>
                    <div className="text-xs text-stone-400">{s.exercises.length} oefeningen</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* History button */}
          <button
            onClick={() => setView('history')}
            className="w-full bg-white rounded-xl p-4 border border-stone-100 text-left text-stone-600 text-sm hover:bg-stone-50"
          >
            📊 Geschiedenis bekijken — {records.length} sessies geregistreerd
          </button>

          {/* Streak */}
          {streak > 0 && (
            <div className="mt-4 text-center text-sm text-stone-400">
              {streak} van de laatste 14 dagen getraind
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-stone-200 py-3">
          <div className="max-w-lg mx-auto flex justify-around text-xs text-stone-400">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 text-stone-800 font-medium">
              <span className="text-lg">💪</span>Home
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-1">
              <span className="text-lg">📊</span>Geschiedenis
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SESSION VIEW ───
  if (view === 'session') {
    const session = sessions.find(s => s.id === activeSession)!;
    const totalDone = [...completed].filter(c => c.startsWith('done-')).length;
    const progress = totalDone / session.exercises.length;

    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-lg mx-auto px-5 py-6">
          {/* Header */}
          <button onClick={() => setView('home')} className="text-sm text-stone-400 mb-4">← Terug</button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold" style={{ color: session.colorHex }}>{session.id.toUpperCase()}</span>
            <div>
              <h1 className="text-xl font-bold text-stone-900">{session.name}</h1>
              <p className="text-xs text-stone-400">{session.focus}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>{totalDone} van {session.exercises.length} klaar</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%`, backgroundColor: session.colorHex }}
              />
            </div>
          </div>

          {/* Body + exercises */}
          <div className="space-y-3">
            {/* Body figure */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex justify-center">
              <MuscleFigure sessionId={session.id} activeIndex={totalDone} />
            </div>

            {/* Exercises */}
            {session.exercises.map((ex: Exercise, i: number) => (
              <div key={ex.id} className={`bg-white rounded-xl border transition-all ${expandedExercise === i ? 'border-l-4 shadow-md' : 'border-stone-200'}`}
                   style={expandedExercise === i ? { borderLeftColor: session.colorHex } : {}}>
                <button
                  onClick={() => setExpandedExercise(expandedExercise === i ? null : i)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${completed.has(`done-${i}`) ? 'text-white' : 'bg-stone-100 text-stone-400'}`}
                      style={completed.has(`done-${i}`) ? { backgroundColor: session.colorHex } : {}}>
                      {completed.has(`done-${i}`) ? '✓' : i + 1}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium ${completed.has(`done-${i}`) ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {ex.name}
                      </div>
                      <div className="text-xs text-stone-400">{ex.sets} sets · {ex.reps || ex.duration || ''} · {ex.muscles}</div>
                    </div>
                    <span className="text-stone-300 text-lg">{expandedExercise === i ? '▾' : '▸'}</span>
                  </div>
                </button>

                {expandedExercise === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
                    <p className="text-sm text-stone-600 leading-relaxed">{ex.description}</p>

                    <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                      <strong className="block text-xs uppercase tracking-wide mb-1">💡 Tip</strong>
                      {ex.tip}
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                      <strong className="block text-xs uppercase tracking-wide mb-1">⚠️ Let op</strong>
                      {ex.commonMistake}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>🏋️ {ex.equipment}</span>
                      {ex.source && <span className="text-stone-300">{ex.source}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Complete button */}
            <button
              onClick={() => {
                const record: DayRecord = {
                  date: todayStr,
                  sessionId: session.id,
                  completed: totalDone,
                  total: session.exercises.length,
                  notes: notes || undefined,
                };
                saveRecord(record);
                setRecords(loadRecords());
                setView('home');
              }}
              className="w-full py-4 rounded-xl text-white font-semibold text-base mt-4 mb-4"
              style={{ backgroundColor: session.colorHex }}
            >
              Sessie Afronden ({totalDone}/{session.exercises.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── HISTORY VIEW ───
  if (view === 'history') {
    const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-lg mx-auto px-5 py-8">
          <button onClick={() => setView('home')} className="text-sm text-stone-400 mb-4">← Terug</button>
          <h1 className="text-xl font-bold text-stone-900 mb-6">Geschiedenis</h1>

          {records.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              Nog geen sessies geregistreerd.
            </div>
          ) : (
            <div className="space-y-3">
              {records.sort((a, b) => b.date.localeCompare(a.date)).map((r, i) => {
                const session = sessions.find(s => s.id === r.sessionId)!;
                const d = new Date(r.date);
                return (
                  <div key={i} className="bg-white rounded-xl p-4 border border-stone-200"
                       style={{ borderLeftWidth: '3px', borderLeftColor: session.colorHex }}>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-medium text-stone-800">
                          {weekDays[d.getDay()]} {d.getDate()} {d.toLocaleDateString('nl', { month: 'short' })}
                        </div>
                        <div className="text-xs text-stone-400">{session.name}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-lg font-bold" style={{ color: session.colorHex }}>
                          {r.completed}/{r.total}
                        </div>
                        <div className="text-xs text-stone-400">{Math.round(r.completed / r.total * 100)}%</div>
                      </div>
                    </div>
                    {r.notes && <div className="mt-2 text-xs text-stone-400 italic">{r.notes}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Heatmap-like summary */}
          <div className="mt-8">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Sessies per Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {sessions.map(s => {
                const count = records.filter(r => r.sessionId === s.id).length;
                return (
                  <div key={s.id} className="bg-white rounded-xl p-4 border border-stone-200 text-center"
                       style={{ borderTopWidth: '3px', borderTopColor: s.colorHex }}>
                    <div className="text-2xl font-bold text-stone-900">{count}</div>
                    <div className="text-xs text-stone-400">{s.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-24" />
        </div>

        {/* Bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-stone-200 py-3">
          <div className="max-w-lg mx-auto flex justify-around text-xs text-stone-400">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1">
              <span className="text-lg">💪</span>Home
            </button>
            <button className="flex flex-col items-center gap-1 text-stone-800 font-medium">
              <span className="text-lg">📊</span>Geschiedenis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
