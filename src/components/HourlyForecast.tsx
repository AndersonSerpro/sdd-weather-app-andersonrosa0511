import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { HourlyForecast as HourlyForecastData, Unit } from '../types/weather';

interface HourlyForecastProps {
  hourly: HourlyForecastData[];
  unit: Unit;
}

export default function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  return (
    <section aria-labelledby="hourly-forecast-heading" className="space-y-3">
      <h2 id="hourly-forecast-heading" className="text-xl font-bold">
        Previsão de hoje por horário
      </h2>
      {hourly.length === 0 ? (
        <p
          role="status"
          className="rounded-xl border border-ink-900/10 bg-white/70 p-4 text-ink-500"
        >
          Previsão por hora indisponível.
        </p>
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-xl border border-white/80 bg-white/70 shadow-glass">
          <table className="w-full table-fixed text-left text-sm">
            <caption className="sr-only">Condições previstas para cada hora de hoje</caption>
            <thead className="sticky top-0 bg-accent-100 text-ink-700">
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
            <tbody className="divide-y divide-ink-900/10">
              {hourly.map((hour) => (
                <tr key={hour.time}>
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
