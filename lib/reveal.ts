"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Configuração de reveal para um elemento/grupo
 */
export interface RevealConfig {
  /** Seletor CSS ou elemento(s) alvo */
  selector: string | Element | Element[];
  /** Estado inicial (from) */
  from?: gsap.TweenVars;
  /** Estado final (to) - opacity: 1 é automático se não definido */
  to?: gsap.TweenVars;
  /** Stagger entre elementos (s) */
  stagger?: number;
  /** Duração da animação (s) */
  duration?: number;
  /** Easing */
  ease?: string;
  /** Delay inicial (s) */
  delay?: number;
  /** ScrollTrigger start */
  start?: string;
  /** Limpar props ao finalizar (evita re-aplicar hidden no resize) */
  clearProps?: boolean;
}

/**
 * Cria reveals escalonados para uma seção
 * @param sectionEl Elemento raiz da seção (trigger)
 * @param configs Array de configs em ordem de execução
 * @param reducedMotion Se true, usa duração ~0
 */
export function createSectionReveals(
  sectionEl: HTMLElement,
  configs: RevealConfig[],
  reducedMotion = false,
): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];

  configs.forEach((cfg, _i) => {
    const els =
      typeof cfg.selector === "string"
        ? gsap.utils.toArray<Element>(cfg.selector)
        : Array.isArray(cfg.selector)
          ? cfg.selector
          : [cfg.selector];

    if (!els.length) return;

    const fromVars = {
      opacity: 0,
      y: 30,
      ...cfg.from,
    };

    const toVars = {
      opacity: 1,
      y: 0,
      ...cfg.to,
      stagger: cfg.stagger ?? 0.06,
      duration: reducedMotion ? 0.01 : (cfg.duration ?? 0.6),
      ease: cfg.ease ?? "power2.out",
      clearProps: cfg.clearProps !== false ? "all" : undefined,
      scrollTrigger: {
        trigger: sectionEl,
        start: cfg.start ?? "top 85%",
        once: true,
        onEnter: () => ScrollTrigger.refresh(),
      },
      delay: cfg.delay ?? 0,
    };

    const st = gsap.fromTo(els, fromVars, toVars);
    triggers.push(st.scrollTrigger as ScrollTrigger);
  });

  return triggers;
}

/**
 * Cria timeline sequencial para reveals complexos (ex: Hero com SplitText)
 */
export function createRevealTimeline(
  sectionEl: HTMLElement,
  steps: Array<{
    selector: string | Element | Element[];
    config: Omit<RevealConfig, "selector">;
  }>,
  reducedMotion = false,
): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: "top 85%",
      once: true,
      onEnter: () => ScrollTrigger.refresh(),
    },
  });

  steps.forEach(({ selector, config }) => {
    const els =
      typeof selector === "string"
        ? gsap.utils.toArray<Element>(selector)
        : Array.isArray(selector)
          ? selector
          : [selector];

    if (!els.length) return;

    tl.fromTo(
      els,
      { opacity: 0, y: 30, ...config.from },
      {
        opacity: 1,
        y: 0,
        stagger: config.stagger ?? 0.06,
        duration: reducedMotion ? 0.01 : (config.duration ?? 0.6),
        ease: config.ease ?? "power2.out",
        clearProps: config.clearProps !== false ? "all" : undefined,
      },
      config.delay ?? 0,
    );
  });

  return tl;
}

/**
 * Hook para detectar prefers-reduced-motion
 */
export function useReducedMotion(): boolean {
  // Em SSR retorna false; no client atualiza via effect
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
