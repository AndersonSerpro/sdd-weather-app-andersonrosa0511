import { expect, type Page, test } from '@playwright/test';

const geocoding = {
  results: [
    {
      id: 1,
      name: 'Seattle',
      country: 'Estados Unidos',
      admin1: 'Washington',
      latitude: 47.6,
      longitude: -122.33,
    },
  ],
};

const forecast = {
  current: {
    time: '2026-06-16T12:00',
    temperature_2m: 0,
    relative_humidity_2m: 80,
    wind_speed_10m: 10,
    surface_pressure: 1015,
    precipitation: 0,
    weather_code: 3,
  },
  daily: {
    time: ['2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20'],
    weather_code: [3, 61, 80, 1, 0],
    temperature_2m_max: [20, 19, 22, 24, 25],
    temperature_2m_min: [12, 11, 13, 14, 15],
    precipitation_probability_max: [20, 90, 70, 10, 0],
    wind_speed_10m_max: [18, 22, 14, 12, 16],
  },
  hourly: {
    time: [
      '2026-06-16T11:00',
      '2026-06-16T12:00',
      '2026-06-16T13:00',
      '2026-06-16T14:00',
      '2026-06-16T15:00',
    ],
    temperature_2m: [19, 20, 21, 22, 22],
    weather_code: [3, 3, 61, 61, 3],
    precipitation_probability: [5, 20, 70, 50, 0],
    uv_index: [1, 2, 2, 2, 2],
  },
};

async function mockApis(page: Page) {
  let forecastRequests = 0;
  await page.route('**/geocoding-api.open-meteo.com/**', (route) =>
    route.fulfill({ json: geocoding }),
  );
  await page.route('**/api.open-meteo.com/**', (route) => {
    forecastRequests += 1;
    return route.fulfill({ json: forecast });
  });
  return () => forecastRequests;
}

test('fluxo completo: buscar → clima atual → previsão → trocar unidade', async ({ page }) => {
  const getForecastRequests = await mockApis(page);
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('Seattle');
  await page.getByRole('button', { name: /buscar/i }).click();
  const cityResult = page.getByRole('button', {
    name: 'Selecionar Seattle, Washington, Estados Unidos',
  });
  await expect(cityResult).toBeFocused();
  expect(getForecastRequests()).toBe(0);
  await cityResult.click();

  await expect(page.getByRole('heading', { name: 'Seattle' })).toBeVisible();
  const forecastRegion = page.getByRole('region', { name: /previsão de 5 dias/i });
  await expect(forecastRegion).toBeVisible();
  const forecastDays = forecastRegion.getByRole('listitem');
  await expect(forecastDays).toHaveCount(5);
  const expectedDays = [
    ['16 Jun', '20°', '12°', '20%', '18 km/h'],
    ['17 Jun', '19°', '11°', '90%', '22 km/h'],
    ['18 Jun', '22°', '13°', '70%', '14 km/h'],
    ['19 Jun', '24°', '14°', '10%', '12 km/h'],
    ['20 Jun', '25°', '15°', '0%', '16 km/h'],
  ];
  for (const [index, expectedValues] of expectedDays.entries()) {
    for (const expectedValue of expectedValues) {
      await expect(forecastDays.nth(index)).toContainText(expectedValue);
    }
  }
  expect(getForecastRequests()).toBe(1);
  const hourlyRegion = page.getByRole('region', { name: 'Previsão de hoje por horário' });
  await expect(hourlyRegion.getByRole('table')).toBeVisible();
  await expect(hourlyRegion.getByRole('row')).toHaveCount(5);
  await expect(hourlyRegion.getByRole('row', { name: /11:00/ })).toHaveCount(0);
  await expect(hourlyRegion.getByRole('row', { name: /12:00/ })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Leve o guarda-chuva');

  // 0°C exibido; após trocar para °F deve virar 32°.
  await expect(page.getByText('0°').first()).toBeVisible();
  await page.getByRole('button', { name: '°F' }).click();
  await expect(page.getByText('32°').first()).toBeVisible();
});

test('estado vazio quando a cidade não existe', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/**', (route) => route.fulfill({ json: {} }));
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('xyzxyz');
  await page.getByRole('button', { name: /buscar/i }).click();

  await expect(page.getByText(/nenhuma cidade encontrada/i)).toBeVisible();
});

test('atalhos carregam as cidades do Paraná sem geocoding', async ({ page }) => {
  let geocodingRequests = 0;
  const forecastLocations: URL[] = [];
  await page.route('**/geocoding-api.open-meteo.com/**', (route) => {
    geocodingRequests += 1;
    return route.fulfill({ json: geocoding });
  });
  await page.route('**/api.open-meteo.com/**', (route) => {
    forecastLocations.push(new URL(route.request().url()));
    return route.fulfill({ json: forecast });
  });
  await page.goto('/');

  const presets = [
    { name: 'Curitiba', latitude: '-25.4284', longitude: '-49.2733' },
    { name: 'Maringá', latitude: '-23.4205', longitude: '-51.9333' },
    { name: 'Matinhos', latitude: '-25.8176', longitude: '-48.5428' },
  ];

  for (const [index, preset] of presets.entries()) {
    await page.getByRole('button', { name: `Ver previsão de ${preset.name}, Paraná` }).click();
    await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText(preset.name);
    expect(forecastLocations[index].searchParams.get('latitude')).toBe(preset.latitude);
    expect(forecastLocations[index].searchParams.get('longitude')).toBe(preset.longitude);
  }

  expect(geocodingRequests).toBe(0);
});

test('salva cidade pesquisada, evita duplicata e persiste sua remoção', async ({ page }) => {
  await mockApis(page);
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('Seattle');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page.getByRole('button', { name: 'Adicionar Seattle às cidades predefinidas' }).click();

  const savedCity = page.getByRole('button', { name: 'Ver previsão de Seattle, Washington' });
  await expect(savedCity).toBeVisible();
  await expect(page.getByText('Adicionada')).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Ver previsão de Seattle, Washington' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Remover Seattle das cidades predefinidas' }).click();
  await expect(
    page.getByRole('button', { name: 'Ver previsão de Seattle, Washington' }),
  ).toHaveCount(0);

  await page.reload();
  await expect(page.getByText('Nenhuma cidade predefinida.')).toBeVisible();
});

test('viewport mobile renderiza o fluxo principal', async ({ page }) => {
  await mockApis(page);
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('Seattle');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page
    .getByRole('button', { name: 'Selecionar Seattle, Washington, Estados Unidos' })
    .click();
  await expect(page.getByRole('heading', { name: 'Seattle' })).toBeVisible();
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth);
});

test('retry recupera forecast após falha sem perder a cidade selecionada', async ({ page }) => {
  let forecastAttempts = 0;
  await page.route('**/geocoding-api.open-meteo.com/**', (route) =>
    route.fulfill({ json: geocoding }),
  );
  await page.route('**/api.open-meteo.com/**', (route) => {
    forecastAttempts += 1;
    if (forecastAttempts === 1) return route.fulfill({ status: 503, body: 'indisponível' });
    return route.fulfill({ json: forecast });
  });
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('Seattle');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page
    .getByRole('button', { name: 'Selecionar Seattle, Washington, Estados Unidos' })
    .click();

  const alert = page.getByRole('alert');
  await expect(alert).toContainText('Seattle');
  await page.getByRole('button', { name: /tentar novamente/i }).click();

  await expect(page.getByRole('region', { name: 'Clima atual' })).toBeVisible();
  expect(forecastAttempts).toBe(2);
});

test('resposta parcial exibe marcadores sem quebrar a previsão', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/**', (route) =>
    route.fulfill({ json: geocoding }),
  );
  await page.route('**/api.open-meteo.com/**', (route) =>
    route.fulfill({
      json: {
        current: { time: '2026-06-16T12:00', temperature_2m: null, weather_code: null },
        daily: { time: forecast.daily.time, temperature_2m_max: [24] },
      },
    }),
  );
  await page.goto('/');

  await page.getByLabel(/buscar cidade/i).fill('Seattle');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page
    .getByRole('button', { name: 'Selecionar Seattle, Washington, Estados Unidos' })
    .click();

  const currentWeather = page.getByRole('region', { name: 'Clima atual' });
  await expect(currentWeather).toContainText('—');
  await expect(currentWeather).toContainText('Condição indisponível');
  await expect(page.getByRole('listitem')).toHaveCount(5);
  await expect(page.locator('body')).not.toContainText(/NaN|undefined/);
});
