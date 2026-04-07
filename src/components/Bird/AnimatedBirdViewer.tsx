import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface AnimatedBirdViewerProps {
  /** URL to the GLB file (use Vite ?url import) */
  glbUrl: string;
  width?: number | string;
  height?: number | string;
  autoRotateSpeed?: number;
  backgroundColor?: string | null;
  cameraDistance?: number;
  /** Animation clip index to play (default: 0) */
  animationIndex?: number;
  /** Optional: start frame for subclip (at 24 FPS) */
  startFrame?: number;
  /** Optional: end frame for subclip (at 24 FPS) */
  endFrame?: number;
  /** Called when model is loaded. Passes a snapshot function */
  onReady?: (snapshot: () => string | null) => void;
}

export default function AnimatedBirdViewer({
  glbUrl,
  width = '100%',
  height = '500px',
  autoRotateSpeed = 0.3,
  backgroundColor = null,
  cameraDistance = 3.5,
  animationIndex = 0,
  startFrame,
  endFrame,
  onReady,
}: AnimatedBirdViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let w = container.clientWidth;
    let h = container.clientHeight;
    let animId = 0;
    let mixer: THREE.AnimationMixer | null = null;
    let pivot: THREE.Group | null = null;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const orbitAngle = { x: 0.1, y: 0.3 };
    let prevTime = performance.now();
    let firstRenderDone = false;

    // Scene
    const scene = new THREE.Scene();
    if (backgroundColor) scene.background = new THREE.Color(backgroundColor);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0.3, cameraDistance);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: !backgroundColor,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -2, -4);
    scene.add(rimLight);

    // Animation loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!firstRenderDone) return;

      const now = performance.now();
      const delta = (now - prevTime) / 1000;
      prevTime = now;

      if (mixer) mixer.update(delta);

      if (pivot) {
        if (!isDragging && autoRotateSpeed > 0) {
          orbitAngle.y += autoRotateSpeed * delta;
        }
        pivot.rotation.x = orbitAngle.x;
        pivot.rotation.y = orbitAngle.y;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        const model = gltf.scene;

        // Normalize scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(2.0 / maxDim);

        // Center
        const box2 = new THREE.Box3().setFromObject(model);
        const center = box2.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Pivot
        pivot = new THREE.Group();
        pivot.add(model);
        pivot.rotation.x = orbitAngle.x;
        pivot.rotation.y = orbitAngle.y;
        scene.add(pivot);

        // Animation
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const idx = Math.min(animationIndex, gltf.animations.length - 1);
          let clip = gltf.animations[idx];

          // Cut subclip if frame range specified
          if (startFrame !== undefined && endFrame !== undefined) {
            clip = THREE.AnimationUtils.subclip(clip, clip.name + '_sub', startFrame, endFrame, 24);
          }

          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.enabled = true;
          action.timeScale = 1;
          action.play();

          // Force first frame pose before rendering to prevent T-pose flash
          mixer.update(0);
        }

        // Snapshot function
        if (onReady) {
          onReady(() => {
            renderer.render(scene, camera);
            return renderer.domElement.toDataURL('image/png');
          });
        }

        prevTime = performance.now();
        firstRenderDone = true;
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[AnimatedBirdViewer] Load error:', err);
        setError('No se pudo cargar el modelo 3D');
        setLoading(false);
      }
    );

    // Resize
    const handleResize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse controls
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      orbitAngle.y += (e.clientX - prevMouse.x) * 0.008;
      orbitAngle.x += (e.clientY - prevMouse.y) * 0.008;
      orbitAngle.x = Math.max(-1.2, Math.min(1.2, orbitAngle.x));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => { isDragging = false; };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (mixer) mixer.stopAllAction();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };

    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, [glbUrl]); // re-mount if glbUrl changes

  return (
    <div style={{ position: 'relative', width, height }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab', borderRadius: '12px', overflow: 'hidden' }} />
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>Cargando...</div>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: 12, color: '#fca5a5', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{error}</div>
        </div>
      )}
    </div>
  );
}
