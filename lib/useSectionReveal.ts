"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { createSectionReveals, useReducedMotion } from "./reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook para reveals de seção baseados em ScrollTrigger.
 * Substitui useReveal para casos simples (fade-up, stagger).
 *
 * Uso:
 *   const ref = useSectionReveal({
 *     configs: [
 *       { selector: ".kicker", stagger: 0 },
 *       { selector: "h2", stagger: 0, delay: 0.1 },
 *       { selector: ".card", stagger: 0.08 },
 *     ],
 *   });
 */
export function useSectionReveal(
  configs: Array<{
    selector: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    stagger?: number;
    duration?: number;
    ease?: string;
    delay?: number;
    start?: string;
  }> = [],
) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !configs.length) return;

    const triggers = createSectionReveals(root, configs, reducedMotion);

    return () => {
      for (const st of triggers) {
        st.kill();
      }
    };
  }, [configs, reducedMotion]);

  return sectionRef;
}

/**
 * Versão simplificada para fade-up padrão com stagger opcional
 */
export function useFadeReveal(options?: {
  selector?: string;
  stagger?: number;
  delay?: number;
  start?: string;
}) {
  return useSectionReveal([
    {
      selector: options?.selector ?? "[data-reveal]",
      from: { y: 30, opacity: 0 },
      to: { y: 0, opacity: 1 },
      stagger: options?.stagger ?? 0.06,
      duration: 0.6,
      ease: "power2.out",
      delay: options?.delay ?? 0,
      start: options?.start ?? "top 85%",
    },
  ]);
}
