"use client";

import { useEffect, useRef } from "react";

/**
 * Pétalas caindo — CSS-only, performático, respeita prefers-reduced-motion.
 * 12-15 pétalas com delays/tamanhos/direções variados.
 * Renderiza apenas no client; no SSR retorna null.
 */
export function AmbientPetals() {
  if (typeof window === "undefined") return null;

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!mountedRef.current) return null;

  // 15 pétalas com variações
  const petals = [
    { id: 0, size: 24, left: "8%", delay: 0.0, duration: 18, drift: -30, rot: -15 },
    { id: 1, size: 18, left: "18%", delay: 1.2, duration: 22, drift: 25, rot: 12 },
    { id: 2, size: 28, left: "28%", delay: 0.6, duration: 16, drift: -40, rot: 8 },
    { id: 3, size: 16, left: "38%", delay: 2.4, duration: 24, drift: 20, rot: -10 },
    { id: 4, size: 22, left: "48%", delay: 0.3, duration: 20, drift: -15, rot: 5 },
    { id: 5, size: 20, left: "58%", delay: 3.0, duration: 19, drift: 35, rot: -8 },
    { id: 6, size: 26, left: "68%", delay: 1.8, duration: 17, drift: -25, rot: 15 },
    { id: 7, size: 14, left: "78%", delay: 0.9, duration: 23, drift: 10, rot: -5 },
    { id: 8, size: 30, left: "88%", delay: 2.7, duration: 15, drift: -30, rot: 10 },
    { id: 9, size: 18, left: "12%", delay: 1.5, duration: 21, drift: 30, rot: -12 },
    { id: 10, size: 24, left: "22%", delay: 0.4, duration: 19, drift: -20, rot: 7 },
    { id: 11, size: 16, left: "32%", delay: 3.3, duration: 22, drift: 15, rot: -6 },
    { id: 12, size: 22, left: "42%", delay: 1.1, duration: 18, drift: -35, rot: 9 },
    { id: 13, size: 28, left: "52%", delay: 2.1, duration: 16, drift: 25, rot: -4 },
    { id: 14, size: 20, left: "62%", delay: 0.7, duration: 20, drift: -10, rot: 11 },
    { id: 15, size: 18, left: "72%", delay: 2.8, duration: 21, drift: 40, rot: -9 },
  ];

  const petalPath = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C10.9 2 10 2.9 10 4c0 1.1.9 2 2 2s2-.9 2-2c0-1.1-.9-2-2-2zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 7c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.25 }}
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="ambient-petal"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
              "--rot": `${p.rot}deg`,
            } as React.CSSProperties
          }
        >
          {petalPath}
        </span>
      ))}
    </div>
  );
}
