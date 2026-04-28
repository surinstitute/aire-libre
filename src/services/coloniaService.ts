import type { Colonia } from '../types';
import datosAireLibre from '../assets/datos_aire_libre.json';

let coloniasCache: Colonia[] | null = null;

type CsvRow = Record<string, string>;

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRow(row: CsvRow): Colonia {
  return {
    codigo_postal: row.codigo_postal?.padStart(5, '0') ?? '',
    colonias: row.colonias ?? '',
    latitud: parseNumber(row.latitud),
    longitud: parseNumber(row.longitud),
    estado: row.estado ?? '',
    municipio: row.municipio ?? '',
    sub_estado_fisico: parseNumber(row.sub_estado_fisico),
    subindice_salud: parseNumber(row.subindice_salud),
    pob_sin_diabetes: parseNumber(row.pob_sin_diabetes),
    pob_sin_hipertension: parseNumber(row.pob_sin_hipertension),
    pob_sin_enf_respiratorias: parseNumber(row.pob_sin_enf_respiratorias),
    pob_sin_enf_cardiovasculares: parseNumber(row.pob_sin_enf_cardiovasculares),
    pob_sin_infecciones_resp_tb: parseNumber(row.pob_sin_enf_infecciones_resp_tb),
    poblacion_sensible: parseNumber(row.poblacion_sensible),
    poblacion_total: parseNumber(row.poblacion_total),
    pob_no_fumadores: parseNumber(row.pob_no_fumadores),
    subindice_aire: parseNumber(row.subindice_aire),
    dias_aire_limpio_pm25: parseNumber(row.dias_aire_limpio_pm25),
    concentracion_alta_pm25: parseNumber(row.concentracion_alta_pm25),
    dias_aire_limpio_ozono: parseNumber(row.dias_aire_limpio_ozono),
    concentracion_alta_ozono: parseNumber(row.concentracion_alta_ozono),
    indice_infraestructura_sanitaria: parseNumber(row.indice_infraestructura_sanitaria),
    proximidad_infraestructura_medica: parseNumber(row.proximidad_infraestructura_medica),
    pob_derechohabiente: parseNumber(row.pob_derechohabiente),
    subindice_socioeconomico: parseNumber(row.subindice_socioeconomico),
    anos_escolaridad: parseNumber(row.anos_escolaridad),
    viviendas_computadora: parseNumber(row.viviendas_computadora),
    viviendas_lavadora: parseNumber(row.viviendas_lavadora),
    viviendas_refrigerador: parseNumber(row.viviendas_refrigerador),
    indice_desarrollo: parseNumber(row.indice_desarrollo),
    indice_prioridad_sensible: parseNumber(row.indice_prioridad_sensible),
    indice_resumen: parseNumber(row.indice_resumen),
    subindice_cambio_climatico: parseNumber(row.subindice_cambio_climatico),
    indice_frescura: parseNumber(row.indice_frescura),
    seguridad_inundaciones: parseNumber(row.seguridad_inundaciones),
    categoria_riesgo: (row.categoria_riesgo as 'bajo' | 'medio' | 'alto') || 'medio'
  };
}

async function loadColonias(): Promise<Colonia[]> {
  if (coloniasCache) return coloniasCache;

  const rows: CsvRow[] = datosAireLibre as CsvRow[];
  coloniasCache = rows.map(normalizeRow).sort((a, b) => a.codigo_postal.localeCompare(b.codigo_postal));
  return coloniasCache;
}

export const coloniaService = {
  async getAllColonias(): Promise<Colonia[]> {
    return await loadColonias();
  },

  async getColoniaByCP(codigoPostal: string): Promise<Colonia | null> {
    const cpNormalizado = codigoPostal.padStart(5, '0');
    const colonias = await loadColonias();
    return colonias.find((c) => c.codigo_postal === cpNormalizado) ?? null;
  },

  async getColoniasByRiesgo(categoria: 'bajo' | 'medio' | 'alto'): Promise<Colonia[]> {
    const colonias = await loadColonias();
    return colonias.filter((c) => c.categoria_riesgo === categoria);
  },

  async getColoniasByEstado(estado: string): Promise<Colonia[]> {
    const colonias = await loadColonias();
    return colonias.filter((c) => c.estado === estado);
  },

  async getColoniasByMunicipio(municipio: string): Promise<Colonia[]> {
    const colonias = await loadColonias();
    return colonias.filter((c) => c.municipio === municipio);
  }
};
