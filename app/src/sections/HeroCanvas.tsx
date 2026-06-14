import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector2, ShaderMaterial } from 'three';
import { vertexShader } from '../shaders/vertex.glsl';
import { fragmentShader } from '../shaders/fragment.glsl';

function HeroMesh({ scrollProgress }: { scrollProgress: number }) {
  const texture = useLoader(TextureLoader, '/images/hero-mountains.jpg');
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uProgress: { value: 0 },
    uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    uRevealMode: { value: 0 },
  }), [texture]);

  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = scrollProgress;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function HeroCanvasR3F({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1], fov: 45, near: 0.1, far: 10 }}
        style={{ width: '100%', height: '100%' }}
      >
        <HeroMesh scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
