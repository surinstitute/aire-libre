import type { QuizAnswers } from '../data/quizData';

export type { QuizAnswers };

export type CategoriaRiesgo = 'bajo' | 'medio' | 'alto' | 'sin_datos';

export interface Colonia {
  // Identificadores
  codigo_postal: string;
  colonias: string;
  
  // Coordenadas y ubicación
  latitud: number;
  longitud: number;
  estado: string;
  municipio: string;
  
  // Condiciones de Salud
  sub_estado_fisico: number;
  subindice_salud: number;
  pob_sin_diabetes: number;
  pob_sin_hipertension: number;
  pob_sin_enf_respiratorias: number;
  pob_sin_infecciones_resp_tb: number;
  pob_sin_enf_cardiovasculares: number;
  
  // Población
  poblacion_sensible: number;
  poblacion_total: number;
  pob_no_fumadores: number;
  
  // Exposición a Contaminantes
  subindice_aire: number;
  dias_aire_limpio_pm25: number;
  concentracion_alta_pm25: number;
  dias_aire_limpio_ozono: number;
  concentracion_alta_ozono: number;
  
  // Acceso a Servicios de Salud
  indice_infraestructura_sanitaria: number;
  proximidad_infraestructura_medica: number;
  pob_derechohabiente: number;
  
  // Socioeconómica
  subindice_socioeconomico: number;
  anos_escolaridad: number;
  viviendas_computadora: number;
  viviendas_lavadora: number;
  viviendas_refrigerador: number;
  
  // Índices Finales
  indice_desarrollo: number;
  indice_prioridad_sensible: number;
  indice_resumen: number;
  
  // Cambio Climático
  subindice_cambio_climatico: number;
  indice_frescura: number;
  seguridad_inundaciones: number;
  
  categoria_riesgo: CategoriaRiesgo;
}

export interface UserSession {
  sessionId: string;
  answers: QuizAnswers;
  codigoPostal?: string;
  colonia?: Colonia;
}
