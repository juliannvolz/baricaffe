"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor-pétala — a pétala da flor segue o cursor com atraso suave
 * e rotação orgânica. Só existe em ponteiro fino.
 * Elemento decorativo: pointer-events none, aria-hidden.
 */
export function CursorPetal() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = window.innerWidth * 0.6;
    let ty = window.innerHeight * 0.4;
    let x = tx;
    let y = ty;
    let angle = 0;
    let visible = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // atraso elástico: a pétala "venta" atrás do cursor
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      const dx = tx - x;
      const dy = ty - y;
      const speed = Math.hypot(dx, dy);
      // inclina conforme a velocidade, como se caísse de lado
      angle += (speed * 0.35 - angle) * 0.08;
      visible += ((speed > 0.5 ? 1 : 0.35) - visible) * 0.06;

      el.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0) rotate(${angle}deg)`;
      el.style.opacity = String(0.5 + visible * 0.3);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{ opacity: 0 }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="presentation">
        <path
          d="M14 2C20 8 24 13 14 26C4 13 8 8 14 2Z"
          fill="var(--color-accent)"
          fillOpacity="0.55"
          stroke="var(--color-accent)"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
