// ============================================================
// AIRE LIBRE — Quiz Configuration
// ============================================================
// Preguntas basadas en páginas 1-3 del PDF del cliente.
// Scoring basado en la matriz de págs 16-18, adaptado.
// Pájaros: versión nueva (Gorrión Cantor, Paloma, etc.)
//
// Para modificar preguntas: edita el array quizQuestions.
// Para modificar scoring: edita las funciones calculate*.
// Para agregar recomendaciones: llena los arrays en birdProfiles.
// ============================================================

// -----------------------------------------------------------
// TYPES
// -----------------------------------------------------------

export type QuestionType =
  | 'text'        // Free text input (código postal)
  | 'number'      // Numeric input (peso, estatura)
  | 'single'      // Single selection
  | 'multi';      // Multiple selection

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  block: number;          // 1-4 (visual grouping)
  blockTitle: string;
  blockSubtitle?: string;
  question: string;
  helpText?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  suffix?: string;        // e.g., "kg", "cm"
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface BirdProfile {
  id: string;
  name: string;
  emoji: string;
  scoreRange: [number, number];
  subtitle: string;
  narrative: string;
  recommendations: string[];
  closingLine?: string;
}

// -----------------------------------------------------------
// QUESTIONS (11 preguntas, 4 bloques — págs 1-3 del PDF)
// -----------------------------------------------------------

export const quizQuestions: QuizQuestion[] = [
  // BLOQUE 1 — ¿DÓNDE ESTÁ TU NIDO?
  {
    id: 'codigoPostal',
    block: 1,
    blockTitle: '¿Dónde está tu nido?',
    blockSubtitle:
      'Con tu código postal vamos a saber qué tan cerca estás de vías rápidas, áreas verdes y la calidad promedio del aire en tu zona.',
    question: '¿Cuál es tu código postal?',
    helpText: 'Ingresa el código postal donde pasas más tiempo.',
    type: 'text',
    placeholder: 'Ej: 06600',
    required: true,
  },

  // BLOQUE 2 — TU SALUD Y TU CUERPO DE AVE
  {
    id: 'edad',
    block: 2,
    blockTitle: 'Tu salud y tu cuerpo de ave',
    question: '¿Cuántos años tienes?',
    type: 'single',
    options: [
      { label: 'Menor de 12 años', value: 'menor12' },
      { label: '12–64 años', value: '12a64' },
      { label: '65 años o más', value: 'mayor65' },
    ],
    required: true,
  },
  {
    id: 'peso',
    block: 2,
    blockTitle: 'Tu salud y tu cuerpo de ave',
    question: '¿Cuánto pesas?',
    helpText: 'Este dato se usa para calcular cuántos litros de aire respiras al día.',
    type: 'number',
    placeholder: 'Ej: 70',
    suffix: 'kg',
    required: true,
  },
  {
    id: 'estatura',
    block: 2,
    blockTitle: 'Tu salud y tu cuerpo de ave',
    question: '¿Cuántos centímetros mides?',
    helpText: 'Este dato se usa para calcular cuántos litros de aire respiras al día.',
    type: 'number',
    placeholder: 'Ej: 170',
    suffix: 'cm',
    required: true,
  },
  {
    id: 'fuma',
    block: 2,
    blockTitle: 'Tu salud y tu cuerpo de ave',
    question: '¿Fumas tabaco, vapeador o algún producto de tabaco calentado?',
    type: 'single',
    options: [
      { label: 'Nunca he fumado', value: 'nunca' },
      { label: 'Dejé de fumar', value: 'exfumador' },
      { label: 'Sí, fumo', value: 'fuma' },
    ],
    required: true,
  },
  {
    id: 'condicionesSalud',
    block: 2,
    blockTitle: 'Tu salud y tu cuerpo de ave',
    question: '¿Tienes alguna condición de salud preexistente?',
    helpText: 'Puedes seleccionar más de una opción.',
    type: 'multi',
    options: [
      { label: 'Ninguna', value: 'ninguna' },
      { label: 'Asma u otra enfermedad respiratoria crónica', value: 'asma' },
      { label: 'Tuberculosis u otra infección respiratoria', value: 'tuberculosis' },
      { label: 'Enfermedad cardiovascular', value: 'cardiovascular' },
      { label: 'Diabetes', value: 'diabetes' },
      { label: 'Hipertensión', value: 'hipertension' },
    ],
    required: true,
  },

  // BLOQUE 3 — ¿QUÉ TAN FUERTE ES TU ESCUDO?
  {
    id: 'redesApoyo',
    block: 3,
    blockTitle: '¿Qué tan fuerte es tu escudo?',
    question: '¿Qué tan acompañado/a te sientes por tu comunidad o redes cercanas?',
    type: 'single',
    options: [
      { label: 'Tengo redes de apoyo sólidas', value: 'solidas' },
      { label: 'Tengo algunas personas de apoyo', value: 'algunas' },
      { label: 'Me siento aislado/a', value: 'aislado' },
    ],
    required: true,
  },
  {
    id: 'accesoInfo',
    block: 3,
    blockTitle: '¿Qué tan fuerte es tu escudo?',
    question:
      '¿Qué tan fácil es para ti acceder a información sobre salud o medio ambiente?',
    helpText: 'Alertas, recomendaciones, servicios de salud.',
    type: 'single',
    options: [
      { label: 'Muy fácil', value: 'facil' },
      { label: 'Algo difícil', value: 'algo' },
      { label: 'Muy difícil', value: 'dificil' },
    ],
    required: true,
  },

  // BLOQUE 4 — TUS HÁBITOS DE VUELO
  {
    id: 'ejercicio',
    block: 4,
    blockTitle: 'Tus hábitos de vuelo',
    question: '¿Cuántas veces a la semana realizas ejercicio?',
    type: 'single',
    options: [
      { label: 'No realizo ejercicio', value: 'ninguno' },
      { label: '1–2 días', value: '1a2' },
      { label: '3 días o más', value: '3omas' },
    ],
    required: true,
  },
  {
    id: 'transporte',
    block: 4,
    blockTitle: 'Tus hábitos de vuelo',
    question: '¿Cuál es tu medio de transporte más utilizado?',
    type: 'single',
    options: [
      { label: 'A pie', value: 'pie' },
      { label: 'Bicicleta', value: 'bici' },
      { label: 'Metro, metrobús, RTP, cablebús', value: 'metro' },
      { label: 'Automóvil', value: 'auto' },
      { label: 'Motocicleta', value: 'moto' },
      { label: 'Peseros, combis, mototaxis', value: 'pesero' },
    ],
    required: true,
  },
  {
    id: 'tiempoTraslado',
    block: 4,
    blockTitle: 'Tus hábitos de vuelo',
    question: '¿Cuánto tiempo dedicas a traslados diariamente?',
    type: 'single',
    options: [
      { label: 'Menos de 30 min', value: 'menos30' },
      { label: '30–60 min', value: '30a60' },
      { label: '1–2 horas', value: '1a2h' },
      { label: '2–3 horas', value: '2a3h' },
      { label: 'Más de 3 horas', value: 'mas3h' },
    ],
    required: true,
  },
];

// -----------------------------------------------------------
// SCORING
// -----------------------------------------------------------
// Exposición (0–10): CP + transporte + traslado + redes + acceso
// Vulnerabilidad (0–10): edad + condiciones + tabaco + ejercicio
// Total = 0–20 → asigna pájaro
// -----------------------------------------------------------

export function getExposureFromCP(
  riskLevel: 'bajo' | 'medio' | 'alto'
): number {
  const map: Record<string, number> = {
    bajo: 0,
    medio: 2,
    alto: 3,
  };
  return map[riskLevel] ?? 1;
}

export function calculateExposure(
  cpRiskLevel: 'bajo' | 'medio' | 'alto',
  answers: QuizAnswers
): number {
  let score = 0;

  // CP risk (0-3)
  score += getExposureFromCP(cpRiskLevel);

  // Transport (0-2)
  const transportMap: Record<string, number> = {
    pie: 0,
    bici: 0,
    metro: 1,
    auto: 2,
    moto: 2,
    pesero: 2,
  };
  score += transportMap[answers.transporte as string] ?? 1;

  // Commute time (0-2)
  const commuteMap: Record<string, number> = {
    menos30: 0,
    '30a60': 1,
    '1a2h': 2,
    '2a3h': 2,
    mas3h: 2,
  };
  score += commuteMap[answers.tiempoTraslado as string] ?? 1;

  // Support networks (0-1)
  const redesMap: Record<string, number> = {
    solidas: 0,
    algunas: 0.5,
    aislado: 1,
  };
  score += redesMap[answers.redesApoyo as string] ?? 0;

  // Access to info (0-2)
  const accesoMap: Record<string, number> = {
    facil: 0,
    algo: 1,
    dificil: 2,
  };
  score += accesoMap[answers.accesoInfo as string] ?? 0;

  return Math.min(10, Math.round(score));
}

export function calculateVulnerability(answers: QuizAnswers): number {
  let score = 0;

  // Age (0-2) — <12 and 65+ are sensitive
  const edadMap: Record<string, number> = {
    menor12: 2,
    '12a64': 0,
    mayor65: 2,
  };
  score += edadMap[answers.edad as string] ?? 0;

  // Health conditions (0-3)
  const conditions = answers.condicionesSalud as string[];
  if (conditions && !conditions.includes('ninguna')) {
    const count = conditions.length;
    if (count >= 4) score += 3;
    else if (count >= 2) score += 2;
    else score += 1;
  }

  // Smoking (0-2)
  const fumaMap: Record<string, number> = {
    nunca: 0,
    exfumador: 1,
    fuma: 2,
  };
  score += fumaMap[answers.fuma as string] ?? 0;

  // Exercise — less = more vulnerable (0-2)
  const ejercicioMap: Record<string, number> = {
    '3omas': 0,
    '1a2': 1,
    ninguno: 2,
  };
  score += ejercicioMap[answers.ejercicio as string] ?? 0;

  return Math.min(10, Math.round(score));
}

export function calculateResult(
  cpRiskLevel: 'bajo' | 'medio' | 'alto',
  answers: QuizAnswers
): {
  exposure: number;
  vulnerability: number;
  total: number;
  bird: BirdProfile;
} {
  const exposure = calculateExposure(cpRiskLevel, answers);
  const vulnerability = calculateVulnerability(answers);
  const total = exposure + vulnerability;
  const bird = getBirdByScore(total);
  return { exposure, vulnerability, total, bird };
}

// -----------------------------------------------------------
// AIR CALCULATOR
// -----------------------------------------------------------
// Estimates liters of air breathed per day.
// Uses Mosteller BSA formula + minute ventilation.
// -----------------------------------------------------------

export function calculateDailyAir(
  pesoKg: number,
  estaturaCm: number,
  edadRange: string,
  ejercicio: string
): number {
  // Body Surface Area (Mosteller): sqrt((h_cm × w_kg) / 3600)
  const bsa = Math.sqrt((estaturaCm * pesoKg) / 3600);

  // Resting minute ventilation (L/min), scales with BSA
  let restingVentilation = (bsa / 1.7) * 6;

  // Age adjustment
  if (edadRange === 'menor12') {
    restingVentilation *= 1.2;
  } else if (edadRange === 'mayor65') {
    restingVentilation *= 0.9;
  }

  // Exercise
  let exerciseMinutesPerDay = 0;
  const exerciseVentilation = 40; // L/min during moderate exercise

  if (ejercicio === '3omas') {
    exerciseMinutesPerDay = 60;
  } else if (ejercicio === '1a2') {
    exerciseMinutesPerDay = 25;
  }

  const restMinutes = 1440 - exerciseMinutesPerDay;
  const totalLiters =
    restingVentilation * restMinutes +
    exerciseVentilation * exerciseMinutesPerDay;

  return Math.round(totalLiters);
}

// -----------------------------------------------------------
// BIRD PROFILES (nombres nuevos — págs 3-6 del PDF)
// -----------------------------------------------------------

export const birdProfiles: BirdProfile[] = [
  {
    id: 'gorrion',
    name: 'Gorrión Cantor',
    emoji: '🐦',
    scoreRange: [0, 4],
    subtitle: 'Exposición y vulnerabilidad muy bajas',
    narrative:
      'Tú vuelas ligero. El entorno donde te mueves tiene buena calidad ambiental y tu cuerpo no presenta factores de alta susceptibilidad. Estás en una zona de relativo equilibrio.',
    recommendations: [],
    closingLine:
      'Este equilibrio no es casual: es el resultado de decisiones urbanas.',
  },
  {
    id: 'paloma',
    name: 'Paloma Mensajera',
    emoji: '🐦',
    scoreRange: [5, 8],
    subtitle: 'Exposición moderada',
    narrative:
      'Habitas la ciudad con los ojos abiertos. Hay tráfico, calor y movimiento, pero también margen para protegerte. Este resultado refleja una exposición cotidiana compartida por muchas personas en entornos urbanos, no una condición individual aislada.',
    recommendations: [],
    closingLine:
      'La atención y la información son herramientas clave para moverte con mayor cuidado.',
  },
  {
    id: 'tortolita',
    name: 'Tortolita Luchona',
    emoji: '🐦',
    scoreRange: [9, 12],
    subtitle: 'Vulnerabilidad biológica o exposición frecuente',
    narrative:
      'Percibes con claridad lo que ocurre a tu alrededor. El ambiente –o ciertas características del cuerpo– hacen que el aire afecte tu vida con mayor intensidad. Esto no implica fragilidad, sino mayor necesidad de cuidado.',
    recommendations: [],
    closingLine:
      'Reconocer esta sensibilidad es una forma de fortalecer la protección, no de limitarse.',
  },
  {
    id: 'jilguero',
    name: 'Jilguero Cansado',
    emoji: '🐦',
    scoreRange: [13, 16],
    subtitle: 'Alta exposición estructural',
    narrative:
      'Vuelas mucho, vuelas lejos, pero el entorno pesa. Las condiciones del lugar donde vives o te mueves —tráfico, calor, falta de verde— exigen más energía y cuidado. Este resultado señala una carga ambiental estructural, compartida por muchas personas en la ciudad.',
    recommendations: [],
  },
  {
    id: 'canario',
    name: 'Canario en Alerta',
    emoji: '🐦',
    scoreRange: [17, 20],
    subtitle: 'Entorno exigente + cuerpo sensible',
    narrative:
      'Vives en un entorno que hoy exige más cuidados. El aire, el calor y la forma en que están organizadas nuestras ciudades no siempre juegan a favor, y algunos cuerpos lo resienten antes que otros.',
    recommendations: [],
    closingLine:
      'Cuidarte también es una forma de resistir y de exigir ciudades más justas.',
  },
];

export function getBirdByScore(score: number): BirdProfile {
  const clamped = Math.max(0, Math.min(20, score));
  const found = birdProfiles.find(
    (b) => clamped >= b.scoreRange[0] && clamped <= b.scoreRange[1]
  );
  return found ?? birdProfiles[2]; // fallback to middle
}