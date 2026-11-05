import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastCard from '../../src/components/ForecastCard';
import type { ForecastDay } from '../../src/types/weather';

const day: ForecastDay = {
  date: '2026-06-16',
  min: null,
  max: 24.6,
  weatherCode: 3,
  precipitationProbability: null,
  windSpeedMax: null,
};

describe('ForecastCard', () => {
  it('mantém os valores disponíveis e indica temperaturas e precipitação ausentes', () => {
    render(
      <ul>
        <ForecastCard day={day} index={0} unit="celsius" />
      </ul>,
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Hoje');
    expect(item).toHaveTextContent('25°');
    expect(item).toHaveTextContent('—');
    expect(item).toHaveTextContent('💧 —');
    expect(item).toHaveTextContent('💨 —');
    expect(screen.getAllByText('—', { exact: true })).toHaveLength(1);
  });

  it('converte os extremos disponíveis para Fahrenheit', () => {
    render(
      <ul>
        <ForecastCard day={{ ...day, min: 10 }} index={0} unit="fahrenheit" />
      </ul>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('76°');
    expect(screen.getByRole('listitem')).toHaveTextContent('50°');
  });

  it('apresenta a probabilidade de precipitação em porcentagem', () => {
    render(
      <ul>
        <ForecastCard day={{ ...day, precipitationProbability: 40 }} index={0} unit="celsius" />
      </ul>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('💧 40%');
  });

  it('apresenta a velocidade máxima do vento', () => {
    render(
      <ul>
        <ForecastCard day={{ ...day, windSpeedMax: 18.4 }} index={0} unit="celsius" />
      </ul>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('💨 18 km/h');
  });
});
