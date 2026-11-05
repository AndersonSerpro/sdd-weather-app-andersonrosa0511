import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HourlyForecast from '../../src/components/HourlyForecast';
import type { HourlyForecast as HourlyForecastData } from '../../src/types/weather';

const hourly: HourlyForecastData[] = [
  {
    time: '2026-06-16T08:00',
    temperature: 15,
    weatherCode: 3,
    precipitationProbability: null,
    uvIndex: 7,
  },
  {
    time: '2026-06-16T09:00',
    temperature: null,
    weatherCode: null,
    precipitationProbability: 60,
    uvIndex: null,
  },
];

describe('HourlyForecast', () => {
  it('mostra horas, condição, temperatura e precipitação em tabela acessível', () => {
    render(<HourlyForecast hourly={hourly} currentTime="2026-06-16T08:00" unit="celsius" />);

    const table = screen.getByRole('table', {
      name: 'Condições previstas para cada hora de hoje',
    });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByRole('row', { name: /08:00/ })).toHaveTextContent('15°');
    expect(within(table).getByRole('row', { name: /08:00/ })).toHaveTextContent('7');
    expect(within(table).getByRole('row', { name: /09:00/ })).toHaveTextContent('60%');
    expect(within(table).getByRole('row', { name: /09:00/ })).toHaveTextContent('—');
  });

  it('converte a temperatura horária para Fahrenheit', () => {
    render(<HourlyForecast hourly={hourly} currentTime="2026-06-16T08:00" unit="fahrenheit" />);

    expect(screen.getByRole('row', { name: /08:00/ })).toHaveTextContent('59°');
  });

  it('informa quando a série horária está indisponível', () => {
    render(<HourlyForecast hourly={[]} currentTime="2026-06-16T08:00" unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão por hora indisponível.');
  });

  it('esconde horários anteriores ao horário local atual', () => {
    render(<HourlyForecast hourly={hourly} currentTime="2026-06-16T08:30" unit="celsius" />);

    expect(screen.queryByRole('row', { name: /08:00/ })).not.toBeInTheDocument();
    expect(screen.getByRole('row', { name: /09:00/ })).toBeVisible();
  });

  it('informa quando todos os horários de hoje já passaram', () => {
    render(<HourlyForecast hourly={hourly} currentTime="2026-06-16T10:00" unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Não há mais horários previstos para hoje.',
    );
  });
});
