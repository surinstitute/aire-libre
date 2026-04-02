// ============================================================
// Bird Model Map — associates each bird profile with its 3D model
// ============================================================
// When Seba delivers a new model:
// 1. Put the .glb file in src/assets/models/
// 2. Add the import below
// 3. Update the BIRD_MODELS map
// ============================================================

// ── GLB imports (Vite ?url) ──
// Only import models that exist. Comment out the rest until delivered.

// import gorrionGlb from '../assets/models/Gorrion_Animations.glb?url';
import gorrionGlb from '../assets/models/Gorrion_ANIMS_glb.glb?url';
// import tortolitaGlb from '../assets/models/Tortolita_Animations.glb?url';
import palomaGlb from '../assets/models/Pigeon_Animations_01_glb.glb?url';
// import jilgueroGlb from '../assets/models/Jilguero_Animations.glb?url';
// import canarioGlb from '../assets/models/Canario_Animations.glb?url';
import canarioGlb from '../assets/models/Canario_ANIMS_glb.glb?url';

export interface BirdModelConfig {
  /** URL to the GLB file, or null if model not yet available */
  glbUrl: string | null;
  /** Which animation clip index to play (default: 0) */
  animationIndex: number;
  /** Camera distance for this model */
  cameraDistance: number;
  /** Auto rotate speed */
  autoRotateSpeed: number;
  startFrame?: number;
  endFrame?:number;
}

/**
 * Map of bird profile IDs to their 3D model configuration.
 * Birds without a model yet will show emoji fallback.
 */
export const BIRD_MODELS: Record<string, BirdModelConfig> = {
  gorrion: {
    glbUrl: gorrionGlb, // TODO: waiting for Sebas
    animationIndex: 0,
    cameraDistance: 3.5,
    autoRotateSpeed: 0,
  },
  tortolita: {
    glbUrl: null, // TODO: waiting for Sebas
    animationIndex: 0,
    cameraDistance: 3.5,
    autoRotateSpeed: 0,
  },
  paloma: {
    glbUrl: palomaGlb,
    animationIndex: 0,
    cameraDistance: 3.5,
    autoRotateSpeed: 0,
    startFrame: 1,
    endFrame: 240,
  },
  jilguero: {
    glbUrl: null, // TODO: waiting for Sebas
    animationIndex: 0,
    cameraDistance: 3.5,
    autoRotateSpeed: 0,
  },
  canario: {
    glbUrl: canarioGlb, // TODO: waiting for Sebas
    animationIndex: 0,
    cameraDistance: 3.5,
    autoRotateSpeed: 0,
  },
};
