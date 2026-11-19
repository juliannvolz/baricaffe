"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroProgress } from "@/lib/scroll-progress";
import { Petals } from "./three/Petals";

/**
 * Cena WebGL do herói: só o campo de pétalas.
 * A foto é o produto; o 3D é profundidade atmosférica, não um objeto-substituto.
 * - dpr clampado
 * - frameloop 'never' fora da viewport/aba oculta
 * - câmera com damping independente de frame rate
 */

function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);
  useFrame((state, delta) => {
    const p = heroProgress.value;
    const k = Math.min(1, delta * 2.6);
    const cam = state.camera;
    const goalY = THREE.MathUtils.lerp(0.25, -0.2, p);
    const goalX = state.pointer.x * 0.3;
    cam.position.x += (goalX - cam.position.x) * k;
    cam.position.y += (goalY - cam.position.y) * k;
    cam.lookAt(look);
  });
  return null;
}

function SceneContents({ petalCount }: { petalCount: number }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#efb9c4" />
      <Petals count={petalCount} animate />
      <CameraRig />
    </>
  );
}

export default function HeroScene({ petalCount }: { petalCount: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setMounted(true);
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setActive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.02 },
    );
    const onVis = () => {
      if (document.hidden) setActive(false);
    };
    io.observe(host);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const dpr: [number, number] =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
      ? [1, 1.25]
      : [1, 1.5];

  // Server-side placeholder (empty div, same dimensions)
  if (!mounted) {
    return (
      <div
        ref={hostRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      suppressHydrationWarning
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.25, 4.2], fov: 42 }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <SceneContents petalCount={petalCount} />
      </Canvas>
    </div>
  );
}