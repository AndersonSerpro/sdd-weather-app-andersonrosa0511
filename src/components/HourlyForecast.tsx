import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { HourlyForecast as HourlyForecastData, Unit } from '../types/weather';

interface HourlyForecastProps {
  hourly: HourlyForecastData[];
  currentTime: string;
  unit: Unit;
}

export default function HourlyForecast({ hourly, currentTime, unit }: HourlyForecastProps) {
  const upcoming = hourly.filter((hour) => hour.time >= currentTime);

  return (
    <section aria-labelledby="hourly-forecast-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
            Ao longo do dia
          </p>
          <h2 id="hourly-forecast-heading" className="text-xl font-bold tracking-tight">
            Previsão por horário
          </h2>
        </div>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
          Hora local
        </span>
      </div>

      {hourly.length === 0 ? (
        <p
          role="status"
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-ink-500"
        >
          Previsão por hora indisponível.
        </p>
      ) : upcoming.length === 0 ? (
        <p
          role="status"
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-ink-500"
        >
          Não há mais horários previstos para hoje.
        </p>
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.035] shadow-glass backdrop-blur-md">
          <table className="w-full table-fixed text-left text-sm">
            <caption className="sr-only">Condições previstas para cada hora de hoje</caption>
            <thead className="sticky top-0 bg-night-800 text-ink-900">
              <tr>
                <th scope="col" className="w-12 px-2 py-2 font-semibold sm:w-16 sm:px-4">
                  Hora
                </th>
                <th scope="col" className="px-2 py-2 font-semibold sm:px-4">
                  Condição
                </th>
                <th scope="col" className="w-12 px-2 py-2 font-semibold sm:w-16 sm:px-4">
                  Temp.
                </th>
                <th scope="col" className="w-12 px-2 py-2 font-semibold sm:w-16 sm:px-4">
                  Chuva
                </th>
                <th scope="col" className="w-12 px-2 py-2 font-semibold sm:w-16 sm:px-4">
                  UV
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {upcoming.map((hour) => (
                <tr key={hour.time} className="transition-colors hover:bg-white/[0.035]">
                  <th scope="row" className="px-2 py-2 font-medium text-ink-700 sm:px-4">
                    {hour.time.slice(11, 16)}
                  </th>
                  <td className="break-words px-2 py-2 text-ink-700 sm:px-4">
                    <span aria-hidden="true" className="mr-1">
                      {getWeatherIcon(hour.weatherCode)}
                    </span>
                    {getWeatherLabel(hour.weatherCode)}
                  </td>
                  <td className="px-2 py-2 text-ink-700 sm:px-4">
                    {formatTemperature(hour.temperature, unit)}
                  </td>
                  <td className="px-2 py-2 text-ink-700 sm:px-4">
                    {hour.precipitationProbability === null
                      ? '—'
                      : `${Math.round(hour.precipitationProbability)}%`}
                  </td>
                  <td className="px-2 py-2 text-ink-700 sm:px-4">
                    {hour.uvIndex === null ? '—' : Math.round(hour.uvIndex)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
