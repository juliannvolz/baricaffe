"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

type RevealVariant = "default" | "text" | "image" | "stagger" | "counter";

interface RevealOptions {
  y?: number;
  variant?: RevealVariant;
  stagger?: number;
  duration?: number;
  ease?: string;
  splitType?: "lines,words" | "words" | "chars";
  onComplete?: () => void;
}

/**
 * Sistema de reveal flexível com variantes:
 * - "default": fade-up simples (opacity 0→1, y→0)
 * - "text": SplitText lines/words com stagger
 * - "image": scale 1.08→1 + opacity 0→1 (clip-path ready)
 * - "stagger": filhos com delay progressivo customizado
 * - "counter": números animados (0→value)
 */
export function useReveal(options: RevealOptions = {}) {
  const {
    y = 24,
    variant = "default",
    stagger = 0.08,
    duration = 0.7,
    ease = "power3.out",
    splitType = "lines,words",
    onComplete,
  } = options;

  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const els = Array.from(root.querySelectorAll("[data-reveal]")) as HTMLElement[];
      if (!els.length) return;

      // Remove transition do Tailwind que conflita com GSAP
      gsap.set(els, { transition: "none" });

      let tween: gsap.core.Tween | gsap.core.Timeline;

      switch (variant) {
        case "text": {
          // SplitText em cada elemento com data-reveal
          const splitInstances: SplitText[] = [];
          const allWords: HTMLElement[] = [];

          els.forEach((el) => {
            const split = new SplitText(el, {
              type: splitType,
              linesClass: "reveal-line",
              wordsClass: "reveal-word",
              charsClass: "reveal-char",
            });
            splitInstances.push(split);
            allWords.push(...(split.words as HTMLElement[]));
          });

          gsap.set(allWords, { opacity: 0, yPercent: 100 });

          tween = gsap.to(allWords, {
            opacity: 1,
            yPercent: 0,
            duration,
            ease,
            stagger,
            onComplete: () => {
              for (const s of splitInstances) s.revert();
              onComplete?.();
            },
          });
          break;
        }

        case "image": {
          gsap.set(els, { opacity: 0, scale: 1.08 });
          tween = gsap.to(els, {
            opacity: 1,
            scale: 1,
            duration: duration * 1.2,
            ease: "power2.out",
            stagger: stagger * 0.5,
            onComplete: () => {
              gsap.set(els, { clearProps: "opacity,transform,transition" });
              onComplete?.();
            },
          });
          break;
        }

        case "stagger": {
          gsap.set(els, { opacity: 0, y });
          tween = gsap.to(els, {
            opacity: (i) => Number.parseFloat(getComputedStyle(els[i] as HTMLElement).opacity) || 1,
            y: 0,
            duration,
            ease,
            stagger,
            onComplete: () => {
              gsap.set(els, { clearProps: "opacity,transform,transition" });
              onComplete?.();
            },
          });
          break;
        }

        case "counter": {
          els.forEach((el) => {
            const target = Number.parseInt(el.dataset.counterTarget || el.textContent || "0", 10);
            el.dataset.counterTarget = String(target);
            el.textContent = "0";
          });
          tween = gsap.to(els, {
            textContent: (i: number) => {
              const el = els[i];
              const target = el ? Number.parseInt(el.dataset.counterTarget || "0", 10) : 0;
              return { value: 0, end: target };
            },
            duration: duration * 2,
            ease: "power2.out",
            stagger: stagger * 2,
            snap: { textContent: 1 },
            onComplete: () => {
              onComplete?.();
            },
          } as gsap.TweenVars);
          break;
        }

        default: {
          // default: fade-up simples
          const natural = els.map((el) => Number.parseFloat(getComputedStyle(el).opacity) || 1);
          gsap.set(els, { opacity: 0, y });
          tween = gsap.to(els, {
            opacity: (i) => natural[i] ?? 1,
            y: 0,
            duration,
            ease,
            stagger,
            onComplete: () => {
              gsap.set(els, { clearProps: "opacity,transform,transition" });
              onComplete?.();
            },
          });
        }
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          tween.play();
          io.disconnect();
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0 },
      );
      if (ref.current) io.observe(ref.current);

      return () => io.disconnect();
    },
    { scope: ref },
  );

  return ref;
}
