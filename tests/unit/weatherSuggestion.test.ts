import { describe, expect, it } from 'vitest';
import { getWeatherSuggestion } from '../../src/lib/weatherSuggestion';
import type { HourlyForecast } from '../../src/types/weather';

const hour = (overrides: Partial<HourlyForecast> = {}): HourlyForecast => ({
  time: '2026-06-16T12:00',
  temperature: 20,
  weatherCode: 1,
  precipitationProbability: 0,
  uvIndex: 2,
  ...overrides,
});

describe('getWeatherSuggestion', () => {
  it('recomenda guarda-chuva a partir de 50% de probabilidade de chuva', () => {
    const suggestion = getWeatherSuggestion(
      [hour({ precipitationProbability: 50 })],
      '2026-06-16T12:00',
    );

    expect(suggestion).toMatchObject({ kind: 'rain', title: 'Leve o guarda-chuva' });
  });

  it('dá prioridade à chuva sobre sol forte e frio', () => {
    const suggestion = getWeatherSuggestion(
      [hour({ precipitationProbability: 50, uvIndex: 8, temperature: 8 })],
      '2026-06-16T12:00',
    );

    expect(suggestion.kind).toBe('rain');
  });

  it('recomenda protetor solar quando o UV chega a 6 sem alerta de chuva', () => {
    const suggestion = getWeatherSuggestion([hour({ uvIndex: 6 })], '2026-06-16T12:00');

    expect(suggestion).toMatchObject({ kind: 'sun', message: 'Não esqueça o protetor solar.' });
  });

  it('recomenda uma japona a 10 °C quando não há alertas prioritários', () => {
    const suggestion = getWeatherSuggestion([hour({ temperature: 10 })], '2026-06-16T12:00');

    expect(suggestion).toMatchObject({ kind: 'cold', message: 'Leve uma japona.' });
  });

  it('ignora horas passadas e considera somente as próximas três', () => {
    const suggestion = getWeatherSuggestion(
      [
        hour({ time: '2026-06-16T11:00', precipitationProbability: 90 }),
        hour({ time: '2026-06-16T12:00' }),
        hour({ time: '2026-06-16T13:00' }),
        hour({ time: '2026-06-16T14:00' }),
        hour({ time: '2026-06-16T15:00', uvIndex: 9 }),
      ],
      '2026-06-16T12:00',
    );

    expect(suggestion.kind).toBe('neutral');
  });

  it('não infere uma sugestão quando não há dados horários suficientes', () => {
    expect(getWeatherSuggestion([], '2026-06-16T12:00').kind).toBe('unavailable');
    expect(
      getWeatherSuggestion(
        [hour({ temperature: null, precipitationProbability: null, uvIndex: null })],
        '2026-06-16T12:00',
      ).kind,
    ).toBe('unavailable');
  });
});
