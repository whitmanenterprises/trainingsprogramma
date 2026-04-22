import { BACK_DATA, FRONT_DATA } from './body-model-data';

type SessionId = 'a' | 'b' | 'c';
type ExerciseId = `${SessionId}${number}`;

type MuscleGroup = {
  slug: string;
  paths: string[];
};

type FigureConfig = {
  side: 'front' | 'back';
  active: string[];
  glow?: string[];
  label: string;
};

const SESSION_FIGURE: Record<SessionId, FigureConfig> = {
  a: {
    side: 'front',
    active: ['quadriceps', 'knees', 'gluteal', 'hamstring', 'calves', 'adductors'],
    glow: ['quadriceps', 'knees'],
    label: 'Onderlichaam · stabiliteit',
  },
  b: {
    side: 'back',
    active: ['upper-back', 'trapezius', 'deltoids', 'neck', 'triceps'],
    glow: ['upper-back', 'trapezius'],
    label: 'Bovenrug · schouders · houding',
  },
  c: {
    side: 'front',
    active: ['adductors', 'calves', 'ankles', 'feet', 'obliques'],
    glow: ['adductors', 'ankles'],
    label: 'Heupen · enkels · balans',
  },
};

const EXERCISE_FIGURE: Partial<Record<ExerciseId, FigureConfig>> = {
  a1: { side: 'front', active: ['quadriceps', 'knees'], label: 'Quadriceps · kniepees' },
  a2: { side: 'front', active: ['quadriceps', 'knees'], label: 'Quadriceps · kniecontrole' },
  a3: { side: 'front', active: ['quadriceps', 'knees'], label: 'Quadriceps · strekking' },
  a4: { side: 'back', active: ['gluteal'], label: 'Bilspieren · buitenheup' },
  a5: { side: 'back', active: ['gluteal'], label: 'Bilspieren · heupstabiliteit' },
  a6: { side: 'front', active: ['quadriceps', 'knees', 'gluteal'], label: 'Quads · billen · knieën' },
  a7: { side: 'back', active: ['gluteal', 'hamstring'], label: 'Billen · hamstrings' },
  b1: { side: 'front', active: ['neck'], label: 'Voorkant nek · houding' },
  b2: { side: 'back', active: ['upper-back', 'trapezius', 'deltoids'], label: 'Schouderbladen · trapezius' },
  b3: { side: 'back', active: ['neck'], label: 'Nekextensoren' },
  b4: { side: 'back', active: ['upper-back', 'trapezius', 'deltoids'], label: 'Bovenrug · extensie' },
  b5: { side: 'back', active: ['upper-back', 'lower-back'], label: 'Middenrug · mobiliteit' },
  b6: { side: 'front', active: ['chest', 'deltoids'], label: 'Borst · schouderopening' },
  b7: { side: 'back', active: ['upper-back', 'obliques'], label: 'Rotatie · bovenrug' },
  b8: { side: 'front', active: ['chest', 'deltoids'], label: 'Borstspieren · opening' },
  c1: { side: 'front', active: ['adductors', 'quadriceps'], label: 'Heupvoorkant · stretch' },
  c2: { side: 'front', active: ['adductors', 'quadriceps', 'ankles', 'feet', 'calves'], label: 'Heupen · enkels · squat' },
  c3: { side: 'back', active: ['gluteal', 'adductors'], label: 'Heuprotatie · bil/heup' },
  c4: { side: 'front', active: ['ankles', 'feet', 'calves'], label: 'Enkelmobiliteit' },
  c5: { side: 'front', active: ['ankles', 'feet', 'calves', 'obliques'], label: 'Balans · enkelketen' },
  c6: { side: 'back', active: ['calves', 'ankles'], label: 'Kuit · achilles' },
  c7: { side: 'back', active: ['hamstring', 'lower-back', 'calves', 'neck'], label: 'Achterste keten' },
  c8: { side: 'front', active: ['quadriceps', 'adductors', 'ankles', 'feet', 'obliques'], label: 'Volledig lichaam' },
};

function BodyModel({
  side,
  activeMuscles,
  glowMuscles,
  colorHex,
}: {
  side: 'front' | 'back';
  activeMuscles: string[];
  glowMuscles: string[];
  colorHex: string;
}) {
  const data = (side === 'front' ? FRONT_DATA : BACK_DATA) as MuscleGroup[];
  const vb = side === 'front' ? '0 0 724 1448' : '724 0 724 1448';

  return (
    <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id={`glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {data.flatMap((group) =>
        group.paths.map((d, index) => {
          const isGlow = glowMuscles.includes(group.slug);
          const isActive = activeMuscles.includes(group.slug);
          const isBody = group.slug === 'head' || group.slug === 'hair';
          let fill = '#ddd7cf';
          let stroke = '#b7afa6';

          if (isBody) {
            fill = '#d8d1ca';
            stroke = '#c0b8af';
          } else if (isGlow) {
            fill = colorHex;
            stroke = colorHex;
          } else if (isActive) {
            fill = `${colorHex}a6`;
            stroke = colorHex;
          }

          return (
            <path
              key={`${group.slug}-${index}`}
              d={d}
              fill={fill}
              stroke={stroke}
              strokeWidth="1"
              strokeLinejoin="round"
              filter={isGlow ? `url(#glow-${side})` : undefined}
              style={{ transition: 'fill 220ms ease, stroke 220ms ease, filter 220ms ease' }}
            />
          );
        })
      )}
    </svg>
  );
}

export function AnatomicalFigure({
  sessionId,
  exerciseId,
  colorHex,
}: {
  sessionId: SessionId;
  exerciseId?: string;
  colorHex: string;
}) {
  const config = (exerciseId ? EXERCISE_FIGURE[exerciseId as ExerciseId] : undefined) ?? SESSION_FIGURE[sessionId];
  const glowMuscles = config.glow ?? config.active;

  return (
    <div className="figure-panel rounded-[1.65rem] px-4 py-4">
      <div className="mx-auto w-full max-w-[232px]">
        <BodyModel side={config.side} activeMuscles={config.active} glowMuscles={glowMuscles} colorHex={colorHex} />
      </div>
      <div className="mt-2 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
          {config.side === 'front' ? 'voorkant' : 'achterkant'}
        </div>
        <div className="mt-1.5 text-xs font-medium text-stone-600">{config.label}</div>
      </div>
    </div>
  );
}
