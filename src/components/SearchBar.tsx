import { type FormEvent, useEffect, useRef, useState } from 'react';
import type { City } from '../types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  results?: City[];
  onSelectCity?: (city: City) => void;
  onSaveCity?: (city: City) => void;
  presetCityIds?: number[];
}

/** Barra de busca de cidade. Bloqueia submit com input vazio. */
export default function SearchBar({
  onSearch,
  disabled,
  results = [],
  onSelectCity = () => {},
  onSaveCity,
  presetCityIds = [],
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const firstResultRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (results.length > 0) firstResultRef.current?.focus();
  }, [results]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <div className="w-full max-w-lg">
      <form role="search" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-night-800/75 px-3 py-2 shadow-glass backdrop-blur-xl transition focus-within:border-accent-400/50 focus-within:ring-2 focus-within:ring-accent-400/20">
          <span aria-hidden="true" className="text-accent-400">
            🔍
          </span>
          <label htmlFor="city-search" className="sr-only">
            Buscar cidade
          </label>
          <input
            id="city-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Buscar cidade…"
            autoComplete="off"
            disabled={disabled}
            className="min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 outline-none"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <ul aria-label="Resultados da busca" className="mt-2 space-y-2">
          {results.map((city) => {
            const location = [city.admin1, city.country].filter(Boolean).join(', ');
            const accessibleName = `Selecionar ${city.name}, ${location}`;

            return (
              <li
                key={city.id}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-night-800/95 p-1.5 shadow-glass backdrop-blur-xl"
              >
                <button
                  ref={city === results[0] ? firstResultRef : undefined}
                  type="button"
                  aria-label={accessibleName}
                  onClick={() => onSelectCity(city)}
                  disabled={disabled}
                  className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left text-ink-900 transition hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="ml-2 text-sm text-ink-500">{location}</span>
                </button>
                {onSaveCity &&
                  (presetCityIds.includes(city.id) ? (
                    <span className="px-3 text-xs font-medium text-ink-500">Adicionada</span>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Adicionar ${city.name} às cidades predefinidas`}
                      onClick={() => onSaveCity(city)}
                      disabled={disabled}
                      className="rounded-xl border border-accent-400/20 px-3 py-2 text-sm font-semibold text-accent-400 transition hover:bg-accent-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Adicionar
                    </button>
                  ))}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
