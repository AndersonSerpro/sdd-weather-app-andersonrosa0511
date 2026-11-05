import type { City } from '../types/weather';

const STORAGE_KEY = 'weather-app:preset-cities';

export const DEFAULT_PRESET_CITIES: City[] = [
  {
    id: -1,
    name: 'Curitiba',
    country: 'Brasil',
    admin1: 'Paraná',
    latitude: -25.4284,
    longitude: -49.2733,
  },
  {
    id: -2,
    name: 'Maringá',
    country: 'Brasil',
    admin1: 'Paraná',
    latitude: -23.4205,
    longitude: -51.9333,
  },
  {
    id: -3,
    name: 'Matinhos',
    country: 'Brasil',
    admin1: 'Paraná',
    latitude: -25.8176,
    longitude: -48.5428,
  },
];

function isCity(value: unknown): value is City {
  if (typeof value !== 'object' || value === null) return false;
  const city = value as Record<string, unknown>;
  return (
    typeof city.id === 'number' &&
    typeof city.name === 'string' &&
    typeof city.country === 'string' &&
    typeof city.latitude === 'number' &&
    typeof city.longitude === 'number' &&
    (city.admin1 === undefined || typeof city.admin1 === 'string')
  );
}

export function loadPresetCities(): City[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return DEFAULT_PRESET_CITIES.map((city) => ({ ...city }));

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isCity) : [];
  } catch {
    return DEFAULT_PRESET_CITIES.map((city) => ({ ...city }));
  }
}

export function savePresetCities(cities: City[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    // O clima continua utilizável quando o navegador bloqueia armazenamento local.
  }
}
