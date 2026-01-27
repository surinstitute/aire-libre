import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface Bird3DProps {
  modelPath: string;
}

export default function Bird3D({ modelPath }: Bird3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const gltf = useGLTF(modelPath);
  const { actions } = useAnimations(gltf.animations, groupRef);
  
  // Convertir materiales PBR a Basic Material (Unlit)
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        if (mesh.material) {
          const oldMaterial = mesh.material as THREE.MeshStandardMaterial;
          
          const newMaterial = new THREE.MeshBasicMaterial({
            map: oldMaterial.map,
            color: oldMaterial.color,
            transparent: oldMaterial.transparent,
            opacity: oldMaterial.opacity,
            alphaTest: oldMaterial.alphaTest,
            side: oldMaterial.side,
          });
          
          mesh.material = newMaterial;
          oldMaterial.dispose();
        }
      }
    });
    
    // Cleanup: Dispose recursos al desmontar
    return () => {
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
    };
  }, [gltf]);
  
  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive 
        object={gltf.scene} 
        scale={75}
        position={[0, -0.8, 0]}
      />
    </group>
  );
}