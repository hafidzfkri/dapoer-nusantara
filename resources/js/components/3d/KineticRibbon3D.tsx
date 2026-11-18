import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class RibbonErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function RibbonMesh({ pointerRef, reduced }: { pointerRef: React.MutableRefObject<{ x: number; y: number }>; reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Hairline top & bottom borders
      ctx.strokeStyle = 'rgba(61, 90, 46, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(canvas.width, 12);
      ctx.moveTo(0, canvas.height - 12);
      ctx.lineTo(canvas.width, canvas.height - 12);
      ctx.stroke();

      ctx.fillStyle = '#3D5A2E';
      ctx.font = '600 44px Georgia, "Times New Roman", serif';
      ctx.textBaseline = 'middle';
      const text = 'DAPOER NUSANTARA  •  HERITAGE KITCHEN  •  REMPAH ASLI  •  ';
      const fullText = text.repeat(2);
      ctx.fillText(fullText, 24, canvas.height / 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || reduced) return;

    mesh.rotation.y += delta * 0.16;
    const targetX = 0.22 + pointerRef.current.y * 0.28;
    const targetZ = -0.08 + pointerRef.current.x * 0.14;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, delta * 3);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetZ, delta * 3);
  });

  return (
    <mesh ref={meshRef} rotation={[0.22, 0, -0.08]}>
      <cylinderGeometry args={[3.15, 3.15, 0.62, 64, 1, true]} />
      <meshBasicMaterial map={texture} transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export default function KineticRibbon3D() {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setReady(isWebGLAvailable());
    setReduced(
      typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );

    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!ready) return null;

  return (
    <RibbonErrorBoundary>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.4, 5.8], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <RibbonMesh pointerRef={pointerRef} reduced={reduced} />
        </Canvas>
      </div>
    </RibbonErrorBoundary>
  );
}
