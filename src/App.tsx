import { useState } from 'react';
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
import { getWeatherSuggestion } from './lib/weatherSuggestion';
import type { City, Unit } from './types/weather';

const PRESET_CITIES: Array<{ city: City; label: string }> = [
  {
    city: {
      id: -1,
      name: 'Curitiba',
      country: 'Brasil',
      admin1: 'Paraná',
      latitude: -25.4284,
      longitude: -49.2733,
    },
    label: 'Curitiba · PR',
  },
  {
    city: {
      id: -2,
      name: 'Maringá',
      country: 'Brasil',
      admin1: 'Paraná',
      latitude: -23.4205,
      longitude: -51.9333,
    },
    label: 'Maringá · PR',
  },
  {
    city: {
      id: -3,
      name: 'Matinhos',
      country: 'Brasil',
      admin1: 'Paraná',
      latitude: -25.8176,
      longitude: -48.5428,
    },
    label: 'Matinhos · PR',
  },
];

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

  return (
    <div className="min-h-screen text-ink-900">
      <header className="border-b border-ink-900/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-2xl text-sun">
              ☀️
            </span>
            <h1 className="text-lg font-bold">Qual é o tempo?</h1>
          </div>
          <div className="flex w-full flex-col items-start gap-3 md:w-auto md:flex-row md:items-center">
            <SearchBar
              onSearch={search}
              disabled={status === 'loading'}
              results={cities}
              onSelectCity={selectCity}
            />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main aria-busy={status === 'loading'} className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <section aria-labelledby="preset-cities-heading" className="space-y-3">
          <h2 id="preset-cities-heading" className="text-sm font-semibold text-ink-700">
            Cidades predefinidas
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_CITIES.map(({ city, label }) => (
              <button
                key={city.id}
                type="button"
                aria-label={`Ver previsão de ${city.name}, Paraná`}
                disabled={status === 'loading'}
                onClick={() => selectCity(city)}
                className="rounded-lg border border-accent-500/20 bg-white/70 px-4 py-2 text-sm font-medium text-ink-700 shadow-sm transition hover:bg-accent-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
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
          <>
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <WeatherSuggestion suggestion={getWeatherSuggestion(data.hourly, data.current.time)} />
            <HourlyForecast hourly={data.hourly} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-ink-500">
        Dados por{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-accent-600 underline-offset-4 hover:underline"
        >
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}
