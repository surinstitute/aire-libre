import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// Vite asset imports
import glbUrl from '../../assets/models/burb.glb?url';
import tex01Url from '../../assets/models/burb_tex_01.jpg';
import tex02Url from '../../assets/models/burb_tex_02.jpg';
import normalUrl from '../../assets/models/burb_normal.jpg';

// ============================================================
// GLTFLoader (minimal inline — Three.js r128 doesn't export it)
// We load GLB via fetch + parse manually
// ============================================================

interface Bird3DViewerProps {
  /** Which texture variant: 1 or 2 */
  variant?: 1 | 2;
  /** Container width */
  width?: number | string;
  /** Container height */
  height?: number | string;
  /** Auto-rotate speed (0 to disable) */
  autoRotateSpeed?: number;
  /** Show texture toggle buttons */
  showControls?: boolean;
  /** Background color (transparent if null) */
  backgroundColor?: string | null;
  /** Camera distance */
  cameraDistance?: number;
  /** Called when model is loaded. Passes a snapshot function that returns a data URL */
  onReady?: (snapshot: () => string | null) => void;
}

// Parse GLB binary into Three.js objects
function parseGLB(buffer: ArrayBuffer): Promise<{
  meshes: THREE.Mesh[];
  scene: THREE.Group;
}> {
  return new Promise((resolve) => {
    const view = new DataView(buffer);
    
    // GLB header: magic(4) + version(4) + length(4)
    const jsonChunkLength = view.getUint32(12, true);
    // const jsonChunkType = view.getUint32(16, true); // 0x4E4F534A = JSON
    const jsonStr = new TextDecoder().decode(new Uint8Array(buffer, 20, jsonChunkLength));
    const gltf = JSON.parse(jsonStr);
    
    // Binary chunk
    const binStart = 20 + jsonChunkLength;
    const binChunkLength = view.getUint32(binStart, true);
    // const binChunkType = view.getUint32(binStart + 4, true);
    const binData = new Uint8Array(buffer, binStart + 8, binChunkLength);
    
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];
    
    // Parse accessors
    const getAccessorData = (accessorIndex: number) => {
      const accessor = gltf.accessors[accessorIndex];
      const bufferView = gltf.bufferViews[accessor.bufferView];
      const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const count = accessor.count;
      
      const typeSize: Record<string, number> = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
      const components = typeSize[accessor.type] || 1;
      
      if (accessor.componentType === 5126) { // FLOAT
        return new Float32Array(binData.buffer, binData.byteOffset + offset, count * components);
      } else if (accessor.componentType === 5123) { // UNSIGNED_SHORT
        return new Uint16Array(binData.buffer, binData.byteOffset + offset, count * components);
      } else if (accessor.componentType === 5125) { // UNSIGNED_INT
        return new Uint32Array(binData.buffer, binData.byteOffset + offset, count * components);
      }
      return new Float32Array(0);
    };
    
    // Build meshes using node hierarchy (applies per-node transforms)
    const buildMesh = (meshIndex: number): THREE.Mesh => {
      const meshDef = gltf.meshes[meshIndex];
      const prim = meshDef.primitives[0]; // each mesh has 1 primitive
      const geometry = new THREE.BufferGeometry();
      
      if (prim.attributes.POSITION !== undefined) {
        geometry.setAttribute('position', new THREE.BufferAttribute(
          new Float32Array(getAccessorData(prim.attributes.POSITION)), 3
        ));
      }
      if (prim.attributes.NORMAL !== undefined) {
        geometry.setAttribute('normal', new THREE.BufferAttribute(
          new Float32Array(getAccessorData(prim.attributes.NORMAL)), 3
        ));
      }
      if (prim.attributes.TEXCOORD_0 !== undefined) {
        const uvData = new Float32Array(getAccessorData(prim.attributes.TEXCOORD_0));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvData, 2));
      }
      if (prim.indices !== undefined) {
        const indexData = getAccessorData(prim.indices);
        if (indexData instanceof Uint16Array) {
          geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexData), 1));
        } else {
          geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexData), 1));
        }
      }
      geometry.computeBoundingSphere();
      
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 0.0, roughness: 0.7, side: THREE.FrontSide,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = meshDef.name;
      
      // Outline mesh (inverted hull method)
      // Renders back faces slightly expanded along normals → dark outline
      const outlineMat = new THREE.ShaderMaterial({
        vertexShader: `
          uniform float outlineThickness;
          void main() {
            vec3 pos = position + normal * outlineThickness;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 outlineColor;
          void main() {
            gl_FragColor = vec4(outlineColor, 1.0);
          }
        `,
        uniforms: {
          outlineThickness: { value: 0.35 },
          outlineColor: { value: new THREE.Color(0x1a1a2e) },
        },
        side: THREE.BackSide,
      });
      
      const outlineMesh = new THREE.Mesh(geometry, outlineMat);
      outlineMesh.name = meshDef.name + '_outline';
      mesh.add(outlineMesh); // child of main mesh so it follows transforms
      
      return mesh;
    };
    
    // Walk the node tree and apply transforms
    const processNode = (nodeIndex: number, parent: THREE.Group) => {
      const nodeDef = gltf.nodes[nodeIndex];
      const nodeObj = new THREE.Group();
      nodeObj.name = nodeDef.name || `node_${nodeIndex}`;
      
      // Apply node transform
      if (nodeDef.translation) {
        nodeObj.position.set(nodeDef.translation[0], nodeDef.translation[1], nodeDef.translation[2]);
      }
      if (nodeDef.rotation) {
        nodeObj.quaternion.set(nodeDef.rotation[0], nodeDef.rotation[1], nodeDef.rotation[2], nodeDef.rotation[3]);
      }
      if (nodeDef.scale) {
        nodeObj.scale.set(nodeDef.scale[0], nodeDef.scale[1], nodeDef.scale[2]);
      }
      
      // If this node has a mesh, build it
      if (nodeDef.mesh !== undefined) {
        const mesh = buildMesh(nodeDef.mesh);
        nodeObj.add(mesh);
        meshes.push(mesh);
      }
      
      // Process children
      if (nodeDef.children) {
        for (const childIdx of nodeDef.children) {
          processNode(childIdx, nodeObj);
        }
      }
      
      parent.add(nodeObj);
    };
    
    // Start from scene root nodes
    const sceneNodes = gltf.scenes[0].nodes;
    for (const rootIdx of sceneNodes) {
      processNode(rootIdx, group);
    }
    
    // Center and normalize scale
    const box = new THREE.Box3().setFromObject(group);
    
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizeScale = 2.0 / maxDim;
    
    // Wrap in a scale group to preserve node transforms
    const wrapper = new THREE.Group();
    wrapper.add(group);
    wrapper.scale.setScalar(normalizeScale);
    
    // Recenter
    const box2 = new THREE.Box3().setFromObject(wrapper);
    const center2 = box2.getCenter(new THREE.Vector3());
    wrapper.position.sub(center2);
    
    resolve({ meshes, scene: wrapper });
  });
}

export default function Bird3DViewer({
  variant = 1,
  width = '100%',
  height = '500px',
  autoRotateSpeed = 0.5,
  showControls = false,
  backgroundColor = null,
  cameraDistance = 4,
  onReady,
}: Bird3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const pivotRef = useRef<THREE.Group | null>(null); // orbit pivot
  const frameRef = useRef<number>(0);
  const texturesRef = useRef<Map<number, THREE.Texture>>(new Map());
  
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mouse orbit state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const orbitAngle = useRef({ x: 0, y: 0 });

  const applyTexture = useCallback((variantNum: number) => {
    const tex = texturesRef.current.get(variantNum);
    if (!tex || meshesRef.current.length === 0) return;
    
    meshesRef.current.forEach(mesh => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.map = tex;
      mat.needsUpdate = true;
    });
  }, []);

  // Init scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    if (backgroundColor) {
      scene.background = new THREE.Color(backgroundColor);
    }
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0.5, cameraDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

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
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -2, -4);
    scene.add(rimLight);

    // Load model + textures
    const loadAssets = async () => {
      try {
        // Load GLB
        const glbResp = await fetch(glbUrl);
        if (!glbResp.ok) throw new Error('Failed to load model');
        const glbBuffer = await glbResp.arrayBuffer();
        const { meshes, scene: modelGroup } = await parseGLB(glbBuffer);
        
        meshesRef.current = meshes;
        
        // Create pivot for orbit rotation (wraps the corrected model)
        const pivot = new THREE.Group();
        pivot.add(modelGroup);
        scene.add(pivot);
        pivotRef.current = pivot;

        // Load textures
        const loader = new THREE.TextureLoader();
        
        const loadTex = (url: string): Promise<THREE.Texture> => {
          return new Promise((resolve, reject) => {
            loader.load(url, (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.flipY = false;
              resolve(tex);
            }, undefined, reject);
          });
        };

        const [tex1, tex2, normalTex] = await Promise.all([
          loadTex(tex01Url),
          loadTex(tex02Url),
          loadTex(normalUrl),
        ]);

        // Normal map should be linear, not sRGB
        normalTex.colorSpace = THREE.LinearSRGBColorSpace;

        texturesRef.current.set(1, tex1);
        texturesRef.current.set(2, tex2);

        // Apply normal map to all meshes
        meshesRef.current.forEach(mesh => {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.normalMap = normalTex;
          mat.normalScale = new THREE.Vector2(1.0, 1.0);
          mat.needsUpdate = true;
        });

        // Apply initial texture
        applyTexture(currentVariant);
        setLoading(false);

        // Expose snapshot function
        if (onReady) {
          onReady(() => {
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            return rendererRef.current.domElement.toDataURL('image/png');
          });
        }
      } catch (err) {
        console.error('Failed to load 3D assets:', err);
        setError('No se pudo cargar el modelo 3D');
        setLoading(false);
      }
    };

    loadAssets();

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (pivotRef.current) {
        if (!isDragging.current && autoRotateSpeed > 0) {
          orbitAngle.current.y += autoRotateSpeed * 0.01;
        }
        pivotRef.current.rotation.x = orbitAngle.current.x;
        pivotRef.current.rotation.y = orbitAngle.current.y;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse/touch controls
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      orbitAngle.current.y += dx * 0.008;
      orbitAngle.current.x += dy * 0.008;
      orbitAngle.current.x = Math.max(-1.2, Math.min(1.2, orbitAngle.current.x));
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => { isDragging.current = false; };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle variant change
  useEffect(() => {
    applyTexture(currentVariant);
  }, [currentVariant, applyTexture]);

  // Sync with prop
  useEffect(() => {
    setCurrentVariant(variant);
  }, [variant]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />
      
      {/* Loading */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(245,240,232,0.8)', borderRadius: '12px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#A62C2B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14, color: '#6b7280' }}>Cargando modelo 3D...</div>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(245,240,232,0.9)', borderRadius: '12px',
        }}>
          <div style={{ fontSize: 14, color: '#ef4444', textAlign: 'center' }}>{error}</div>
        </div>
      )}

      {/* Texture toggle */}
      {showControls && !loading && !error && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={() => setCurrentVariant(1)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: currentVariant === 1 ? '3px solid #A62C2B' : '3px solid transparent',
              background: 'linear-gradient(135deg, #5c3a1e, #d4a574)', cursor: 'pointer',
              transition: 'all 0.2s', transform: currentVariant === 1 ? 'scale(1.1)' : 'scale(1)',
            }}
            title="Variante café"
          />
          <button
            onClick={() => setCurrentVariant(2)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: currentVariant === 2 ? '3px solid #A62C2B' : '3px solid transparent',
              background: 'linear-gradient(135deg, #4a7fb5, #a8d4f0)', cursor: 'pointer',
              transition: 'all 0.2s', transform: currentVariant === 2 ? 'scale(1.1)' : 'scale(1)',
            }}
            title="Variante azul"
          />
        </div>
      )}
    </div>
  );
}
