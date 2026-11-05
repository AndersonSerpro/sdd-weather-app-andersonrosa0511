import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
  WeatherServiceError: class WeatherServiceError extends Error {},
}));

const city: City = {
  id: 1,
  name: 'Lisboa',
  country: 'Portugal',
  latitude: 38.72,
  longitude: -9.14,
};

const weather: WeatherData = {
  city,
  current: {
    time: '2026-06-16T12:00',
    temperature: 20,
    weatherCode: 0,
    humidity: 55,
    windSpeed: 10,
    pressure: 1015,
    precipitation: 0,
  },
  forecast: Array.from({ length: 5 }, (_, index) => ({
    date: `2026-06-${String(16 + index).padStart(2, '0')}`,
    min: 12,
    max: 22,
    weatherCode: 0,
    precipitationProbability: 0,
    windSpeedMax: 18,
  })),
  hourly: [
    {
      time: '2026-06-16T12:00',
      temperature: 20,
      weatherCode: 0,
      precipitationProbability: 20,
      uvIndex: 2,
    },
    {
      time: '2026-06-16T13:00',
      temperature: 21,
      weatherCode: 3,
      precipitationProbability: 70,
      uvIndex: 3,
    },
  ],
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza a marca e o estado inicial vazio', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Qual é o tempo?' })).toBeInTheDocument();
    expect(screen.getByText(/escolha uma opção acima/i)).toBeInTheDocument();
  });

  it('mostra a barra de busca e o alternador de unidade', () => {
    render(<App />);
    expect(screen.getByLabelText(/buscar cidade/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /unidade de temperatura/i })).toBeInTheDocument();
  });

  it('destaca a sugestão e mostra a previsão por hora em tabela acessível', async () => {
    const user = userEvent.setup();
    vi.mocked(getWeather).mockResolvedValue(weather);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ver previsão de Curitiba, Paraná' }));

    expect(await screen.findByRole('heading', { name: 'Leve o guarda-chuva' })).toBeVisible();
    const hourlyTable = screen.getByRole('table', {
      name: 'Condições previstas para cada hora de hoje',
    });
    expect(hourlyTable).toHaveTextContent('12:00');
    expect(hourlyTable).toHaveTextContent('13:00');
    expect(hourlyTable).toHaveTextContent('70%');
  });

  it.each([
    {
      name: 'Curitiba',
      city: {
        id: -1,
        name: 'Curitiba',
        country: 'Brasil',
        admin1: 'Paraná',
        latitude: -25.4284,
        longitude: -49.2733,
      },
    },
    {
      name: 'Maringá',
      city: {
        id: -2,
        name: 'Maringá',
        country: 'Brasil',
        admin1: 'Paraná',
        latitude: -23.4205,
        longitude: -51.9333,
      },
    },
    {
      name: 'Matinhos',
      city: {
        id: -3,
        name: 'Matinhos',
        country: 'Brasil',
        admin1: 'Paraná',
        latitude: -25.8176,
        longitude: -48.5428,
      },
    },
  ])('carrega $name pelo atalho sem geocoding', async ({ name, city: presetCity }) => {
    const user = userEvent.setup();
    vi.mocked(getWeather).mockImplementation(async (city) => ({ ...weather, city }));
    render(<App />);

    await user.click(screen.getByRole('button', { name: `Ver previsão de ${name}, Paraná` }));

    expect(await screen.findByRole('region', { name: 'Clima atual' })).toHaveTextContent(name);
    expect(getWeather).toHaveBeenCalledWith(presetCity);
    expect(searchCities).not.toHaveBeenCalled();
  });

  it('exige seleção explícita antes de carregar a previsão e permite escolher por teclado', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather).mockResolvedValue(weather);
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    const result = await screen.findByRole('button', {
      name: 'Selecionar Lisboa, Portugal',
    });
    expect(result).toHaveFocus();
    expect(getWeather).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('region', { name: 'Clima atual' })).toHaveTextContent('Lisboa');
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(getWeather).toHaveBeenCalledWith(city);
    expect(screen.getByRole('group', { name: /unidade de temperatura/i })).toBeInTheDocument();
  });

  it('preserva a cidade e repete o carregamento após falha de previsão', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(weather);
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByRole('button', { name: 'Selecionar Lisboa, Portugal' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Lisboa');
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(await screen.findByRole('region', { name: 'Clima atual' })).toBeVisible();
    expect(getWeather).toHaveBeenCalledTimes(2);
  });

  it('repete a busca após erro de geocoding sem carregar previsão automaticamente', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([city]);
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/tente novamente/i);
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(
      await screen.findByRole('button', { name: 'Selecionar Lisboa, Portugal' }),
    ).toBeVisible();
    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('anuncia a busca sem resultados como estado vazio', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([]);
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Inexistente');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('status')).toHaveTextContent(/nenhuma cidade encontrada/i);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('expõe o carregamento para tecnologia assistiva', async () => {
    const user = userEvent.setup();
    let resolveWeather: (value: WeatherData) => void = () => {};
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather).mockImplementation(
      () => new Promise((resolve) => (resolveWeather = resolve)),
    );
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByRole('button', { name: 'Selecionar Lisboa, Portugal' }));

    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/carregando/i);
    resolveWeather(weather);
    expect(await screen.findByRole('region', { name: 'Clima atual' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false');
  });
});
