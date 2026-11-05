import type { HourlyForecast } from '../types/weather';

export type WeatherSuggestionKind = 'rain' | 'sun' | 'cold' | 'neutral' | 'unavailable';

export interface WeatherSuggestion {
  kind: WeatherSuggestionKind;
  title: string;
  message: string;
}

const RAIN_PROBABILITY_THRESHOLD = 50;
const UV_INDEX_THRESHOLD = 6;
const COLD_TEMPERATURE_THRESHOLD = 10;

export function getWeatherSuggestion(
  hourly: HourlyForecast[],
  currentTime: string,
): WeatherSuggestion {
  const upcoming = hourly.filter((hour) => hour.time >= currentTime).slice(0, 3);

  if (
    upcoming.length === 0 ||
    !upcoming.some(
      ({ temperature, precipitationProbability, uvIndex }) =>
        temperature !== null || precipitationProbability !== null || uvIndex !== null,
    )
  ) {
    return {
      kind: 'unavailable',
      title: 'Sugestão indisponível',
      message: 'Não há dados horários suficientes para orientar as próximas horas.',
    };
  }

  if (upcoming.some((hour) => (hour.precipitationProbability ?? 0) >= RAIN_PROBABILITY_THRESHOLD)) {
    return {
      kind: 'rain',
      title: 'Leve o guarda-chuva',
      message: 'Há chance de chuva nas próximas horas.',
    };
  }

  if (upcoming.some((hour) => (hour.uvIndex ?? 0) >= UV_INDEX_THRESHOLD)) {
    return {
      kind: 'sun',
      title: 'Sol forte',
      message: 'Não esqueça o protetor solar.',
    };
  }

  if (
    upcoming.some(
      (hour) => hour.temperature !== null && hour.temperature <= COLD_TEMPERATURE_THRESHOLD,
    )
  ) {
    return {
      kind: 'cold',
      title: 'Frio',
      message: 'Leve uma japona.',
    };
  }

  return {
    kind: 'neutral',
    title: 'Sem alerta importante',
    message: 'Não há chuva, sol forte ou frio intenso previstos nas próximas horas.',
  };
}
