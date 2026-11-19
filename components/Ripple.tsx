"use client";

import { useCallback, useState } from "react";

/**
 * Efeito ripple (ondulação) no click — Material Design style.
 * Acessível: button nativo, onKeyDown.
 */
export function Ripple({
  children,
  className,
  color = "currentColor",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; size: number; key: number }>
  >([]);

  const triggerRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      // Para eventos de teclado, centraliza o ripple
      if (e instanceof KeyboardEvent) {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        setRipples((prev) => [...prev, { x, y, size, key: Date.now() + Math.random() }]);
        return;
      }

      // TypeScript narrowing: aqui e é MouseEvent
      const mouseEvent = e as React.MouseEvent<HTMLButtonElement>;
      const rect = mouseEvent.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = mouseEvent.clientX - rect.left - size / 2;
      const y = mouseEvent.clientY - rect.top - size / 2;

      setRipples((prev) => [...prev, { x, y, size, key: Date.now() + Math.random() }]);
    },
    [],
  );

  const onAnimationEnd = useCallback((key: number) => {
    setRipples((prev) => prev.filter((r) => r.key !== key));
  }, []);

  return (
    <button
      type="button"
      className={`relative overflow-hidden ${className}`}
      onClick={triggerRipple}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerRipple(e);
        }
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute pointer-events-none rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            opacity: 0.3,
            transformOrigin: "center",
          }}
          onAnimationEnd={() => onAnimationEnd(ripple.key)}
        />
      ))}
    </button>
  );
}
