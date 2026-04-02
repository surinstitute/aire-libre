import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import glbUrl from '../../assets/models/Character_ANIMTimeline_05_GLB.glb?url';

// ── Animation timeline ──
// Single clip "Take 001" at 24 FPS
// T Pose:   frame 0 - 10
// Idle:     frame 10 - 130  (looped)
// Surprise: frame 140 - 194 (looped)
const FPS = 24;

const ANIMS = {
  tpose:    { name: 'tpose',    start: 0,   end: 1,  loop: false },
  idle:     { name: 'idle',     start: 1,  end: 121, loop: true  },
  surprise: { name: 'surprise', start: 121, end: 191, loop: true  },
  fly:      { name: 'fly',      start: 191, end: 209, loop: true},
} as const;

type AnimationName = keyof typeof ANIMS;

interface FrogBirdViewerProps {
  width?: number | string;
  height?: number | string;
  autoRotateSpeed?: number;
  backgroundColor?: string | null;
  cameraDistance?: number;
  /** Which animation to play: 'idle' | 'surprise' | 'tpose' */
  animation?: AnimationName;
}

export default function FrogBirdViewer({
  width = '100%',
  height = '500px',
  autoRotateSpeed = 0,
  backgroundColor = null,
  cameraDistance = 3.5,
  animation = 'idle',
}: FrogBirdViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const fullClipRef = useRef<THREE.AnimationClip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Main setup (runs once) ──
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
    const orbitAngle = { x: 0, y: 0 };
    let prevTime = performance.now();

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
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 2.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.0);
    rimLight.position.set(0, -2, -4);
    scene.add(rimLight);

    // Animation loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
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
        scene.add(pivot);

        // Setup animation from timeline
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const fullClip = gltf.animations[0];

          // Store refs for reactive animation switching
          mixerRef.current = mixer;
          fullClipRef.current = fullClip;

          console.log(`[FrogBirdViewer] Full clip: "${fullClip.name}" duration: ${fullClip.duration.toFixed(2)}s, tracks: ${fullClip.tracks.length}`);

          // Cut the subclip for the requested animation
          const animDef = ANIMS[animation];
          const subClip = THREE.AnimationUtils.subclip(
            fullClip,
            animDef.name,
            animDef.start,
            animDef.end,
            FPS
          );

          console.log(`[FrogBirdViewer] Playing "${animDef.name}" (frames ${animDef.start}-${animDef.end}) duration: ${subClip.duration.toFixed(2)}s`);

          const action = mixer.clipAction(subClip);
          action.setLoop(
            animDef.loop ? THREE.LoopRepeat : THREE.LoopOnce,
            animDef.loop ? Infinity : 1
          );
          action.clampWhenFinished = !animDef.loop;
          action.enabled = true;
          action.timeScale = 1;
          action.play();
          mixer.setTime(10 / 24);
          mixer.update(0);
        }

        setLoading(false);

        // Start render loop
        prevTime = performance.now();
        animate();
      },
      undefined,
      (err) => {
        console.error('[FrogBirdViewer] Load error:', err);
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
      mixerRef.current = null;
      fullClipRef.current = null;
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };

    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reactive animation switching ──
  useEffect(() => {
    const mixer = mixerRef.current;
    const fullClip = fullClipRef.current;
    if (!mixer || !fullClip) return;

    mixer.stopAllAction();

    const animDef = ANIMS[animation];
    const subClip = THREE.AnimationUtils.subclip(
      fullClip,
      animDef.name,
      animDef.start,
      animDef.end,
      FPS
    );

    console.log(`[FrogBirdViewer] Switching to "${animDef.name}" (frames ${animDef.start}-${animDef.end})`);

    const action = mixer.clipAction(subClip);
    action.setLoop(
      animDef.loop ? THREE.LoopRepeat : THREE.LoopOnce,
      animDef.loop ? Infinity : 1
    );
    action.clampWhenFinished = !animDef.loop;
    action.play();
  }, [animation]);

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