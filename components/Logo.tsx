"use client";

import Image from "next/image";
import bronze from "@/public/brand/bari-wordmark-bronze.png";
import gold from "@/public/brand/bari-wordmark-gold.png";
import ivory from "@/public/brand/bari-wordmark-ivory.png";

const VARIANTS = { ivory, bronze, gold } as const;

export type LogoVariant = keyof typeof VARIANTS;

/**
 * Logo oficial da Bari (wordmark BARI + swash), extraída da arte da marca.
 * Três variantes empilhadas em crossfade: marfim sobre foto, bronze sobre creme,
 * dourado sobre escuro. O link é único — as imagens são decorativas.
 */
export function Logo({
  variant = "bronze",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <a
      href="#top"
      aria-label="Bari Caffè — voltar ao topo"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <span className="relative inline-flex">
        {(Object.keys(VARIANTS) as LogoVariant[]).map((key, index) => (
          <Image
            key={key}
            src={VARIANTS[key]}
            alt=""
            width={619}
            height={259}
            loading="eager"
            className={`h-8 w-auto transition-opacity duration-500 md:h-9 ${
              index === 0 ? "" : "absolute inset-0"
            } ${key === variant ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </span>
    </a>
  );
}
