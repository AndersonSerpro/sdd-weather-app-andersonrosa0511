import { useEffect, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import HourlyForecast from './components/HourlyForecast';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import WeatherSuggestion from './components/WeatherSuggestion';
import { useWeather } from './hooks/useWeather';
import { loadPresetCities, savePresetCities } from './lib/presetCities';
import { getWeatherSuggestion } from './lib/weatherSuggestion';
import type { City, Unit } from './types/weather';

/**
 * WeatherView — aplicação completa de previsão do tempo.
 *
 * Construída ao longo do treinamento de Spec-Driven Development com GitHub
 * Copilot, do briefing à entrega.
 */
export default function App() {
  const { status, data, cities, selectedCity, error, query, search, selectCity, retry } =
    useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');
  const [presetCities, setPresetCities] = useState<City[]>(loadPresetCities);

  useEffect(() => {
    savePresetCities(presetCities);
  }, [presetCities]);

  function addPresetCity(city: City) {
    setPresetCities((current) =>
      current.some((preset) => preset.id === city.id) ? current : [...current, city],
    );
  }

  function removePresetCity(cityId: number) {
    setPresetCities((current) => current.filter((city) => city.id !== cityId));
  }

  return (
    <div className="min-h-screen text-ink-900">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-night-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl border border-sun/25 bg-sun/10 text-xl text-sun shadow-sm"
            >
              ☀️
            </span>
            <div>
              <h1 className="text-base font-bold tracking-wide text-ink-900">Qual é o tempo?</h1>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Clima local · Brasil
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
            <SearchBar
              onSearch={search}
              disabled={status === 'loading'}
              results={cities}
              onSelectCity={selectCity}
              onSaveCity={addPresetCity}
              presetCityIds={presetCities.map((city) => city.id)}
            />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main
        aria-busy={status === 'loading'}
        className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:px-6 md:py-10"
      >
        <section aria-labelledby="preset-cities-heading" className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
                Consultas rápidas
              </p>
              <h2 id="preset-cities-heading" className="text-sm font-semibold text-ink-700">
                Seus lugares
              </h2>
            </div>
            {presetCities.length > 0 && (
              <span className="text-xs tabular-nums text-ink-500">
                {String(presetCities.length).padStart(2, '0')} salvas
              </span>
            )}
          </div>
          {presetCities.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-ink-500">
              Nenhuma cidade predefinida.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {presetCities.map((city) => (
                <li
                  key={city.id}
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.045] shadow-glass backdrop-blur-md transition hover:border-accent-400/25 hover:bg-white/[0.07]"
                >
                  <button
                    type="button"
                    aria-label={`Ver previsão de ${city.name}, ${city.admin1 ?? city.country}`}
                    disabled={status === 'loading'}
                    onClick={() => selectCity(city)}
                    className="rounded-l-xl px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {city.name} · {city.admin1 === 'Paraná' ? 'PR' : (city.admin1 ?? city.country)}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remover ${city.name} das cidades predefinidas`}
                    disabled={status === 'loading'}
                    onClick={() => removePresetCity(city.id)}
                    className="rounded-r-xl px-3 py-2.5 text-sm text-ink-500 transition hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {status === 'idle' && (
          <EmptyState
            title="Busque uma cidade ou escolha uma opção acima"
            hint="Você também pode pesquisar qualquer cidade."
          />
        )}

        {status === 'loading' && <LoadingState />}

        {status === 'empty' && (
          <EmptyState
            title={`Nenhuma cidade encontrada para "${query}"`}
            hint="Verifique a grafia e tente novamente."
          />
        )}

        {status === 'error' && error && (
          <ErrorState message={error} context={selectedCity?.name} onRetry={retry} />
        )}

        {status === 'success' && data && (
          <div className="space-y-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
              <CurrentWeather city={data.city} current={data.current} unit={unit} />
              <WeatherSuggestion
                suggestion={getWeatherSuggestion(data.hourly, data.current.time)}
              />
            </div>
            <HourlyForecast hourly={data.hourly} currentTime={data.current.time} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-ink-500">
        Dados por{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-accent-400 underline-offset-4 hover:underline"
        >
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}
