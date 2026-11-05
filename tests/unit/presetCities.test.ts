import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_PRESET_CITIES,
  loadPresetCities,
  savePresetCities,
} from '../../src/lib/presetCities';
import type { City } from '../../src/types/weather';

const savedCity: City = {
  id: 501,
  name: 'Londres',
  country: 'Reino Unido',
  latitude: 51.5072,
  longitude: -0.1276,
};

describe('presetCities', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('carrega as cidades padrão quando ainda não há lista salva', () => {
    expect(loadPresetCities()).toEqual(DEFAULT_PRESET_CITIES);
  });

  it('persiste e carrega a lista atualizada', () => {
    savePresetCities([DEFAULT_PRESET_CITIES[0], savedCity]);

    expect(loadPresetCities()).toEqual([DEFAULT_PRESET_CITIES[0], savedCity]);
  });

  it('filtra registros inválidos do armazenamento', () => {
    window.localStorage.setItem('weather-app:preset-cities', JSON.stringify([savedCity, null, {}]));

    expect(loadPresetCities()).toEqual([savedCity]);
  });

  it('aceita lista vazia para permitir remover todos os atalhos', () => {
    savePresetCities([]);

    expect(loadPresetCities()).toEqual([]);
  });
});
