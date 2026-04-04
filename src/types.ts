export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps?: string;
  duration?: string;
  muscles: string;
  description: string;
  tip: string;
  commonMistake: string;
  equipment: string;
  source?: string;
}

export interface Session {
  id: 'a' | 'b' | 'c';
  name: string;
  color: string;
  colorHex: string;
  bgLight: string;
  focus: string;
  exercises: Exercise[];
}

export interface DayRecord {
  date: string;
  sessionId: 'a' | 'b' | 'c';
  completed: number;
  total: number;
  notes?: string;
  kneeFeeling?: string;
  postureFeeling?: string;
}
