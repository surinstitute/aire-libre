<div align="center">

#  Aire Libre

**Plataforma de visualización de calidad del aire y equidad ambiental**
**para la Zona Metropolitana del Valle de México**

[![Vercel](https://img.shields.io/badge/deploy-Vercel-000?logo=vercel&logoColor=white)](https://aire-libre-tawny.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL_JS-4264FB?logo=mapbox&logoColor=white)](https://mapbox.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D-000?logo=threedotjs&logoColor=white)](https://threejs.org)

[Ver en vivo](https://aire-libre-tawny.vercel.app) · [Reportar bug](https://github.com/surinstitute/aire-libre/issues) · [Solicitar feature](https://github.com/surinstitute/aire-libre/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Stack técnico](#-stack-técnico)
- [Inicio rápido](#-inicio-rápido)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Base de datos](#-base-de-datos)
- [Modelos 3D](#-modelos-3d)
- [Deploy](#-deploy)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## Sobre el proyecto

Aire Libre nace de la premisa de que **vivir bajo el mismo cielo no significa estar igual de protegidos**. Es una herramienta interactiva que permite a las personas conocer su nivel de exposición a la contaminación del aire, entender las desigualdades ambientales de su entorno y tomar acción.

La plataforma integra datos de **2,251 colonias** de la CDMX y Zona Metropolitana, combinando información sobre calidad del aire, salud, condiciones socioeconómicas y resiliencia climática en un **Índice de Equidad y Resiliencia**.

Desarrollado para el [Instituto del Sur Urbano](https://sur.institute) en colaboración con [Breathe Cities](https://breathecities.org).

---

## Funcionalidades

### Mapa de Equidad y Resiliencia
- Visualización interactiva de 2,251 colonias con Mapbox GL JS y vector tiles
- Coloreo por nivel de equidad: mejor (verde), promedio (amarillo), bajo (rojo)
- Panel detallado por colonia con 4 secciones: contaminantes, salud, socioeconómico y cambio climático
- Tooltips informativos con modales explicativos para cada indicador
- Filtros dinámicos y búsqueda por código postal
- Modelo 3D animado del pájaro mascota integrado en el mapa

### Test de Exposición
- 7 preguntas organizadas en 4 bloques temáticos
- Calculadora de aire diario personalizada (peso + estatura)
- Scoring en 2 ejes: **Contexto** (morado) e **Individuo** (rosa)
- Matriz 3×3 que asigna 1 de 5 perfiles de pájaro según la combinación de ejes
- Resultados estilo **Spotify Wrapped**: 8 slides con datos personalizados, animaciones y paletas de color únicas

### Perfiles de Pájaro
| Perfil | Contexto | Individuo | Significado |
|--------|----------|-----------|-------------|
| 🐦 Gorrión Cantor | Favorable | Resistente | Exposición y vulnerabilidad muy bajas |
| 🕊️ Tortolita Luchona | Favorable/Moderado | Moderado/Resistente | Exposición moderada |
| 🐦 Paloma Común | Moderado | Moderado | Vulnerabilidad biológica o exposición frecuente |
| 🐦 Jilguero Cansado | Perjudicial | Resistente | Alta exposición estructural |
| 🐦 Canario en Alerta | Perjudicial | Sensible | Entorno exigente + cuerpo sensible |

### Compartir resultados
- Generación de imagen por slide con Canvas API
- Tarjetas con la paleta de colores y tipografía de cada slide
- Compartir vía Web Share API (mobile), Twitter y Facebook
- Descarga directa como PNG

### Preguntas Posibles (FAQ)
- 14 preguntas frecuentes en formato acordeón
- Temas: edad, tabaco, embarazo, factores socioeconómicos, pájaros, SEDEMA, cambio climático, derechos humanos

### Diseño
- Identidad visual consistente: gradiente azul, tipografías Lilita One / Bebas Neue / Space Mono
- NavBar compartido con logos de Sur Institute y Breathe Cities
- Modelos 3D animados con Three.js GLTFLoader y AnimationMixer (skinned mesh, 67 joints)

---

## Stack técnico

| Componente | Tecnología |
|------------|-----------|
| **Frontend** | React 18 + TypeScript + Vite 7 |
| **Base de datos** | Supabase (PostgreSQL) — 2,251 colonias |
| **Mapa** | Mapbox GL JS (vector tiles) |
| **3D** | Three.js — GLTFLoader + AnimationMixer (skinned mesh) |
| **Deploy** | Vercel (auto-deploy desde GitHub) |
| **Tipografías** | Lilita One, Bebas Neue, Space Mono (Google Fonts) |

---

## Inicio rápido

### Requisitos previos

- [Node.js](https://nodejs.org) 18 o superior
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/surinstitute/aire-libre.git

# Entrar al directorio
cd aire-libre

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección siguiente)

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase — Base de datos
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key

# Mapbox — Mapa interactivo
VITE_MAPBOX_TOKEN=tu_mapbox_token
```

### Dónde obtener las credenciales

| Variable | Dónde obtenerla |
|----------|----------------|
| `VITE_SUPABASE_URL` | [supabase.com](https://supabase.com) → Tu proyecto → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | [supabase.com](https://supabase.com) → Tu proyecto → Settings → API → anon/public key |
| `VITE_MAPBOX_TOKEN` | [mapbox.com](https://account.mapbox.com/access-tokens) → Account → Access Tokens |

> **Importante:** El archivo `.env` está en `.gitignore` y nunca debe subirse al repositorio.

---

## Estructura del proyecto

```
aire-libre/
├── public/                     # Assets estáticos
├── src/
│   ├── assets/
│   │   ├── models/             # Modelos GLB (bird+frog, paloma, gorrión, canario)
│   │   ├── Logo_SUR25.svg      # Logo Instituto del Sur Urbano
│   │   └── Logo_BreatheCities.svg
│   ├── components/
│   │   ├── Bird/
│   │   │   ├── FrogBirdViewer.tsx       # Viewer bird+frog animado (Home + Mapa)
│   │   │   ├── AnimatedBirdViewer.tsx   # Viewer genérico para cualquier GLB animado
│   │   │   └── BirdResultViewer.tsx     # Wrapper: elige modelo 3D o emoji fallback
│   │   ├── Layout/
│   │   │   ├── NavBar.tsx               # Barra de navegación compartida
│   │   │   └── AppLayout.tsx            # Layout con NavBar fijo + Outlet
│   │   └── Map/
│   │       └── MapView.tsx              # Componente Mapbox GL con vector tiles
│   ├── data/
│   │   ├── quizData.ts                  # Preguntas, scoring y perfiles de pájaros
│   │   ├── birdModels.ts               # Mapeo bird ID → URL del modelo GLB
│   │   ├── cdmx_alcaldias_limites.json
│   │   └── cdmx_perimetro.json
│   ├── pages/
│   │   ├── Home.tsx             # Landing page con modelo 3D animado
│   │   ├── MapExplorer.tsx      # Mapa interactivo de equidad y resiliencia
│   │   ├── Quiz.tsx             # Test de 7 preguntas
│   │   ├── QuizResult.tsx       # Resultados estilo Wrapped (8 slides)
│   │   └── FAQ.tsx              # Preguntas posibles (acordeón)
│   ├── services/
│   │   ├── coloniaService.ts    # Queries a Supabase
│   │   └── supabaseClient.ts    # Cliente Supabase
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript (Colonia, etc.)
│   ├── App.tsx                  # Router principal (BrowserRouter + AppLayout)
│   ├── main.tsx                 # Entry point
│   └── glb.d.ts                 # Declaración de tipos para imports .glb
├── .env                         # Variables de entorno (NO commitear)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

---

## Base de datos

### Tabla principal: `colonias_desarrollo_v12`

- **2,251 registros** — códigos postales de la CDMX y Zona Metropolitana
- **Categorización por terciles** del `indice_resumen`:
  - `alto` (≥ 0.1775) → Mejor equidad — 733 colonias
  - `medio` (0.1651 – 0.1775) → Promedio — 787 colonias
  - `bajo` (< 0.1651) → Bajo — 731 colonias
- **Row Level Security (RLS):** acceso público de lectura habilitado

### Columnas principales

| Categoría | Columnas |
|-----------|----------|
| **Identificación** | codigo_postal, colonias, municipio, estado, latitud, longitud, poblacion_total |
| **Aire** | dias_aire_limpio_pm25, concentracion_alta_pm25, dias_aire_limpio_ozono, concentracion_alta_ozono, subindice_aire |
| **Salud** | poblacion_sensible, pob_sin_diabetes, pob_sin_hipertension, pob_sin_enf_respiratorias, pob_no_fumadores, indice_infraestructura_sanitaria, subindice_salud |
| **Socioeconómico** | subindice_socioeconomico |
| **Clima** | indice_frescura, seguridad_inundaciones, subindice_cambio_climatico |
| **Resumen** | indice_resumen, categoria_riesgo |

---

## Modelos 3D

El proyecto usa modelos GLB con rig y animaciones (skinned mesh) cargados con Three.js GLTFLoader.

### Modelos disponibles

| Modelo | Archivo | Uso | Estado |
|--------|---------|-----|--------|
| Bird + Frog | `Character_ANIMTimeline_05_GLB.glb` | Home, MapExplorer | ✅ Implementado |
| Paloma | `Pigeon_Animations_01_glb.glb` | QuizResult (Paloma Común) | ✅ Implementado |
| Gorrión | `Gorrion_ANIMS_glb.glb` | QuizResult (Gorrión Cantor) | ✅ Implementado |
| Canario | `Canario_ANIMS_glb.glb` | QuizResult (Canario en Alerta) | ✅ Implementado |
| Tortolita | `Tortolit_ANIMS_glb.glb` | QuizResult (Tortolita Luchona) | ✅ Implementado |
| Jilguero | `Jilguero_ANIMS_glb.glb` | QuizResult (Jilguero Cansado) | ✅ Implementado |

### Agregar un nuevo modelo

1. Coloca el archivo `.glb` en `src/assets/models/`
2. Agrega el import en `src/data/birdModels.ts`:
   ```typescript
   import nuevoGlb from '../assets/models/NuevoModelo.glb?url';
   ```
3. Actualiza el mapeo del bird ID correspondiente:
   ```typescript
   tortolita: {
     glbUrl: nuevoGlb,
     animationIndex: 0,
     cameraDistance: 3.5,
     autoRotateSpeed: 0,
     startFrame: 1,
     endFrame: 240,
   },
   ```

---

## Deploy

### Deploy automático

El proyecto se despliega automáticamente en **Vercel** cada vez que se hace push a la rama `main`:

```bash
git add -A
git commit -m "feat: descripción del cambio"
git push origin main
```

Vercel detecta el push, hace build (`tsc -b && vite build`) y despliega en ~20 segundos.

### Deploy manual

Desde el dashboard de Vercel → Deployments → Redeploy.

### Configuración de dominio personalizado

1. Comprar dominio (ej: `airelibre.mx`) en GoDaddy o Akky
2. En Vercel → Settings → Domains → agregar el dominio
3. Configurar DNS en el registrar:
   - **A record:** `76.76.21.21`
   - **CNAME www:** `cname.vercel-dns.com`

### Variables de entorno en Vercel

En Vercel → Settings → Environment Variables, agregar:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MAPBOX_TOKEN`

---

## Equipo

| Rol | Persona | Contacto |
|-----|---------|----------|
| **Desarrollo frontend** | Andy | [@Lounge-Lizard](https://github.com/Lounge-Lizard) |
| **Contenido y copy** | Tamara | Instituto del Sur Urbano |
| **Modelado 3D** | Sebas | — |
| **Cliente** | Instituto del Sur Urbano | [sur.institute](https://sur.institute) |
| **Aliado** | Breathe Cities | [breathecities.org](https://breathecities.org) |

---

## Licencia

Este proyecto es privado y pertenece al [Instituto del Sur Urbano](https://sur.institute). Todos los derechos reservados.

---

<div align="center">

**Porque vivir bajo el mismo cielo no significa estar igual de protegidos.**

Hecho con en la Ciudad de México

</div>