import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Orbiting particles ring ─── */
function ParticleRing({ count = 300, radius = 2.6 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.8;
      const y = (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      sz[i] = Math.random() * 2 + 1;
    }
    return [pos, sz];
  }, [count, radius]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.3, 0.1);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -state.pointer.x * 0.3, 0.1);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#22d3ee"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Secondary particle cloud ─── */
function ParticleCloud({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.1, 0.05);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -state.pointer.x * 0.1, 0.05);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#a855f7"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Energy pulsing sphere ─── */
function EnergyField() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1.8 + Math.sin(t * 1.5) * 0.08);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.04 + Math.sin(t * 2) * 0.02;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={THREE.BackSide} />
    </mesh>
  );
}

/* ─── Central wireframe core ─── */
function WireCore() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const outerIco = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const { pointer } = state;
    if (group.current) {
      group.current.rotation.y +=
        (pointer.x * 0.5 - group.current.rotation.y) * 0.1;
      group.current.rotation.x +=
        (-pointer.y * 0.3 - group.current.rotation.x) * 0.1;
    }
    if (inner.current) {
      inner.current.rotation.x += 0.004;
      inner.current.rotation.y += 0.006;
    }
    if (outerIco.current) {
      outerIco.current.rotation.y -= 0.001;
      outerIco.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0.15}>
        {/* Outer wireframe */}
        <mesh ref={outerIco}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial wireframe color="#3b82f6" transparent opacity={0.7} />
        </mesh>

        {/* Inner core */}
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.85, 0]} />
          <meshBasicMaterial wireframe color="#8b5cf6" transparent opacity={0.6} />
        </mesh>

        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} />
        </mesh>

        {/* Orbital rings */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.1, 0.012, 16, 200]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 1.8, Math.PI / 4, 0]}>
          <torusGeometry args={[2.4, 0.006, 16, 200]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 3, -Math.PI / 6, Math.PI / 5]}>
          <torusGeometry args={[1.8, 0.004, 16, 160]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </mesh>
      </Float>

      <EnergyField />
      <ParticleRing />
      <ParticleRing count={200} radius={3.2} />
      <ParticleCloud />
    </group>
  );
}

export const HeroCore = () => {
  return (
    <Canvas
      dpr={[1, 3]} /* Maximize DPI rendering for extremely crisp 4K HD output */
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "auto" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#8b5cf6" />
      <pointLight position={[0, -5, 3]} intensity={0.5} color="#3b82f6" />
      <Suspense fallback={null}>
        <WireCore />
      </Suspense>
    </Canvas>
  );
};
