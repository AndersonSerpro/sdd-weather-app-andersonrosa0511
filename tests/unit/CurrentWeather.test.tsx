import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'Lisboa',
  country: 'Portugal',
  latitude: 38.72,
  longitude: -9.14,
};

const current: CurrentWeatherData = {
  temperature: 20.4,
  weatherCode: 0,
  humidity: null,
  windSpeed: 12.4,
  pressure: 1013.4,
  precipitation: null,
  time: '2026-06-16T12:00',
};

describe('CurrentWeather', () => {
  it('mantém os dados disponíveis e indica campos ausentes', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    const region = screen.getByRole('region', { name: 'Clima atual' });
    expect(region).toHaveTextContent('Lisboa');
    expect(region).toHaveTextContent('20°');
    expect(region).toHaveTextContent('12 km/h');
    expect(region).toHaveTextContent('1013 hPa');
    expect(region).toHaveTextContent('—');
    expect(region).toHaveTextContent('Precipitação');
    expect(screen.getAllByText('—', { exact: true })).toHaveLength(2);
  });

  it('converte a temperatura atual para Fahrenheit', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByRole('region', { name: 'Clima atual' })).toHaveTextContent('69°');
  });

  it('apresenta a precipitação atual em milímetros', () => {
    render(
      <CurrentWeather city={city} current={{ ...current, precipitation: 2.5 }} unit="celsius" />,
    );

    expect(screen.getByRole('region', { name: 'Clima atual' })).toHaveTextContent('2.5 mm');
  });
});
