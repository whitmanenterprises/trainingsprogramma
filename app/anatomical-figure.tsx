import { BACK_DATA, FRONT_DATA } from './body-model-data';

const SESSION_FIGURE = {
  a: {
    side: 'front' as const,
    active: ['quadriceps', 'knees', 'gluteal', 'hamstring', 'calves', 'adductors'],
    glow: ['quadriceps', 'knees'],
    label: 'Quadriceps · knieën · stabiliteit',
  },
  b: {
    side: 'back' as const,
    active: ['upper-back', 'trapezius', 'deltoids', 'neck', 'triceps'],
    glow: ['upper-back', 'trapezius'],
    label: 'Bovenrug · schouders · houding',
  },
  c: {
    side: 'front' as const,
    active: ['adductors', 'calves', 'ankles', 'feet', 'obliques'],
    glow: ['adductors', 'ankles'],
    label: 'Heupen · enkels · balans',
  },
};

type SessionId = keyof typeof SESSION_FIGURE;

type MuscleGroup = {
  slug: string;
  paths: string[];
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
          <feGaussianBlur stdDeviation="4" result="blur" />
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
          let fill = '#dbd7d2';
          let stroke = '#b3aca3';

          if (isBody) {
            fill = '#d8d4cf';
            stroke = '#b9b1a8';
          } else if (isGlow) {
            fill = colorHex;
            stroke = colorHex;
          } else if (isActive) {
            fill = `${colorHex}88`;
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
              style={{ transition: 'fill 220ms ease, stroke 220ms ease' }}
            />
          );
        })
      )}
    </svg>
  );
}

export function AnatomicalFigure({ sessionId, colorHex }: { sessionId: SessionId; colorHex: string }) {
  const config = SESSION_FIGURE[sessionId];

  return (
    <div className="figure-panel rounded-[1.65rem] px-4 py-5">
      <div className="mx-auto w-full max-w-[220px]">
        <BodyModel
          side={config.side}
          activeMuscles={config.active}
          glowMuscles={config.glow}
          colorHex={colorHex}
        />
      </div>
      <div className="mt-3 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
          {config.side === 'front' ? 'voorkant' : 'achterkant'}
        </div>
        <div className="mt-2 text-xs text-stone-500">{config.label}</div>
      </div>
    </div>
  );
}
