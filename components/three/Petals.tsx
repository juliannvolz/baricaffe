"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** Silhueta de pétala real (bézier), não um quadrado. Altura ~0.11. */
function makePetalShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.062, 0.02, 0.075, 0.065, 0, 0.11);
  s.bezierCurveTo(-0.075, 0.065, -0.062, 0.02, 0, 0);
  return s;
}

/**
 * Pétalas rosa caindo — InstancedMesh, 1 draw call.
 * 120 desktop / 40 mobile (decidido fora, via prop).
 * Rosa Bari oklch(0.82 0.11 5) ≈ #efb9c4 em sRGB.
 */

type PetalSeed = {
  x: number;
  y: number;
  z: number;
  speed: number;
  spin: number;
  phase: number;
  scale: number;
};

function makePetals(count: number, seeded: boolean): PetalSeed[] {
  // seed fixo determinístico para frames reproduzíveis
  let s = seeded ? 7 : 1;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s % 10000) / 10000;
  };
  return Array.from({ length: count }, () => ({
    x: (rand() - 0.5) * 6,
    y: rand() * 6,
    z: (rand() - 0.5) * 3 - 0.4,
    speed: 0.22 + rand() * 0.5,
    spin: (rand() - 0.5) * 2.4,
    phase: rand() * Math.PI * 2,
    scale: 0.7 + rand() * 0.9,
  }));
}

export function Petals({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalShape = useMemo(() => makePetalShape(), []);
  const seeds = useMemo(() => makePetals(count, true), [count]);

  useEffect(() => {
    const mesh = ref.current;
    if (mesh) mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < seeds.length; i++) {
      const p = seeds[i];
      if (!p) continue;
      let y = p.y;
      if (animate) {
        y = p.y - ((t * p.speed) % 7);
        if (y < -1) y += 7;
      }
      dummy.position.set(p.x + (animate ? Math.sin(t * 0.6 + p.phase) * 0.35 : 0), y, p.z);
      dummy.rotation.set(animate ? t * p.spin * 0.6 : p.phase, animate ? t * p.spin : 0, p.phase);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <shapeGeometry args={[petalShape, 6]} />
      <meshStandardMaterial
        color="#e9aebe"
        roughness={0.75}
        transparent
        opacity={0.62}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
