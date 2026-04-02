// ============================================================
// AIRE LIBRE — Quiz Configuration (v2)
// ============================================================
// 9 preguntas, 4 bloques.
// Scoring en 2 ejes:
//   MORADO (Contexto): Q1(CP) + Q7(redes) + Q8(acceso) → máx 6
//   ROSA (Individuo):  Q2(edad) + Q5(tabaco) + Q6(condiciones) + Q9(ejercicio) → máx 7
// Cada eje se categoriza: 0=favorable, 1=moderado, 2=perjudicial
// Pájaro se asigna por matriz Contexto×Individuo.
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
  subtitle: string;
  narrative: string;
  recommendations: string[];
  closingLine?: string;
}

// -----------------------------------------------------------
// QUESTIONS (9 preguntas, 4 bloques)
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
    blockSubtitle:
      'Tu cuerpo, tu edad y tus hábitos determinan cómo reaccionas al aire que respiras.',
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
    blockSubtitle:
      'Tu red de apoyo y acceso a información influyen en tu capacidad de protegerte.',
    question: 'Cuando te enfermas, ¿alguien cuida de ti?',
    type: 'single',
    options: [
      { label: 'Sí, tengo buenas redes de apoyo', value: 'solidas' },
      { label: 'A veces, tengo algunas personas de apoyo', value: 'algunas' },
      { label: 'No, nadie', value: 'nadie' },
    ],
    required: true,
  },
  {
    id: 'accesoInfo',
    block: 3,
    blockTitle: '¿Qué tan fuerte es tu escudo?',
    question:
      '¿Qué tan fácil es para ti acceder a información sobre salud o medio ambiente?',
    helpText: 'Alertas, recomendaciones, servicios.',
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
    blockSubtitle:
      'Tu actividad física influye en tu capacidad pulmonar y salud general.',
    question: '¿Cuántas veces a la semana realizas ejercicio?',
    type: 'single',
    options: [
      { label: '2 veces por semana mínimo', value: '2omas' },
      { label: 'De vez en cuando', value: 'aveces' },
      { label: 'No realizo ejercicio', value: 'ninguno' },
    ],
    required: true,
  },
];

// -----------------------------------------------------------
// SCORING — 2 ejes
// -----------------------------------------------------------

/**
 * EJE MORADO (Contexto): Q1 + Q7 + Q8 → raw 0-6
 *   0-2 = Favorable (0)
 *   3-4 = Moderado (1)
 *   5+  = Perjudicial (2)
 */
export function calculateContexto(
  cpRiskLevel: 'bajo' | 'medio' | 'alto',
  answers: QuizAnswers
): { raw: number; category: 0 | 1 | 2 } {
  let raw = 0;

  // Q1: CP risk → 0/1/2
  const cpMap: Record<string, number> = { alto: 0, medio: 1, bajo: 2 };
  raw += cpMap[cpRiskLevel] ?? 1;

  // Q7: Redes de apoyo → 0/1/2
  const redesMap: Record<string, number> = { solidas: 0, algunas: 1, nadie: 2 };
  raw += redesMap[answers.redesApoyo as string] ?? 1;

  // Q8: Acceso a info → 0/1/2
  const accesoMap: Record<string, number> = { facil: 0, algo: 1, dificil: 2 };
  raw += accesoMap[answers.accesoInfo as string] ?? 1;

  // Categorize
  let category: 0 | 1 | 2;
  if (raw <= 2) category = 0;
  else if (raw <= 4) category = 1;
  else category = 2;

  return { raw, category };
}

/**
 * EJE ROSA (Individuo): Q2 + Q5 + Q6 + Q9 → raw 0-8
 *   0-2 = Resistente (0)
 *   3-5 = Medianamente resistente (1)
 *   5+  = Altamente sensible (2)
 */
export function calculateIndividuo(
  answers: QuizAnswers
): { raw: number; category: 0 | 1 | 2 } {
  let raw = 0;

  // Q2: Edad → 0/1
  const edadMap: Record<string, number> = { menor12: 1, '12a64': 0, mayor65: 1 };
  raw += edadMap[answers.edad as string] ?? 0;

  // Q5: Tabaco → 0/1/2
  const fumaMap: Record<string, number> = { nunca: 0, exfumador: 1, fuma: 2 };
  raw += fumaMap[answers.fuma as string] ?? 0;

  // Q6: Condiciones de salud → 0/1/2
  const conditions = (answers.condicionesSalud as string[]) || [];
  if (!conditions.length || conditions.includes('ninguna')) {
    raw += 0;
  } else if (conditions.length <= 2) {
    raw += 1;
  } else {
    raw += 2; // 3 o más
  }

  // Q9: Ejercicio → 0/1/2
  const ejMap: Record<string, number> = { '2omas': 0, aveces: 1, ninguno: 2 };
  raw += ejMap[answers.ejercicio as string] ?? 1;

  // Categorize
  let category: 0 | 1 | 2;
  if (raw <= 2) category = 0;
  else if (raw <= 5) category = 1;
  else category = 2;

  return { raw, category };
}

// -----------------------------------------------------------
// BIRD MATRIX — Contexto × Individuo
// -----------------------------------------------------------
//
//              | Individuo 0  | Individuo 1  | Individuo 2
// -------------|--------------|--------------|-------------
// Contexto 0   | Gorrión      | Tortolita    | Paloma
// Contexto 1   | Tortolita    | Paloma       | Canario
// Contexto 2   | Jilguero     | Canario      | Canario
//

const BIRD_MATRIX: Record<string, string> = {
  '0-0': 'gorrion',
  '0-1': 'tortolita',
  '0-2': 'paloma',
  '1-0': 'tortolita',
  '1-1': 'paloma',
  '1-2': 'canario',
  '2-0': 'jilguero',
  '2-1': 'canario',
  '2-2': 'canario',
};

function getBirdByMatrix(contexto: 0 | 1 | 2, individuo: 0 | 1 | 2): BirdProfile {
  const key = `${contexto}-${individuo}`;
  const birdId = BIRD_MATRIX[key] ?? 'paloma';
  return birdProfiles.find((b) => b.id === birdId) ?? birdProfiles[2];
}

// -----------------------------------------------------------
// MAIN RESULT FUNCTION
// -----------------------------------------------------------

export function calculateResult(
  cpRiskLevel: 'bajo' | 'medio' | 'alto',
  answers: QuizAnswers
): {
  contexto: { raw: number; category: 0 | 1 | 2 };
  individuo: { raw: number; category: 0 | 1 | 2 };
  total: number;
  bird: BirdProfile;
} {
  const contexto = calculateContexto(cpRiskLevel, answers);
  const individuo = calculateIndividuo(answers);
  const total = contexto.raw + individuo.raw;
  const bird = getBirdByMatrix(contexto.category, individuo.category);
  return { contexto, individuo, total, bird };
}

// -----------------------------------------------------------
// AIR CALCULATOR (unchanged)
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

  if (ejercicio === '2omas') {
    exerciseMinutesPerDay = 60;
  } else if (ejercicio === 'aveces') {
    exerciseMinutesPerDay = 25;
  }

  const restMinutes = 1440 - exerciseMinutesPerDay;
  const totalLiters =
    restingVentilation * restMinutes +
    exerciseVentilation * exerciseMinutesPerDay;

  return Math.round(totalLiters);
}

// -----------------------------------------------------------
// BIRD PROFILES
// -----------------------------------------------------------

export const birdProfiles: BirdProfile[] = [
  {
    id: 'gorrion',
    name: 'Gorrión Cantor',
    emoji: '🐦',
    subtitle: 'Exposición y vulnerabilidad muy bajas',
    narrative:
      'Tú vuelas ligero. El entorno donde te mueves tiene buena calidad ambiental y tu cuerpo no presenta factores de alta susceptibilidad. Estás en una zona de relativo equilibrio.',
    recommendations: [
      'Los entornos que funcionan suelen tener verde cercano, menor tráfico y espacios caminables. Cuidarlos es clave para que no se pierdan.',
      'Mantenerse informado/a ayuda a detectar cambios tempranos en el aire y el calor.',
      'Estos contextos muestran que otras formas de ciudad sí son posibles.',
    ],
    closingLine:
      'Este equilibrio no es casual: es el resultado de decisiones urbanas.',
  },
  {
    id: 'tortolita',
    name: 'Tortolita Luchona',
    emoji: '🕊️',
    subtitle: 'Exposición moderada',
    narrative:
      'Habitas la ciudad con los ojos abiertos. Hay tráfico, calor y movimiento, pero también margen para protegerte. Este resultado refleja una exposición cotidiana compartida por muchas personas en entornos urbanos, no una condición individual aislada.',
    recommendations: [],
    closingLine:
      'La atención y la información son herramientas clave para moverte con mayor cuidado.',
  },
  {
    id: 'paloma',
    name: 'Paloma Común',
    emoji: '🐦',
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
    subtitle: 'Alta exposición estructural',
    narrative:
      'Vuelas mucho, vuelas lejos, pero el entorno pesa. Las condiciones del lugar donde vives o te mueves —tráfico, calor, falta de verde— exigen más energía y cuidado. Este resultado señala una carga ambiental estructural, compartida por muchas personas en la ciudad.',
    recommendations: [],
  },
  {
    id: 'canario',
    name: 'Canario en Alerta',
    emoji: '🐦',
    subtitle: 'Entorno exigente + cuerpo sensible',
    narrative:
      'Vives en un entorno que hoy exige más cuidados. El aire, el calor y la forma en que están organizadas nuestras ciudades no siempre juegan a favor, y algunos cuerpos lo resienten antes que otros.',
    recommendations: [],
    closingLine:
      'Cuidarte también es una forma de resistir y de exigir ciudades más justas.',
  },
];
