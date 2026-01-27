import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    text: '¿Cuál es tu código postal?',
    inputType: 'text',
    category: 'exposure',
    weight: 2
  },
  {
    id: 2,
    text: '¿Cuánto tiempo pasas al aire libre diariamente?',
    inputType: 'select',
    options: ['Menos de 1 hora', '1-3 horas', '3-6 horas', 'Más de 6 horas'],
    category: 'exposure',
    weight: 3
  },
  {
    id: 3,
    text: '¿Cómo te desplazas principalmente?',
    inputType: 'select',
    options: ['Caminando', 'Bicicleta', 'Transporte público', 'Auto propio', 'Motocicleta'],
    category: 'exposure',
    weight: 3
  },
  {
    id: 4,
    text: '¿Por qué tipo de zonas te mueves regularmente?',
    inputType: 'multiselect',
    options: ['Avenidas principales', 'Calles residenciales', 'Parques', 'Zonas industriales', 'Centro comercial'],
    category: 'exposure',
    weight: 3
  },
  {
    id: 5,
    text: '¿Realizas ejercicio al aire libre?',
    inputType: 'select',
    options: ['Nunca', 'Ocasionalmente', 'Varias veces por semana', 'Diariamente'],
    category: 'exposure',
    weight: 2
  },
  {
    id: 6,
    text: '¿Cuál es tu edad?',
    inputType: 'select',
    options: ['Menor de 18', '18-35', '36-55', '56-70', 'Mayor de 70'],
    category: 'vulnerability',
    weight: 3
  },
  {
    id: 7,
    text: '¿Tienes alguna condición respiratoria?',
    inputType: 'select',
    options: ['No', 'Asma', 'EPOC', 'Alergias respiratorias', 'Otra condición'],
    category: 'vulnerability',
    weight: 4
  },
  {
    id: 8,
    text: '¿Fumas o estás expuesto al humo de tabaco?',
    inputType: 'select',
    options: ['No', 'Fumador ocasional', 'Fumador regular', 'Expuesto a humo de segunda mano'],
    category: 'vulnerability',
    weight: 3
  },
  {
    id: 9,
    text: '¿Tienes acceso a servicios de salud cercanos?',
    inputType: 'select',
    options: ['Sí, a menos de 15 minutos', 'A 15-30 minutos', 'A más de 30 minutos', 'No tengo acceso fácil'],
    category: 'vulnerability',
    weight: 2
  },
  {
    id: 10,
    text: '¿Cuánto tiempo pasas en interiores con ventilación?',
    inputType: 'select',
    options: ['Todo el día con buena ventilación', 'La mayor parte con ventilación regular', 'Poco tiempo', 'Sin ventilación adecuada'],
    category: 'vulnerability',
    weight: 2
  },
  {
    id: 11,
    text: '¿Hay áreas verdes cerca de donde vives?',
    inputType: 'select',
    options: ['Sí, muchas', 'Algunas', 'Pocas', 'Ninguna'],
    category: 'exposure',
    weight: 2
  },
  {
    id: 12,
    text: '¿Cómo calificarías el tráfico en tu zona?',
    inputType: 'select',
    options: ['Muy ligero', 'Ligero', 'Moderado', 'Intenso', 'Muy intenso'],
    category: 'exposure',
    weight: 3
  }
];