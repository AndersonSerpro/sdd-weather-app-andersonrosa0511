import type { WeatherSuggestion as WeatherSuggestionData } from '../lib/weatherSuggestion';

interface WeatherSuggestionProps {
  suggestion: WeatherSuggestionData;
}

const PRESENTATION = {
  rain: {
    icon: '☂️',
    style: 'border-sky-200 bg-sky-50 text-sky-950',
  },
  sun: {
    icon: '☀️',
    style: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  cold: {
    icon: '🧥',
    style: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  },
  neutral: {
    icon: '🌤️',
    style: 'border-accent-500/20 bg-accent-100 text-ink-900',
  },
  unavailable: {
    icon: '◷',
    style: 'border-ink-900/10 bg-white/70 text-ink-700',
  },
} as const;

export default function WeatherSuggestion({ suggestion }: WeatherSuggestionProps) {
  const presentation = PRESENTATION[suggestion.kind];

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${presentation.style}`}
    >
      <span aria-hidden="true" className="text-3xl">
        {presentation.icon}
      </span>
      <div>
        <h2 className="text-lg font-bold">{suggestion.title}</h2>
        <p className="mt-1 text-sm">{suggestion.message}</p>
      </div>
    </aside>
  );
}
