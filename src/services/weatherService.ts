import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

/** Erro tipado da camada de dados, com mensagem amigável ao usuário. */
export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

/** Faz um fetch com timeout via AbortController. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais. Tente novamente.');
    }
    throw new WeatherServiceError('Falha de rede. Verifique sua conexão.');
  } finally {
    clearTimeout(timeout);
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function hasFiveConsecutiveDates(dates: unknown[], currentTime: string): dates is string[] {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(currentTime)) return false;

  const firstDate = dates[0];
  if (typeof firstDate !== 'string' || firstDate !== currentTime.slice(0, 10)) return false;

  const start = new Date(`${firstDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== firstDate) {
    return false;
  }

  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  return dates.every(
    (date, index) =>
      typeof date === 'string' &&
      date === new Date(start.getTime() + index * dayInMilliseconds).toISOString().slice(0, 10),
  );
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new WeatherServiceError('A resposta do serviço é inválida. Tente novamente.');
  }
}

/**
 * Busca cidades por nome (geocoding). Retorna lista vazia quando não há
 * resultados — o estado "vazio" é tratado pela camada de UI.
 */
export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new WeatherServiceError('Não foi possível buscar a cidade. Tente novamente.');
  }

  const data = await readJson(res);
  if (!isRecord(data)) {
    throw new WeatherServiceError('A resposta de busca é inválida. Tente novamente.');
  }
  if (data.results === undefined) return [];
  if (!Array.isArray(data.results)) {
    throw new WeatherServiceError('A resposta de busca é inválida. Tente novamente.');
  }

  return data.results.map((result): City => {
    if (
      !isRecord(result) ||
      typeof result.id !== 'number' ||
      typeof result.name !== 'string' ||
      typeof result.latitude !== 'number' ||
      typeof result.longitude !== 'number'
    ) {
      throw new WeatherServiceError('A resposta de busca é inválida. Tente novamente.');
    }

    const city = result as unknown as GeocodingResult;
    return {
      id: city.id,
      name: city.name,
      country: city.country ?? '',
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
    };
  });
}

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    surface_pressure?: number | null;
    precipitation?: number | null;
    weather_code?: number | null;
  };
  daily?: {
    time: string[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
  };
}

function mapCurrent(c: NonNullable<ForecastResponse['current']>): CurrentWeather {
  return {
    time: c.time,
    temperature: asNullableNumber(c.temperature_2m),
    humidity: asNullableNumber(c.relative_humidity_2m),
    windSpeed: asNullableNumber(c.wind_speed_10m),
    pressure: asNullableNumber(c.surface_pressure),
    precipitation: asNullableNumber(c.precipitation),
    weatherCode: asNullableNumber(c.weather_code),
  };
}

function mapForecast(d: NonNullable<ForecastResponse['daily']>): ForecastDay[] {
  return d.time.map((date, i) => ({
    date,
    weatherCode: asNullableNumber(d.weather_code?.[i]),
    max: asNullableNumber(d.temperature_2m_max?.[i]),
    min: asNullableNumber(d.temperature_2m_min?.[i]),
    precipitationProbability: asNullableNumber(d.precipitation_probability_max?.[i]),
    windSpeedMax: asNullableNumber(d.wind_speed_10m_max?.[i]),
  }));
}

/**
 * Busca o clima atual e a previsão de 5 dias para uma cidade.
 * Temperaturas retornam em Celsius (conversão fica na UI).
 */
export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    forecast_days: '5',
    timezone: 'auto',
  });

  const res = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new WeatherServiceError('Não foi possível carregar o clima. Tente novamente.');
  }

  const rawData = await readJson(res);
  if (!isRecord(rawData) || !isRecord(rawData.current) || !isRecord(rawData.daily)) {
    throw new WeatherServiceError('Resposta de clima incompleta. Tente novamente.');
  }
  const rawCurrent = rawData.current;
  const rawDaily = rawData.daily;
  if (
    typeof rawCurrent.time !== 'string' ||
    !Array.isArray(rawDaily.time) ||
    rawDaily.time.length !== 5 ||
    !hasFiveConsecutiveDates(rawDaily.time, rawCurrent.time)
  ) {
    throw new WeatherServiceError('Resposta de clima incompleta. Tente novamente.');
  }
  const current = rawCurrent as unknown as NonNullable<ForecastResponse['current']>;
  const daily = rawDaily as unknown as NonNullable<ForecastResponse['daily']>;

  return {
    city,
    current: mapCurrent(current),
    forecast: mapForecast(daily),
  };
}
