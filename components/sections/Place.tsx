"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { bari } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import interior from "@/public/assets/area-interna4-1920w.avif";

/**
 * O lugar é parte do pedido: full-bleed com parallax leve e overprint.
 * Nenhum card, nenhuma moldura — a foto é a seção.
 */
export function Place() {
  const sectionRef = useFadeReveal({ stagger: 0.06, delay: 0.1 });

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Imagem: parallax mais pronunciado + scale suave
      gsap.fromTo(
        ".place-img",
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      // Texto: parallax inverso sutil (move mais devagar que o scroll)
      gsap.fromTo(
        ".place-copy",
        { yPercent: 10, opacity: 0.6 },
        {
          yPercent: -10,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="lugar"
      aria-label="O lugar"
      className="relative overflow-hidden bg-ink text-ground"
    >
      <div className="relative h-[88vh] overflow-hidden md:h-[105vh]">
        <Image
          src={interior}
          alt="Salão da Bari Caffè com lustre de cristal, cortinas rosas, cerejeira e poltronas de veludo"
          fill
          sizes="100vw"
          quality={86}
          className="place-img object-cover"
          style={{ objectPosition: "50% 55%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between px-6 py-24 md:px-12 md:py-28">
          <div className="flex items-start justify-between gap-6" data-reveal>
            <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ground/70">O lugar</p>
            <a
              href={bari.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-[0.65rem] tracking-[0.2em] uppercase text-ground/60 underline-offset-4 hover:text-ground hover:underline"
            >
              @baricaffe →
            </a>
          </div>

          <div className="max-w-4xl place-copy" data-reveal>
            <h2 className="font-display text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] tracking-[-0.035em] text-balance">
              Um café que parece <em className="italic text-accent">um jardim</em>.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ground/75 md:text-base">
              Cortinas rosas, cerejeiras, lustre de cristal e as poltronas de veludo que já viraram
              parte da casa. O lugar não é cenário: é o motivo de muita gente voltar.
            </p>
            <p className="mt-6 text-[0.62rem] tracking-[0.24em] uppercase text-ground/45">
              {bari.shortAddress} · {bari.city}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ground/15 px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 text-[0.6rem] tracking-[0.24em] uppercase text-ground/45">
          <span>cortinas rosas</span>
          <span>cerejeiras</span>
          <span>lustre de cristal</span>
          <span>poltronas de veludo</span>
        </div>
      </div>
    </section>
  );
}
