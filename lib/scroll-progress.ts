/**
 * Canal único DOM→3D do scrub do hero.
 * Escrito pelo ScrollTrigger (Hero.tsx), lido no useFrame (cena 3D).
 * Objeto mutável de propósito — zero re-render, zero GC no loop.
 */
export const heroProgress = { value: 0 };
