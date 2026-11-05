import { useState, type FormEvent } from 'react';
import type { City } from '../types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  results?: City[];
  onSelectCity?: (city: City) => void;
}

/** Barra de busca de cidade. Bloqueia submit com input vazio. */
export default function SearchBar({
  onSearch,
  disabled,
  results = [],
  onSelectCity = () => {},
}: SearchBarProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <div className="w-full max-w-md">
      <form role="search" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md focus-within:border-accent-500">
          <span aria-hidden="true" className="text-white/50">
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
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="rounded-lg bg-accent-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <ul aria-label="Resultados da busca" className="mt-2 space-y-1">
          {results.map((city) => {
            const location = [city.admin1, city.country].filter(Boolean).join(', ');
            const accessibleName = `Selecionar ${city.name}, ${location}`;

            return (
              <li key={city.id}>
                <button
                  type="button"
                  aria-label={accessibleName}
                  onClick={() => onSelectCity(city)}
                  className="w-full rounded-lg px-3 py-2 text-left text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="ml-2 text-sm text-white/60">{location}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
