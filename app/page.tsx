'use client';

import { useEffect, useState } from 'react';
import { sessions } from './data';
import { AnatomicalFigure } from './anatomical-figure';
import { DayRecord, Exercise, Session } from './types';

const STORAGE_KEY = 'trainingsprogramma-records';

function loadRecords(): DayRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecord(record: DayRecord) {
  const records = loadRecords();
  const idx = records.findIndex((r) => r.date === record.date && r.sessionId === record.sessionId);

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
  const today = new Date().getDay();
  const sessionOrder: ('a' | 'b' | 'c')[][] = [
    ['a', 'b', 'c'],
    ['b', 'c', 'a'],
    ['c', 'a', 'b'],
  ];
  const dayOrder: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 0, 5: 1, 6: 2, 0: 2 };
  const idx = dayOrder[today] || 0;
  return sessionOrder[cycle][idx];
}

function getInitialRoute(): { view: 'home' | 'session' | 'history'; session: 'a' | 'b' | 'c' } {
  if (typeof window === 'undefined') {
    return { view: 'home' as const, session: 'a' as const };
  }

  const params = new URLSearchParams(window.location.search);
  const sessionParam = params.get('session');
  const session = sessionParam === 'a' || sessionParam === 'b' || sessionParam === 'c' ? sessionParam : 'a';
  const viewParam = params.get('view');
  const view = viewParam === 'session' || viewParam === 'history' ? viewParam : 'home';

  return { view, session };
}

function parseDurationToSeconds(duration?: string) {
  if (!duration) return 0;
  const match = duration.match(/(\d+)\s*sec/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}`;
}

function getExerciseMeta(exercise: Exercise) {
  return [exercise.sets ? `${exercise.sets} sets` : null, exercise.reps, exercise.duration, exercise.muscles]
    .filter(Boolean)
    .join(' · ');
}

function getNextOpenExercise(session: Session, completed: Set<number>) {
  return session.exercises.findIndex((_, index) => !completed.has(index));
}

function TimerPanel({
  exercise,
  colorHex,
  isRunning,
  secondsLeft,
  totalSeconds,
  done,
  onStart,
  onStop,
  onReset,
  onFocus,
}: {
  exercise: Exercise | null;
  colorHex: string;
  isRunning: boolean;
  secondsLeft: number;
  totalSeconds: number;
  done: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onFocus: () => void;
}) {
  if (!exercise || !exercise.duration) {
    return (
      <div className="session-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Timer</p>
            <h2 className="mt-1 text-lg font-semibold text-stone-900">Kies een oefening met tijd</h2>
          </div>
          <div className="text-2xl">⏱</div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Kies rechts een oefening met tijd. Dan verschijnt hier direct de timer.
        </p>
      </div>
    );
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const dashOffset = circumference - progress * circumference;
  const label = done ? '✓' : formatSeconds(secondsLeft || totalSeconds);

  return (
    <div className="session-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Timer</p>
          <h2 className="mt-1 text-lg font-semibold text-stone-900">{exercise.name}</h2>
          <p className="mt-1 text-sm text-stone-500">{exercise.duration}</p>
        </div>
        <button
          onClick={onFocus}
          className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-200"
        >
          Naar oefening
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 rounded-[1.75rem] bg-stone-50 px-5 py-5 text-center">
        <div className="relative h-36 w-36">
          <svg className="timer-ring h-full w-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#e7e5e4" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={done ? '#16a34a' : colorHex}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={done ? 0 : dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tracking-tight text-stone-900">{label}</span>
            <span className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">
              {done ? 'klaar' : isRunning ? 'bezig' : 'gereed'}
            </span>
          </div>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-stone-500">
          {done
            ? 'Mooi. Deze timer is klaar — start opnieuw als je nog een ronde wilt doen.'
            : 'De timer is groter en sticky gemaakt, zodat hij op iPad steeds in beeld blijft.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {!isRunning && !done && (
            <button
              onClick={onStart}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: colorHex }}
            >
              Start {exercise.duration}
            </button>
          )}

          {isRunning && (
            <button
              onClick={onStop}
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Pauzeer
            </button>
          )}

          {(isRunning || secondsLeft > 0 || done) && (
            <button
              onClick={onReset}
              className="rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-200"
            >
              Reset
            </button>
          )}

          {!isRunning && !done && secondsLeft > 0 && (
            <button
              onClick={onStart}
              className="rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-200"
            >
              Hervat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const initialRoute = getInitialRoute();
  const [view, setView] = useState<'home' | 'session' | 'history'>(initialRoute.view);
  const [activeSession, setActiveSession] = useState<'a' | 'b' | 'c'>(initialRoute.session);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [notes, setNotes] = useState('');
  const [timerExerciseIndex, setTimerExerciseIndex] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDoneIndex, setTimerDoneIndex] = useState<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRecords(loadRecords());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const id = window.setInterval(() => {
      setTimerSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          setTimerRunning(false);
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          if (timerExerciseIndex !== null) {
            setTimerDoneIndex(timerExerciseIndex);
          }
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [timerRunning, timerExerciseIndex]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentSession = sessions.find((session) => session.id === activeSession) ?? sessions[0];
  const selectedExercise = currentSession.exercises[exerciseIndex] ?? currentSession.exercises[0];
  const totalDone = completed.size;
  const progress = totalDone / currentSession.exercises.length;
  const nextOpenIndex = getNextOpenExercise(currentSession, completed);
  const nextOpenExercise = nextOpenIndex >= 0 ? currentSession.exercises[nextOpenIndex] : null;

  const displayedTimerIndex = timerExerciseIndex ?? (selectedExercise?.duration ? exerciseIndex : null);

  const timerExercise = displayedTimerIndex !== null ? currentSession.exercises[displayedTimerIndex] : null;

  const openSession = (sessionId: 'a' | 'b' | 'c') => {
    const stored = loadRecords();
    const today = new Date().toISOString().slice(0, 10);
    const todayRecord = stored.find((record) => record.date === today && record.sessionId === sessionId);

    setRecords(stored);
    setActiveSession(sessionId);
    setExerciseIndex(0);
    setExpandedExercise(0);
    setCompleted(todayRecord ? new Set(Array.from({ length: todayRecord.completed }, (_, index) => index)) : new Set());
    setNotes(todayRecord?.notes || '');
    setTimerExerciseIndex(null);
    setTimerSecondsLeft(0);
    setTimerTotalSeconds(0);
    setTimerRunning(false);
    setTimerDoneIndex(null);
    setView('session');
  };

  const selectExercise = (index: number) => {
    setExerciseIndex(index);
    setExpandedExercise(index);
  };

  const startTimer = (index: number) => {
    const exercise = currentSession.exercises[index];
    const seconds = parseDurationToSeconds(exercise.duration);
    if (!seconds) return;

    setTimerExerciseIndex(index);
    setTimerDoneIndex(null);

    if (timerRunning && timerExerciseIndex === index && timerSecondsLeft > 0) {
      return;
    }

    if (!timerRunning && timerExerciseIndex === index && timerSecondsLeft > 0) {
      setTimerRunning(true);
      return;
    }

    setTimerTotalSeconds(seconds);
    setTimerSecondsLeft(seconds);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(0);
    setTimerTotalSeconds(0);
    setTimerDoneIndex(null);
    setTimerExerciseIndex(displayedTimerIndex);
  };

  const focusTimerExercise = () => {
    if (displayedTimerIndex === null) return;
    selectExercise(displayedTimerIndex);
  };

  const toggleExerciseDone = (index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
        return next;
      }

      next.add(index);

      const nextIndex = currentSession.exercises.findIndex((_, itemIndex) => itemIndex > index && !next.has(itemIndex));
      if (nextIndex >= 0) {
        setExerciseIndex(nextIndex);
        setExpandedExercise(nextIndex);
      }

      return next;
    });
  };

  if (view === 'home') {
    const recommendedSession = sessions.find((session) => session.id === getCurrentWeekSession()) ?? sessions[0];
    const streak = records.filter((record) => {
      const day = new Date(record.date);
      const now = new Date();
      const diff = Math.floor((now.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 14 && record.completed / record.total >= 0.7;
    }).length;

    return (
      <div className="min-h-screen bg-stone-50">
        <div className="app-page app-container px-4 py-8 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">Bewegen</h1>
            <p className="mt-2 text-sm text-stone-500">Knie · Mobiliteit · Houding</p>
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <button
              onClick={() => openSession(recommendedSession.id)}
              className="session-card w-full p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderLeftWidth: '4px', borderLeftColor: recommendedSession.colorHex }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl font-black" style={{ color: recommendedSession.colorHex }}>
                  {recommendedSession.id.toUpperCase()}
                </span>
                <div>
                  <div className="font-semibold text-stone-900">{recommendedSession.name}</div>
                  <div className="text-xs text-stone-400">
                    {recommendedSession.exercises.length} oefeningen · {recommendedSession.focus}
                  </div>
                </div>
                <span className="ml-auto rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                  Aanbevolen
                </span>
              </div>
              <p className="text-sm leading-relaxed text-stone-600">
                Vandaag past sessie {recommendedSession.id.toUpperCase()} het best — rustig, duidelijk en zonder visuele ruis.
              </p>
            </button>

            <div className="session-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Ritme</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="text-2xl font-bold text-stone-900">{records.length}</div>
                  <div className="mt-1 text-xs text-stone-500">Opgeslagen sessies</div>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="text-2xl font-bold text-stone-900">{streak}</div>
                  <div className="mt-1 text-xs text-stone-500">Goede dagen / 14</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Alle sessies</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => openSession(session.id)}
                  className="session-card w-full p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderTopWidth: '4px', borderTopColor: session.colorHex }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xl font-bold" style={{ color: session.colorHex }}>
                        {session.id.toUpperCase()}
                      </span>
                      <div className="mt-1 font-medium text-stone-900">{session.name}</div>
                      <div className="mt-1 text-xs text-stone-400">{session.exercises.length} oefeningen</div>
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">Open</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setView('history')}
            className="session-card mt-6 w-full p-4 text-left text-sm text-stone-600 transition hover:bg-stone-100"
          >
            📊 Geschiedenis bekijken — {records.length} sessies geregistreerd
          </button>
        </div>

        <div className="bottom-nav fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/90 backdrop-blur">
          <div className="app-container flex justify-around px-4 py-3 text-xs text-stone-400 sm:px-6">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 font-medium text-stone-900">
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

  if (view === 'session') {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="app-page app-container px-4 py-5 sm:px-6 lg:py-6">
          <div className="session-shell">
            <aside className="session-sidebar-stick">
              <div className="session-sidebar-stack">
                <div className="session-card p-4">
                  <button onClick={() => setView('home')} className="text-sm text-stone-400 transition hover:text-stone-700">
                    ← Terug
                  </button>

                  <div className="mt-3 flex items-start gap-4">
                    <span className="text-4xl font-black leading-none" style={{ color: currentSession.colorHex }}>
                      {currentSession.id.toUpperCase()}
                    </span>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-stone-900">{currentSession.name}</h1>
                      <p className="mt-1 text-sm leading-relaxed text-stone-500">{currentSession.focus}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-lg font-bold text-stone-900">{totalDone}</div>
                      <div className="mt-1 text-xs text-stone-500">Klaar</div>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-lg font-bold text-stone-900">{currentSession.exercises.length}</div>
                      <div className="mt-1 text-xs text-stone-500">Totaal</div>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-lg font-bold text-stone-900">{Math.round(progress * 100)}%</div>
                      <div className="mt-1 text-xs text-stone-500">Voortgang</div>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress * 100}%`, backgroundColor: currentSession.colorHex }}
                    />
                  </div>
                </div>

                <div className="session-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Focus</p>
                      <h2 className="mt-1 text-lg font-semibold text-stone-900">Sessie-overzicht</h2>
                    </div>
                    {nextOpenExercise && (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
                        Volgende: {nextOpenIndex + 1}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[0.95fr_1.05fr] lg:grid-cols-1">
                    <div className="session-figure">
                      <AnatomicalFigure
                        sessionId={currentSession.id}
                        exerciseId={selectedExercise.id}
                        colorHex={currentSession.colorHex}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl bg-stone-50 p-3.5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Nu geselecteerd</div>
                        <div className="mt-2 font-medium text-stone-900">{selectedExercise.name}</div>
                        <div className="mt-1 text-sm text-stone-500">{getExerciseMeta(selectedExercise)}</div>
                      </div>

                      {nextOpenExercise ? (
                        <div className="rounded-2xl bg-stone-50 p-3.5">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Volgende open</div>
                          <div className="mt-2 font-medium text-stone-900">{nextOpenExercise.name}</div>
                          <div className="mt-1 text-sm text-stone-500">{getExerciseMeta(nextOpenExercise)}</div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-green-50 p-3.5 text-green-800">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em]">Klaar</div>
                          <div className="mt-2 text-sm font-medium">Alles is afgevinkt. Je kunt de sessie opslaan.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <TimerPanel
                  exercise={timerExercise}
                  colorHex={currentSession.colorHex}
                  isRunning={timerRunning}
                  secondsLeft={timerSecondsLeft}
                  totalSeconds={timerTotalSeconds || parseDurationToSeconds(timerExercise?.duration)}
                  done={timerDoneIndex !== null && displayedTimerIndex === timerDoneIndex}
                  onStart={() => {
                    if (displayedTimerIndex !== null) startTimer(displayedTimerIndex);
                  }}
                  onStop={() => setTimerRunning(false)}
                  onReset={resetTimer}
                  onFocus={focusTimerExercise}
                />

                <div className="session-card p-5">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Notitie (optioneel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Bijv. knie voelde rustig / laatste oefening lastig"
                    className="mt-3 h-24 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-300 focus:bg-white"
                  />
                  <button
                    onClick={() => {
                      const record: DayRecord = {
                        date: todayStr,
                        sessionId: currentSession.id,
                        completed: totalDone,
                        total: currentSession.exercises.length,
                        notes: notes || undefined,
                      };
                      saveRecord(record);
                      setRecords(loadRecords());
                      setView('home');
                    }}
                    className="mt-4 hidden w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 lg:block"
                    style={{ backgroundColor: currentSession.colorHex }}
                  >
                    Sessie opslaan ({totalDone}/{currentSession.exercises.length})
                  </button>
                </div>
              </div>
            </aside>

            <main className="space-y-4">
              <div className="session-card p-4 lg:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Oefeningen</p>
                    <h2 className="mt-1 text-xl font-semibold text-stone-900">Scrollbare sessielijst</h2>
                    <p className="mt-1 text-sm text-stone-500">
                      Op iPad blijft links je overzicht en timer vast staan, terwijl rechts de oefeningencards scrollen.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentSession.exercises.map((exercise, index) => (
                      <button
                        key={exercise.id}
                        onClick={() => selectExercise(index)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${exerciseIndex === index ? 'text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                        style={exerciseIndex === index ? { backgroundColor: currentSession.colorHex } : undefined}
                      >
                        {index + 1}. {exercise.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="exercise-list">
                {currentSession.exercises.map((exercise, index) => {
                  const isExpanded = expandedExercise === index;
                  const isSelected = exerciseIndex === index;
                  const isDone = completed.has(index);
                  const hasTimer = Boolean(exercise.duration);
                  const isTimerTarget = displayedTimerIndex === index;

                  return (
                    <section
                      key={exercise.id}
                      className={`exercise-card ${isSelected ? 'is-selected' : ''} ${isDone ? 'is-done' : ''}`}
                      style={isSelected ? { borderColor: currentSession.colorHex, boxShadow: `0 10px 30px -18px ${currentSession.colorHex}55` } : undefined}
                    >
                      <button
                        onClick={() => {
                          setExerciseIndex(index);
                          setExpandedExercise(isExpanded ? null : index);
                        }}
                        className="w-full p-4 text-left lg:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${isDone ? 'text-white' : 'bg-stone-100 text-stone-500'}`}
                            style={isDone ? { backgroundColor: currentSession.colorHex } : undefined}
                          >
                            {isDone ? '✓' : index + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className={`text-base font-semibold ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                                  {exercise.name}
                                </div>
                                <div className="mt-1 text-sm text-stone-500">{getExerciseMeta(exercise)}</div>
                              </div>

                              <div className="flex flex-wrap gap-2 lg:justify-end">
                                {hasTimer && (
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${isTimerTarget ? 'text-white' : 'bg-stone-100 text-stone-500'}`}
                                    style={isTimerTarget ? { backgroundColor: currentSession.colorHex } : undefined}
                                  >
                                    ⏱ {isTimerTarget ? 'in timer' : exercise.duration}
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-medium text-white">geselecteerd</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-stone-100 px-4 pb-4 pt-4 lg:px-5 lg:pb-5">
                          <p className="text-sm leading-relaxed text-stone-600">{exercise.description}</p>

                          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-900">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Tip</div>
                              <p className="mt-2 leading-relaxed">{exercise.tip}</p>
                            </div>
                            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Let op</div>
                              <p className="mt-2 leading-relaxed">{exercise.commonMistake}</p>
                            </div>
                            <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-700 md:col-span-2 xl:col-span-1">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Materiaal</div>
                              <p className="mt-2 leading-relaxed">{exercise.equipment}</p>
                              {exercise.source && <p className="mt-3 text-xs text-stone-400">Bron: {exercise.source}</p>}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {hasTimer && (
                              <button
                                onClick={() => startTimer(index)}
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                                style={{ backgroundColor: currentSession.colorHex }}
                              >
                                {isTimerTarget && timerRunning ? 'Timer actief' : `Start timer · ${exercise.duration}`}
                              </button>
                            )}

                            <button
                              onClick={() => toggleExerciseDone(index)}
                              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isDone ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'text-white hover:opacity-90'}`}
                              style={!isDone ? { backgroundColor: currentSession.colorHex } : undefined}
                            >
                              {isDone ? 'Markeer als open' : 'Markeer als klaar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const record: DayRecord = {
                    date: todayStr,
                    sessionId: currentSession.id,
                    completed: totalDone,
                    total: currentSession.exercises.length,
                    notes: notes || undefined,
                  };
                  saveRecord(record);
                  setRecords(loadRecords());
                  setView('home');
                }}
                className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 lg:hidden"
                style={{ backgroundColor: currentSession.colorHex }}
              >
                Sessie opslaan ({totalDone}/{currentSession.exercises.length})
              </button>
            </main>
          </div>
        </div>
      </div>
    );
  }

  const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="app-page app-container px-4 py-8 sm:px-6">
        <button onClick={() => setView('home')} className="text-sm text-stone-400 transition hover:text-stone-700">
          ← Terug
        </button>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-900">Geschiedenis</h1>

        {records.length === 0 ? (
          <div className="session-card mt-6 py-16 text-center text-sm text-stone-400">Nog geen sessies geregistreerd.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {[...records]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((record, index) => {
                const session = sessions.find((item) => item.id === record.sessionId) ?? sessions[0];
                const date = new Date(record.date);
                return (
                  <div
                    key={`${record.date}-${record.sessionId}-${index}`}
                    className="session-card p-4"
                    style={{ borderLeftWidth: '3px', borderLeftColor: session.colorHex }}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-medium text-stone-800">
                          {weekDays[date.getDay()]} {date.getDate()} {date.toLocaleDateString('nl-NL', { month: 'short' })}
                        </div>
                        <div className="text-xs text-stone-400">{session.name}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-lg font-bold" style={{ color: session.colorHex }}>
                          {record.completed}/{record.total}
                        </div>
                        <div className="text-xs text-stone-400">{Math.round((record.completed / record.total) * 100)}%</div>
                      </div>
                    </div>
                    {record.notes && <div className="mt-2 text-xs italic text-stone-400">{record.notes}</div>}
                  </div>
                );
              })}
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Sessies per type</h2>
          <div className="grid grid-cols-3 gap-3">
            {sessions.map((session) => {
              const count = records.filter((record) => record.sessionId === session.id).length;
              return (
                <div
                  key={session.id}
                  className="session-card p-4 text-center"
                  style={{ borderTopWidth: '3px', borderTopColor: session.colorHex }}
                >
                  <div className="text-2xl font-bold text-stone-900">{count}</div>
                  <div className="mt-1 text-xs text-stone-400">{session.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bottom-nav fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/90 backdrop-blur">
        <div className="app-container flex justify-around px-4 py-3 text-xs text-stone-400 sm:px-6">
          <button onClick={() => setView('home')} className="flex flex-col items-center gap-1">
            <span className="text-lg">💪</span>Home
          </button>
          <button className="flex flex-col items-center gap-1 font-medium text-stone-900">
            <span className="text-lg">📊</span>Geschiedenis
          </button>
        </div>
      </div>
    </div>
  );
}
