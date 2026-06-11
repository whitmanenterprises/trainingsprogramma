import { NextResponse } from 'next/server';

type CompletedExercise = {
  id: string;
  name: string;
  index: number;
};

type WorkoutPayload = {
  date: string;
  sessionId: 'a' | 'b' | 'c';
  sessionName: string;
  totalExercises: number;
  completedExercises: CompletedExercise[];
  notes?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isWorkoutPayload(value: unknown): value is WorkoutPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<WorkoutPayload>;
  return (
    typeof payload.date === 'string' &&
    (payload.sessionId === 'a' || payload.sessionId === 'b' || payload.sessionId === 'c') &&
    typeof payload.sessionName === 'string' &&
    typeof payload.totalExercises === 'number' &&
    Array.isArray(payload.completedExercises)
  );
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Supabase service credentials are missing');
  }

  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError('Invalid JSON payload', 400);
  }

  if (!isWorkoutPayload(payload)) {
    return jsonError('Invalid workout payload', 400);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonError('Supabase service credentials are missing', 500);
  }

  const logEntry = {
    date: payload.date,
    sessionId: payload.sessionId,
    sessionName: payload.sessionName,
    notes: payload.notes?.trim() || null,
    completedExercises: payload.completedExercises,
  };

  try {
    const existingResponse = await supabaseRequest(
      'workout_sessions?select=id,exercises_completed&order=created_at.desc&limit=200'
    );

    if (!existingResponse.ok) {
      return jsonError('Could not read existing workout logs', 502);
    }

    const existingRows = (await existingResponse.json()) as Array<{
      id: string;
      exercises_completed?: { date?: string; sessionId?: string };
    }>;

    const duplicateIds = existingRows
      .filter((row) => row.exercises_completed?.date === payload.date && row.exercises_completed?.sessionId === payload.sessionId)
      .map((row) => row.id);

    if (duplicateIds.length > 0) {
      const ids = duplicateIds.map((id) => `"${id}"`).join(',');
      const deleteResponse = await supabaseRequest(`workout_sessions?id=in.(${ids})`, { method: 'DELETE' });

      if (!deleteResponse.ok) {
        return jsonError('Could not replace existing workout log', 502);
      }
    }

    const insertResponse = await supabaseRequest('workout_sessions', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify([
        {
          completed_at: `${payload.date}T12:00:00+00:00`,
          exercises_completed: logEntry,
          total_exercises: payload.totalExercises,
        },
      ]),
    });

    if (!insertResponse.ok) {
      return jsonError('Could not save workout log', 502);
    }

    const data = await insertResponse.json();
    return NextResponse.json({ ok: true, id: data?.[0]?.id ?? null });
  } catch {
    return jsonError('Could not save workout log', 500);
  }
}
