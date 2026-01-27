import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import Bird3D from './Bird3D';

interface Bird3DCanvasProps {
  modelPath: string;
}

export default function Bird3DCanvas({ modelPath }: Bird3DCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas 
        style={{ background: 'transparent' }} 
        gl={{ 
          alpha: true,
          antialias: false, // Deshabilitar antialiasing para mejor performance
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false
        }}
        dpr={1} // Limitar device pixel ratio
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={50} />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.6} />
        
        <Suspense fallback={null}>
          <Bird3D modelPath={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
}