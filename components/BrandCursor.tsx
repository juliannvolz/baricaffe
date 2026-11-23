"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover-link" | "hover-image" | "dragging";

/**
 * Brand Cursor — evolução do CursorPetal com estados semânticos.
 * - default: pétala única (rosa, 28px)
 * - hover-link: pétala + anel dourado (32px)
 * - hover-image: pétala expandida + brilho (36px)
 * - dragging: pétala pressionada (24px, escala 0.9)
 * - reduced-motion: cursor nativo (retorna null)
 *
 * Estados detectados via event listeners globais.
 * Pointer-events: none, z-index: 40, mix-blend-mode: difference (opcional)
 */
export function BrandCursor() {
  if (typeof window === "undefined") return null;

  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = window.innerWidth * 0.6;
    let ty = window.innerHeight * 0.4;
    let x = tx;
    let y = ty;
    let angle = 0;
    let visible = 0;
    let currentSize = 28;
    let targetSize = 28;

    const sizeMap: Record<CursorState, number> = {
      default: 28,
      "hover-link": 32,
      "hover-image": 36,
      dragging: 24,
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    // Detecta hover em links/botões
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role=button], .menu-card, .sig-detail, .hero-cta")) {
        setState(
          target.closest(".menu-card, .sig-detail, .detail-drink, .detail-cake")
            ? "hover-image"
            : "hover-link",
        );
      }
    };

    const onMouseOut = () => {
      setState("default");
    };

    // Detecta drag
    const onMouseDown = () => setState("dragging");
    const onMouseUp = () => setState("default");

    const tick = () => {
      // Suavização elástica
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      const dx = tx - x;
      const dy = ty - y;
      const speed = Math.hypot(dx, dy);
      angle += (speed * 0.35 - angle) * 0.08;
      visible += ((speed > 0.5 ? 1 : 0.35) - visible) * 0.06;

      // Transição suave de tamanho
      targetSize = sizeMap[state];
      currentSize += (targetSize - currentSize) * 0.15;

      const offset = currentSize / 2;
      el.style.transform = `translate3d(${x - offset}px, ${y - offset}px, 0) rotate(${angle}deg) scale(${state === "dragging" ? 0.92 : 1})`;
      el.style.opacity = String(0.55 + visible * 0.3);
      el.style.width = `${currentSize}px`;
      el.style.height = `${currentSize}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(raf);
    };
  }, [enabled, state, reducedMotion]);

  if (!enabled || reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{ opacity: 0 }}
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        role="presentation"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Pétala base */}
        <path
          d="M14 2C20 8 24 13 14 26C4 13 8 8 14 2Z"
          fill="var(--color-accent)"
          fillOpacity="0.55"
          stroke="var(--color-accent)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        {/* Anel dourado (hover-link) */}
        {state === "hover-link" && (
          <circle
            cx="14"
            cy="14"
            r="15"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="cursor-spin"
          />
        )}
        {/* Brilho (hover-image) */}
        {state === "hover-image" && (
          <radialGradient id="cursor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </radialGradient>
        )}
      </svg>
    </div>
  );
}
