import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

/** Card de um dia da previsão. */
export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  return (
    <li className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-3 text-center shadow-glass backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-accent-400/30 hover:bg-white/[0.08] sm:p-4">
      <div>
        <p className="text-sm font-semibold text-ink-900">{getDayLabel(day.date, index)}</p>
        <p className="mt-0.5 text-xs text-ink-500">{getShortDate(day.date)}</p>
      </div>
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl border border-white/[0.06] bg-night-800/80 text-3xl"
        title={getWeatherLabel(day.weatherCode)}
      >
        {getWeatherIcon(day.weatherCode)}
      </span>
      <p className="flex items-baseline gap-2 text-sm">
        <span className="font-semibold text-ink-900">{formatTemperature(day.max, unit)}</span>
        <span className="text-ink-500">{formatTemperature(day.min, unit)}</span>
      </p>
      <div className="flex w-full justify-center gap-3 border-t border-white/[0.07] pt-3 text-[0.68rem]">
        <span className="text-accent-400">
          💧 {day.precipitationProbability === null ? '—' : `${day.precipitationProbability}%`}
        </span>
        <span className="text-ink-500">
          💨 {day.windSpeedMax === null ? '—' : `${Math.round(day.windSpeedMax)} km/h`}
        </span>
      </div>
    </li>
  );
}
