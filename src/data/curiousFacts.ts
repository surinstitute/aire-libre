export type CuriousFactCategory =
  | 'aves'
  | 'entorno'
  | 'aire'
  | 'edad'
  | 'tabaco'
  | 'actividad-fisica'
  | 'salud'
  | 'derechos';

export interface CuriousFact {
  category: CuriousFactCategory;
  fact: string;
  source: {
    label: string;
    url: string;
  };
}

export const curiousFacts: readonly CuriousFact[] = [
  {
    category: 'aves',
    fact: 'Los mineros llevaban canarios a las minas como alerta ante gases tóxicos. Por eso las aves nos acompañan para hablar del aire que respiramos.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'aves',
    fact: 'Las aves son nuestras acompañantes para recordar los entornos que queremos recuperar: lugares donde respirar sea seguro.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'entorno',
    fact: 'Una mejor calificación de tu colonia no significa ausencia de contaminación: también cuentan la salud, los servicios y las condiciones del entorno.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'entorno',
    fact: 'El concreto sin suficiente vegetación puede atrapar calor y formar islas de calor. Las altas temperaturas favorecen las reacciones que forman ozono.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'aire',
    fact: 'Las partículas PM2.5 son mucho más pequeñas que el grosor de un cabello. Pueden llegar profundamente a los pulmones y algunas pasar a la sangre.',
    source: { label: 'Aire Libre · Metodología', url: '/metodologia' },
  },
  {
    category: 'aire',
    fact: 'El ozono a nivel del suelo no sale directamente de un escape: se forma cuando otros contaminantes reaccionan con la luz solar.',
    source: { label: 'Aire Libre · Metodología', url: '/metodologia' },
  },
  {
    category: 'edad',
    fact: 'Las infancias respiran más rápido y, en proporción a su tamaño, inhalan más aire que los adultos. Sus pulmones todavía están en desarrollo.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'edad',
    fact: 'Con los años, los pulmones pierden elasticidad. Esto puede aumentar la vulnerabilidad de las personas mayores ante el aire contaminado.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'tabaco',
    fact: 'Tus vías respiratorias tienen cilios: pequeñas estructuras que ayudan a expulsar partículas. El humo del tabaco daña esta defensa.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'tabaco',
    fact: 'El humo del tabaco también afecta a quienes no fuman pero comparten el mismo ambiente. Su exposición se conoce como humo de segunda mano.',
    source: { label: 'Aire Libre · Preguntas relacionadas', url: '/faq' },
  },
  {
    category: 'actividad-fisica',
    fact: 'Consultar la calidad del aire antes de hacer ejercicio al aire libre ayuda a elegir cuándo y dónde moverte.',
    source: { label: 'Aire Libre · Recomendaciones', url: '/recomendaciones' },
  },
  {
    category: 'actividad-fisica',
    fact: 'El ozono suele aumentar en tardes soleadas y calurosas. La hora del día también importa al planear actividades al aire libre.',
    source: { label: 'Aire Libre · Metodología', url: '/metodologia' },
  },
  {
    category: 'salud',
    fact: 'El aire contaminado no afecta solo a los pulmones: también puede influir en el corazón y los vasos sanguíneos.',
    source: { label: 'Aire Libre · Metodología', url: '/metodologia' },
  },
  {
    category: 'salud',
    fact: 'La contaminación puede afectar de forma distinta a las personas con asma, diabetes o enfermedades cardiovasculares. La salud previa cambia nuestra sensibilidad.',
    source: { label: 'Aire Libre · Metodología', url: '/metodologia' },
  },
  {
    category: 'derechos',
    fact: 'Respirar aire limpio no es solo una meta personal: el artículo 4 de la Constitución mexicana reconoce el derecho a un medio ambiente sano.',
    source: { label: 'Constitución Política de los Estados Unidos Mexicanos', url: 'https://www.gob.mx' },
  },
  {
    category: 'derechos',
    fact: 'En 2021, el Consejo de Derechos Humanos de la ONU reconoció el derecho a un medio ambiente limpio, saludable y sostenible.',
    source: { label: 'Consejo de Derechos Humanos de la ONU', url: 'https://www.ohchr.org' },
  },
];

export function selectCuriousFact(category: CuriousFactCategory): CuriousFact {
  const candidates = curiousFacts.filter((entry) => entry.category === category);
  if (candidates.length === 0) {
    throw new Error(`No hay datos curiosos configurados para la categoría "${category}".`);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
