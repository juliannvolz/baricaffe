"use client";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, Observer);

/**
 * Perfil da xícara para LatheGeometry (rotacionado em torno do eixo Y)
 * Coordenadas: x = raio, y = altura (0 = base)
 */
function createCupProfile(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];

  points.push(new THREE.Vector2(1.0, 0));
  points.push(new THREE.Vector2(0.92, 0));
  points.push(new THREE.Vector2(0.92, 0.02));
  points.push(new THREE.Vector2(0.92, 2.8));
  points.push(new THREE.Vector2(0.94, 2.9));
  points.push(new THREE.Vector2(0.96, 3.0));
  points.push(new THREE.Vector2(1.05, 3.0));
  points.push(new THREE.Vector2(1.08, 2.9));
  points.push(new THREE.Vector2(1.08, 0.02));
  points.push(new THREE.Vector2(1.0, 0));

  return new THREE.LatheGeometry(points, 64);
}

function createHandleGeometry(): THREE.TubeGeometry {
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(1.15, 2.2, 0),
    new THREE.Vector3(1.6, 2.5, 0.2),
    new THREE.Vector3(1.7, 1.2, 0.1),
    new THREE.Vector3(1.2, 0.8, 0),
  );
  return new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
}

function _createCreamGeometry(): { base: THREE.CylinderGeometry; top: THREE.SphereGeometry } {
  const base = new THREE.CylinderGeometry(0.94, 0.94, 0.15, 32, 1, true);
  const top = new THREE.SphereGeometry(0.98, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  return { base, top };
}

function CupScene() {
  const cupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [_reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const host = scrollRef.current;
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

  useGSAP(
    () => {
      if (!scrollRef.current) return;
      const ctx = gsap.context(() => {
        const cup = cupRef.current;
        if (!cup) return;

        // Set initial values
        cup.scale.set(0.7, 0.7, 0.7);
        cup.rotation.y = 0.5;
        cup.position.y = 0.4;

        gsap.to(cup.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "power3.out" });

        const rotProxy = { y: cup.rotation.y };
        const posProxy = { y: cup.position.y };

        gsap.to(rotProxy, {
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => {
            cup.rotation.y = rotProxy.y;
          },
        });
        gsap.to(posProxy, {
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          onUpdate: () => {
            cup.position.y = posProxy.y;
          },
          delay: 0.6,
        });
        gsap.to(cup.rotation, {
          y: "+=0.8",
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom bottom", scrub: 1 },
        });
        gsap.to(cup.position, {
          y: "+=0.12",
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          duration: 4,
        });

        if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
          Observer.create({
            target: window,
            type: "pointer",
            onMove: (self: { x?: number; y?: number }) => {
              if (!cupRef.current || self.x === undefined || self.y === undefined) return;
              gsap.to(cup.rotation, {
                x: self.y * 0.12,
                y: self.x * 0.12 + cup.rotation.y,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
            },
          });
        }
      }, cupRef);
      return () => ctx.revert();
    },
    { scope: cupRef },
  );

  const dpr: [number, number] =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
      ? [1, 1.25]
      : [1, 1.5];

  return (
    <div
      ref={scrollRef}
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
      suppressHydrationWarning
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0.8, 0.1, 3.2], fov: 30 }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        shadows
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={10}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#F5C6D6" />
        <directionalLight position={[0, 8, 0]} intensity={0.3} color="#FFF8F0" />

        <group ref={cupRef} position={[0, -0.3, 0]} scale={1.8}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
            <circleGeometry args={[1.5, 64]} />
            <meshBasicMaterial color={0x000000} transparent opacity={0.15} depthWrite={false} />
          </mesh>

          <mesh geometry={createCupProfile()} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={0xf5c6d6}
              metalness={0.0}
              roughness={0.15}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
              ior={1.5}
            />
          </mesh>

          <mesh geometry={createHandleGeometry()} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={0xf5c6d6}
              metalness={0.0}
              roughness={0.15}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
            />
          </mesh>

          <mesh
            geometry={(() => {
              const g = new THREE.PlaneGeometry(2.2, 0.15, 16, 1);
              const pa = g.getAttribute("position");
              if (pa) {
                for (let i = 0; i < pa.count; i++) {
                  const x = pa.getX(i);
                  if (Math.abs(x) > 1.0) pa.setY(i, pa.getY(i) + Math.sin(x * 8) * 0.02);
                }
                g.computeVertexNormals();
              }
              return g;
            })()}
            position={[0, 3.0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              color={0x3d2314}
              metalness={0.0}
              roughness={0.3}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              side={THREE.DoubleSide}
              transparent
              alphaTest={0.1}
            />
          </mesh>

          <group position={[0, 3.07, 0]}>
            <mesh
              geometry={new THREE.CylinderGeometry(0.94, 0.94, 0.15, 32, 1, true)}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color={0xfff8f0}
                metalness={0.0}
                roughness={0.6}
                transmission={0.1}
                thickness={0.8}
                transparent
                opacity={0.95}
              />
            </mesh>
            <mesh
              geometry={new THREE.SphereGeometry(0.98, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color={0xfff8f0}
                metalness={0.0}
                roughness={0.6}
                transmission={0.1}
                thickness={0.8}
                transparent
                opacity={0.95}
              />
            </mesh>
          </group>

          <group position={[0, 3.25, 0]}>
            <mesh
              geometry={new THREE.ConeGeometry(0.12, 0.25, 16)}
              position={[-0.35, 0.15, 0.3]}
              rotation={[-0.2, 0, 0.1]}
              castShadow
            >
              <meshPhysicalMaterial color={0xe84d60} metalness={0.0} roughness={0.4} />
            </mesh>
            <mesh
              geometry={new THREE.SphereGeometry(0.1, 16, 16)}
              position={[0.4, 0.1, -0.25]}
              castShadow
            >
              <meshPhysicalMaterial
                color={0x3d2314}
                metalness={0.0}
                roughness={0.3}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
            <mesh
              geometry={new THREE.ConeGeometry(0.1, 0.22, 16)}
              position={[0.15, 0.18, -0.4]}
              rotation={[0.15, 0, -0.1]}
              castShadow
            >
              <meshPhysicalMaterial color={0xe84d60} metalness={0.0} roughness={0.4} />
            </mesh>
            <mesh
              geometry={new THREE.SphereGeometry(0.09, 16, 16)}
              position={[-0.4, 0.1, -0.15]}
              castShadow
            >
              <meshPhysicalMaterial
                color={0x3d2314}
                metalness={0.0}
                roughness={0.3}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
            <mesh
              geometry={new THREE.ConeGeometry(0.08, 0.18, 12)}
              position={[0.45, 0.12, 0.35]}
              rotation={[-0.1, 0, 0.05]}
              castShadow
            >
              <meshPhysicalMaterial color={0xe84d60} metalness={0.0} roughness={0.4} />
            </mesh>
          </group>

          <mesh position={[0, 1.8, 1.08]} scale={0.6}>
            <planeGeometry args={[1, 0.4]} />
            <meshBasicMaterial
              color={0xc99a2e}
              transparent
              opacity={0.95}
              depthWrite={false}
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <ambientLight intensity={0.8} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={10}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#F5C6D6" />
        <directionalLight position={[0, 8, 0]} intensity={0.3} color="#FFF8F0" />
      </Canvas>
    </div>
  );
}

export default function CupWrapper() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Server-side placeholder (static image) - matches the client fallback exactly
  if (!mounted) {
    return (
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[35vw] max-w-[380px] opacity-80 hidden md:block"
        aria-hidden="true"
        suppressHydrationWarning
      >
        <img
          src="/images/cup-static.webp"
          alt="Xícara rosa da Bari com logo dourado, borda de chocolate e creme"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    );
  }

  // Client-only: reduced motion fallback
  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[35vw] max-w-[380px] opacity-80 hidden md:block"
        aria-hidden="true"
        suppressHydrationWarning
      >
        <img
          src="/images/cup-static.webp"
          alt="Xícara rosa da Bari com logo dourado, borda de chocolate e creme"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    );
  }

  // Client-only: full R3F scene
  return <CupScene />;
}
