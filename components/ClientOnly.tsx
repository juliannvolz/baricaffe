"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper que só renderiza filhos no client-side.
 * Evita problemas de hidratação com componentes que usam APIs do browser (Canvas, WebGL, etc).
 * No servidor, renderiza um div vazio com display: none para evitar mismatch de hidratação.
 * No client, renderiza os filhos normalmente.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // No servidor, renderiza um div vazio com display: none
    // Isso cria um nó DOM no servidor que pode ser substituído no client
    // sem causar mismatch de hidratação
    return (
      <div style={{ display: "none" }} aria-hidden="true">
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}