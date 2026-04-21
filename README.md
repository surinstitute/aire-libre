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
- [Metodología de cálculo](#-metodología-de-cálculo)
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

### Preguntas Relacionadas (FAQ)
- 14 preguntas frecuentes en formato acordeón
- Temas: edad, tabaco, embarazo, factores socioeconómicos, pájaros, SEDEMA, cambio climático, derechos humanos

### Recomendaciones
- Acciones a nivel individual y colectivo para mejorar la calidad del aire
- Accesible desde la navegación principal y desde los resultados del test

### Recursos
- Descarga de datos abiertos en formato CSV (datos tabulares) y GeoPackage (datos geoespaciales con geometrías)

### Diseño
- Identidad visual consistente: gradiente azul, tipografías Lilita One / Bebas Neue / Space Mono
- NavBar compartido con logos de Sur Institute y Breathe Cities, menú hamburguesa en mobile
- Modelos 3D animados con Three.js GLTFLoader y AnimationMixer (skinned mesh, 67 joints)
- Diseño responsive: layout adaptativo para mobile (flex column en Home, bottom sheet en MapExplorer, flechas compactas en QuizResult)

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

- [Node.js](https://nodejs.org) 20
- [pnpm](https://pnpm.io/)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/surinstitute/aire-libre.git

# Entrar al directorio
cd aire-libre

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección siguiente)

# Iniciar servidor de desarrollo
pnpm run dev
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

> **Nota sobre Mapbox:** El tileset de polígonos (`loungelizard7.bcqgjoe8`) es público. Cualquier token válido de Mapbox puede acceder a él, no necesita ser de la misma cuenta. Si se desea recrear el tileset en otra cuenta, el GeoJSON fuente se puede extraer del archivo `Base_plataforma.gpkg` (capa `Códigos_postales`).

> **Importante:** El archivo `.env` está en `.gitignore` y nunca debe subirse al repositorio.

---

## Estructura del proyecto

```
aire-libre/
├── public/
│   ├── datos_aire_libre.csv          # Datos tabulares para descarga
│   └── Base_plataforma.gpkg          # GeoPackage completo para descarga
├── src/
│   ├── assets/
│   │   ├── models/             # Modelos GLB (bird+frog, paloma, gorrión, canario, etc.)
│   │   ├── Logo_SUR25.svg
│   │   └── Logo_BreatheCities.svg
│   ├── components/
│   │   ├── Bird/
│   │   │   ├── FrogBirdViewer.tsx       # Viewer bird+frog animado (Home + Mapa)
│   │   │   ├── AnimatedBirdViewer.tsx   # Viewer genérico para cualquier GLB animado
│   │   │   └── BirdResultViewer.tsx     # Wrapper: elige modelo 3D o emoji fallback
│   │   ├── Layout/
│   │   │   ├── NavBar.tsx               # Barra de navegación + menú hamburguesa mobile
│   │   │   ├── AppLayout.tsx            # Layout con NavBar fijo + CSS var(--header-height)
│   │   │   └── Footer.tsx               # Footer con redes sociales
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
│   │   ├── FAQ.tsx              # Preguntas posibles (acordeón)
│   │   ├── Recommendations.tsx  # ¿Qué hago yo con todo esto?
│   │   └── Resources.tsx        # Descarga de datos (CSV + GeoPackage)
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

## Routing

```
/ ........................ Home (landing con modelo 3D)
/map ..................... MapExplorer (mapa de equidad, header propio)
/quiz .................... Quiz (test de 7 preguntas, footer propio)
/quiz/resultado .......... QuizResult (slides fullscreen, sin NavBar)
/faq ..................... FAQ (preguntas posibles)
/recomendaciones ......... Recommendations (acciones individuales y colectivas)
/resources ............... Resources (descarga de datos)
```

---

## Base de datos

### Tabla principal: `colonias`

- **~2,194 registros** — códigos postales de la CDMX y Zona Metropolitana (excluidos CPs sin datos)
- **Categorización por terciles** del `indice_desarrollo`:
  - `alto` → Mejor equidad (verde) — ~731 colonias
  - `medio` → Promedio (amarillo) — ~731 colonias
  - `bajo` → Baja equidad (rojo) — ~732 colonias
- **Row Level Security (RLS):** acceso público de lectura habilitado

### Columnas principales

| Categoría | Columnas |
|-----------|----------|
| **Identificación** | codigo_postal, colonias, municipio, estado, latitud, longitud, poblacion_total |
| **Aire** | dias_aire_limpio_pm25, concentracion_alta_pm25, dias_aire_limpio_ozono, concentracion_alta_ozono, subindice_aire |
| **Salud** | poblacion_sensible, pob_sin_diabetes, pob_sin_hipertension, pob_sin_enf_respiratorias, pob_no_fumadores, indice_infraestructura_sanitaria, subindice_salud |
| **Socioeconómico** | subindice_socioeconomico |
| **Clima** | indice_frescura, seguridad_inundaciones, subindice_cambio_climatico |
| **Índices finales** | indice_desarrollo, indice_prioridad_sensible, indice_resumen, categoria_riesgo |

---

## Metodología de cálculo

### Fuente de datos

Los datos provienen del GeoPackage `Base_plataforma.gpkg`, que integra información de múltiples fuentes públicas para la Zona Metropolitana del Valle de México. El archivo contiene 3 capas geoespaciales: códigos postales (con todos los indicadores), límites municipales y límites estatales.

### Índice de Equidad y Resiliencia

El índice evalúa qué tan cerca está cada código postal de ofrecer un entorno justo y saludable. Integra **4 dimensiones**:

#### 1. Exposición a contaminantes (`subindice_aire`)
Evalúa la calidad del aire a nivel local considerando dos contaminantes principales:
- **PM2.5:** Días al año con aire limpio (norma OMS) + calidad en días malos
- **Ozono:** Días al año con aire limpio (norma OMS) + calidad en días malos
- Se calcula una calificación general del aire que combina ambos contaminantes

#### 2. Salud y acceso a servicios (`subindice_salud`)
Considera la vulnerabilidad biológica de la población y su capacidad de respuesta:
- **Población sensible por edad:** Proporción de menores de 12 y mayores de 64 años
- **Condiciones preexistentes:** Prevalencia de diabetes, hipertensión, enfermedades respiratorias y cardiovasculares
- **Factores de riesgo:** Proporción de fumadores
- **Acceso a salud:** Densidad de infraestructura sanitaria (médicos, enfermería, camas), derechohabiencia y proximidad a servicios

#### 3. Condiciones socioeconómicas (`subindice_socioeconomico`)
Refleja la capacidad de la población para protegerse y adaptarse:
- Años promedio de escolaridad
- Acceso a internet, lavadora y refrigerador como indicadores de bienestar material

#### 4. Resiliencia climática (`subindice_cambio_climatico`)
Evalúa la capacidad del territorio para enfrentar eventos climáticos extremos:
- **Frescura (`indice_frescura`):** Capacidad de la colonia para disipar calor (cobertura vegetal, albedo, densidad urbana)
- **Seguridad ante inundaciones (`seguridad_inundaciones`):** Vulnerabilidad del territorio ante lluvias extremas

### Índice de Desarrollo (`indice_desarrollo`)

Combina los 4 subíndices en un valor normalizado entre 0 y 1. **Valores más altos = mejores condiciones.**

### Categorización por terciles

Los códigos postales se dividen en 3 grupos iguales (terciles) usando la función `NTILE(3)` de PostgreSQL sobre el `indice_desarrollo` ordenado de menor a mayor:

| Tercil | Categoría | Color | Significado |
|--------|-----------|-------|-------------|
| 1 (inferior) | `bajo` | 🔴 Rojo | Tercio con menor desarrollo — mayor desventaja |
| 2 (medio) | `medio` | 🟡 Amarillo | Tercio intermedio |
| 3 (superior) | `alto` | 🟢 Verde | Tercio con mejor desarrollo — mejores condiciones |

```sql
-- Query usada para categorizar
UPDATE colonias
SET categoria_riesgo = sub.nueva_categoria
FROM (
  SELECT codigo_postal,
    CASE
      WHEN NTILE(3) OVER (ORDER BY indice_desarrollo ASC) = 1 THEN 'bajo'
      WHEN NTILE(3) OVER (ORDER BY indice_desarrollo ASC) = 2 THEN 'medio'
      WHEN NTILE(3) OVER (ORDER BY indice_desarrollo ASC) = 3 THEN 'alto'
    END as nueva_categoria
  FROM colonias
  WHERE indice_desarrollo IS NOT NULL
) sub
WHERE colonias.codigo_postal = sub.codigo_postal;
```

> **Nota importante:** La variable de referencia para el coloreado del mapa es `indice_desarrollo` (donde alto = bueno = verde). NO confundir con `indice_prioridad_sensible` donde la escala es inversa (alto = más riesgo = rojo).

### Scoring del Test (Quiz)

El test evalúa a cada persona en 2 ejes independientes:

#### Eje Contexto (0–6 puntos)
Mide las condiciones del entorno donde vive la persona:
- **Código postal:** Se obtiene la `categoria_riesgo` del CP (`alto`=0, `medio`=1, `bajo`=2)
- **Movilidad:** Tipo de transporte principal
- **Zona:** Proximidad a vías rápidas o zonas industriales

Categorización: Favorable (≤2), Moderado (3–4), Perjudicial (5+)

#### Eje Individuo (0–7 puntos)
Mide la vulnerabilidad biológica personal:
- **Edad:** Rangos de mayor o menor susceptibilidad
- **Ejercicio:** Nivel de actividad física al aire libre
- **Tabaco:** Fumador activo o pasivo
- **Condiciones de salud:** Enfermedades preexistentes (multi-select)

Categorización: Resistente (≤2), Moderado (3–5), Sensible (6+)

#### Matriz de perfiles 3×3

La combinación de ambos ejes (cada uno en 3 categorías: 0, 1, 2) produce una matriz que asigna el perfil de pájaro:

```
                Individuo
              0         1         2
Contexto 0  Gorrión   Tortolita  Paloma
         1  Tortolita  Paloma    Canario
         2  Jilguero   Canario   Canario
```

#### Calculadora de aire diario (opcional)
Si el usuario ingresa peso y estatura, se calcula el volumen de aire que respira al día considerando su edad y nivel de ejercicio. El cálculo usa la tasa de ventilación pulmonar (litros/minuto) ajustada por actividad y el tiempo estimado en cada nivel de actividad.

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

### Interacción

Los modelos 3D son de solo visualización — no responden a interacción del usuario (drag/touch deshabilitado). La animación se reproduce automáticamente en loop. El `FrogBirdViewer` soporta cambio de animación vía prop (`idle`, `fly`, `surprise`).

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

## Datos abiertos

Los datos del proyecto están disponibles para descarga en la página de [Recursos](https://aire-libre-tawny.vercel.app/resources):

| Formato | Contenido | Tamaño |
|---------|-----------|--------|
| **CSV** | Datos tabulares (índices, indicadores por CP) | ~500 KB |
| **GeoPackage** | Datos + geometrías (polígonos CP, límites municipales/estatales) | ~18 MB |

El GeoPackage (`Base_plataforma.gpkg`) contiene 3 capas:
- `Códigos_postales` — 2,249 features con todos los indicadores + polígonos
- `Límite_municipal` — 67 municipios de la ZMVM
- `Límite_estatal` — 32 estados (referencia nacional)

Para recrear el tileset de Mapbox: extraer la capa `Códigos_postales` como GeoJSON (con `ogr2ogr` o GeoPandas), mantener solo la columna `codigo_postal`, y subir a Mapbox Studio como nuevo tileset. Luego actualizar `TILESET_ID` y `SOURCE_LAYER` en `MapView.tsx`.

---

## Equipo

| Rol | Persona | Contacto |
|-----|---------|----------|
| **Desarrollo frontend** | Andy | [@Lounge-Lizard](https://github.com/Lounge-Lizard) |
| **Desarrollo (Sur)** | roicort | [@roicort](https://github.com/roicort) |
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

Hecho con ❤️ en la Ciudad de México

</div>
