import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import WeatherSuggestion from '../../src/components/WeatherSuggestion';
import type { WeatherSuggestion as WeatherSuggestionData } from '../../src/lib/weatherSuggestion';

describe('WeatherSuggestion', () => {
  it('destaca a recomendação em uma região anunciada', () => {
    const suggestion: WeatherSuggestionData = {
      kind: 'rain',
      title: 'Leve o guarda-chuva',
      message: 'Há chance de chuva nas próximas horas.',
    };
    render(<WeatherSuggestion suggestion={suggestion} />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Leve o guarda-chuva');
    expect(status).toHaveTextContent('Há chance de chuva nas próximas horas.');
  });
});
