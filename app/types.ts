export interface Exercise {
  id: number;
  order_index: number;
  dutch: string;
  name: string;
  muscles: string[];
  sets: number;
  reps: string;
  why: string;
  how: string[];
  feel: string;
  view: string;
  pose: { d: string; wall?: boolean; step?: boolean; label?: string };
  active: boolean;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  completed_at: string;
  exercises_completed: { id: number; dutch: string }[];
  total_exercises: number;
}
