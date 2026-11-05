import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherType, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherType;
  unit: Unit;
}

interface MetricProps {
  icon: string;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-night-900/45 px-3 py-3 backdrop-blur-md sm:px-4">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lg"
      >
        {icon}
      </span>
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

/** Seção "hero" com as condições atuais da cidade selecionada. */
export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <section
      aria-label="Clima atual"
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.045] to-accent-500/[0.04] p-5 shadow-glass backdrop-blur-xl sm:p-7 md:p-8"
    >
      <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-400">
            Agora
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {city.name}
          </h2>
          {location && <p className="mt-1 text-sm text-ink-500">{location}</p>}

          <div className="mt-6 flex items-center gap-4 sm:mt-8">
            <span
              aria-hidden="true"
              className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-4xl sm:size-20 sm:text-5xl"
            >
              {getWeatherIcon(current.weatherCode)}
            </span>
            <span className="text-7xl font-light leading-none tracking-tight text-ink-900 sm:text-8xl">
              {formatTemperature(current.temperature, unit)}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-ink-700">
            {getWeatherLabel(current.weatherCode)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:w-[21rem] xl:shrink-0">
          <Metric
            icon="💧"
            label="Umidade"
            value={current.humidity === null ? '—' : `${Math.round(current.humidity)}%`}
          />
          <Metric
            icon="💨"
            label="Vento"
            value={current.windSpeed === null ? '—' : `${Math.round(current.windSpeed)} km/h`}
          />
          <Metric
            icon="🌧️"
            label="Precipitação"
            value={current.precipitation === null ? '—' : `${current.precipitation} mm`}
          />
          <Metric
            icon="📊"
            label="Pressão"
            value={current.pressure === null ? '—' : `${Math.round(current.pressure)} hPa`}
          />
        </div>
      </div>
    </section>
  );
}
