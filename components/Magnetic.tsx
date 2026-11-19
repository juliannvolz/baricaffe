"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Ripple } from "@/components/Ripple";

/**
 * Botão magnético + ripple no click.
 * - Magnético: puxa até 10px na direção do ponteiro (desktop only, pointer: fine)
 * - Ripple: ondulação no click
 */
export function Magnetic({
  children,
  className,
  rippleColor = "currentColor",
}: {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const strength = 10;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: (dx / r.width) * strength * 2,
        y: (dy / r.height) * strength * 2,
        duration: 0.4,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Ripple color={rippleColor}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </Ripple>
  );
}
