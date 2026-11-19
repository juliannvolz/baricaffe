"use client";

import type { ReactNode } from "react";
import { useLenis } from "@/lib/useLenis";

/**
 * Dono único do scroll suave. Não renderiza nada — só liga o Lenis.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useLenis(true);
  return <>{children}</>;
}
