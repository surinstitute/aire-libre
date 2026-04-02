import { Suspense, lazy } from 'react';
import { BIRD_MODELS } from '../../data/birdModels';

const AnimatedBirdViewer = lazy(() => import('./AnimatedBirdViewer.tsx'));

interface BirdResultViewerProps {
  /** Bird profile ID from quizData (gorrion, tortolita, paloma, jilguero, canario) */
  birdId: string;
  /** Emoji fallback */
  emoji: string;
  width?: string;
  height?: string;
  /** Called when model is loaded with snapshot function */
  onReady?: (snapshot: () => string | null) => void;
}

/**
 * Renders the 3D animated bird for a quiz result.
 * Falls back to emoji if the model isn't available yet.
 */
export default function BirdResultViewer({
  birdId,
  emoji,
  width = '220px',
  height = '220px',
  onReady,
}: BirdResultViewerProps) {
  const config = BIRD_MODELS[birdId];

  // No model available — show emoji
  if (!config?.glbUrl) {
    return (
      <div style={{
        width, height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '80px',
      }}>
        {emoji}
      </div>
    );
  }

  // Model available — show 3D viewer
  return (
    <Suspense fallback={
      <div style={{
        width, height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '80px',
      }}>
        {emoji}
      </div>
    }>
      <AnimatedBirdViewer
        glbUrl={config.glbUrl}
        width={width}
        height={height}
        autoRotateSpeed={config.autoRotateSpeed}
        backgroundColor={null}
        cameraDistance={config.cameraDistance}
        animationIndex={config.animationIndex}
        onReady={onReady}
        startFrame={config.startFrame}
        endFrame={config.endFrame}
      />
    </Suspense>
  );
}
