"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marquee "Assinatura" — faixa sutil entre Hero e Proof.
 * Loop infinito com termos da marca, text-gold/20, font-display.
 * Pausa no hover, respeita prefers-reduced-motion.
 */
export function SignatureMarquee() {
  if (typeof window === 'undefined') return null;

  const [mounted, setMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!trackRef.current || reducedMotionRef.current) return;

    const track = trackRef.current;
    let animationId: number;

    const step = () => {
      if (reducedMotionRef.current) return;
      track.style.transform = `translate3d(${parseFloat(getComputedStyle(track).transform.split(",")[4] || "0") - 0.25}px, 0, 0)`;
      // Reset quando o primeiro conjunto saiu completamente
      const firstChild = track.children[0] as HTMLElement;
      if (
        firstChild &&
        Math.abs(parseFloat(getComputedStyle(track).transform.split(",")[4] || "0")) >=
          firstChild.offsetWidth
      ) {
        track.style.transition = "none";
        track.style.transform = "translate3d(0, 0, 0)";
        // Force reflow
        track.offsetHeight;
        track.style.transition = "transform 0.1s linear";
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Termos da marca — duplicados para loop seamless
  const terms = [
    "chocolate belga",
    "avelã tostada",
    "trufa",
    "chocolate quente rosa",
    "fondue de inverno",
    "croissant de chocolate",
    "red velvet",
    "brownie decorado",
    "cesta de café da manhã",
    "presente com flor e recado",
  ];

  if (!mounted) return null;

  return (
    <div
      className="overflow-hidden bg-ink/5 border-y border-ground/10 py-3"
      aria-hidden="true"
      role="presentation"
    >
      <div
        ref={trackRef}
        className="marquee-track flex whitespace-nowrap text-[0.65rem] tracking-[0.4em] uppercase text-gold/20 font-display"
        style={{ willChange: "transform" }}
      >
        {[...terms, ...terms].map((term, i) => (
          <span key={i} className="px-6">
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
