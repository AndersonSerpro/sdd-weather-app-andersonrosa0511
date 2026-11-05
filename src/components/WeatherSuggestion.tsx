import type { WeatherSuggestion as WeatherSuggestionData } from '../lib/weatherSuggestion';

interface WeatherSuggestionProps {
  suggestion: WeatherSuggestionData;
}

const PRESENTATION = {
  rain: {
    icon: '☂️',
    style: 'border-sky-300/20 bg-gradient-to-br from-sky-400/[0.16] to-sky-950/45 text-sky-50',
  },
  sun: {
    icon: '☀️',
    style:
      'border-amber-300/20 bg-gradient-to-br from-amber-300/[0.15] to-amber-950/40 text-amber-50',
  },
  cold: {
    icon: '🧥',
    style: 'border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.14] to-cyan-950/45 text-cyan-50',
  },
  neutral: {
    icon: '🌤️',
    style: 'border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] text-ink-900',
  },
  unavailable: {
    icon: '◷',
    style: 'border-white/10 bg-white/[0.045] text-ink-700',
  },
} as const;

export default function WeatherSuggestion({ suggestion }: WeatherSuggestionProps) {
  const presentation = PRESENTATION[suggestion.kind];

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`relative flex min-h-44 flex-col justify-between overflow-hidden rounded-3xl border p-5 shadow-glass backdrop-blur-xl sm:min-h-48 sm:p-6 ${presentation.style}`}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl border border-current/15 bg-black/10 text-2xl"
      >
        {presentation.icon}
      </span>
      <div className="mt-6">
        <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] opacity-70">
          Para as próximas horas
        </p>
        <h2 className="text-xl font-bold tracking-tight">{suggestion.title}</h2>
        <p className="mt-1 text-sm leading-relaxed opacity-80">{suggestion.message}</p>
      </div>
    </aside>
  );
}
