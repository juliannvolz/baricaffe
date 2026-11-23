"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { useRef } from "react";
import HeroScene from "@/components/HeroScene";
import { Magnetic } from "@/components/Magnetic";
import CupWrapper from "@/components/three/CupScene";
import { heroProgress } from "@/lib/scroll-progress";
import { bari, whatsappLink, whatsappMessages } from "@/lib/tokens";
import gardenNight from "@/public/assets/area-externa4-1920w.webp";
import chocolateGlass from "@/public/assets/taça-doce-bari-1920w.webp";

/**
 * Herói: produto real em duas camadas (jardim ao pôr do sol -> chocolate),
 * tipografia cinética, pétalas 3D como profundidade e CTA acima da dobra.
 * Scrub 190vh mobile / 280vh desktop.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, SplitText);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            heroProgress.value = self.progress;
          },
        },
      });

      tl.to(".hero-photo-a", { scale: 1.12, opacity: 0, ease: "none", duration: 0.55 }, 0)
        .fromTo(
          ".hero-photo-b",
          { opacity: 0, scale: 1.14 },
          { opacity: 1, scale: 1, ease: "none", duration: 0.45 },
          0.3,
        )
        .to(".hero-tint", { opacity: 0.35, ease: "none", duration: 0.25 }, 0.18)
        .to(".hero-tint", { opacity: 0.04, ease: "none", duration: 0.3 }, 0.55)
        .to(".hero-content", { yPercent: -12, opacity: 0, ease: "none", duration: 0.3 }, 0.45)
        .to(".hero-cue", { opacity: 0, duration: 0.1 }, 0.1);

      return () => {
        heroProgress.value = 0;
      };
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!sectionRef.current || !titleRef.current) return;
      if (typeof window !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const split = new SplitText(titleRef.current, {
        type: "lines,words",
        linesClass: "hero-line",
        wordsClass: "hero-word",
      });

      gsap
        .timeline({ delay: 0.2 })
        .from(split.words, {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.045,
        })
        .from(".hero-kicker", { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" }, "-=0.55")
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" }, "-=0.45")
        .from(
          ".hero-cta",
          { opacity: 0, y: 14, duration: 0.5, ease: "power2.out", stagger: 0.09 },
          "-=0.4",
        )
        .from(".hero-proof", { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" }, "-=0.4");

      return () => split.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[190vh] bg-ink text-ground md:h-[280vh]"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={gardenNight}
            alt="Jardim da Bari ao pôr do sol, visto através do arco de flores, com guarda-sóis e mesas"
            fill
            priority
            sizes="100vw"
            quality={84}
            className="hero-photo-a object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          <Image
            src={chocolateGlass}
            alt="Duas taças de chocolate com chantilly e bombom, sob as cerejeiras da Bari"
            fill
            priority
            sizes="100vw"
            quality={86}
            className="hero-photo-b object-cover opacity-0"
            style={{ objectPosition: "50% 40%" }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-transparent to-transparent" />
        <div className="hero-tint pointer-events-none absolute inset-0 bg-material opacity-0" />

        <HeroScene petalCount={56} />

        {/* Xícara 3D — lado direito, desktop only */}
        <CupWrapper />

        <div className="hero-content absolute inset-0 z-10 flex flex-col justify-end px-6 pt-28 pb-24 md:px-12 md:pb-16">
          <div className="max-w-6xl">
            <p className="hero-kicker mb-4 text-[0.68rem] tracking-[0.32em] uppercase opacity-75">
              Cafeteria &amp; doceria · {bari.city}
            </p>

            <h1
              ref={titleRef}
              aria-label="Clássico e contemporâneo"
              className="font-display max-w-5xl text-[clamp(3rem,9.5vw,8.5rem)] leading-[0.9] tracking-[-0.035em] text-balance"
            >
              Clássico &amp;
              <br />
              <em className="italic text-accent">contemporâneo</em>
            </h1>

            <p className="hero-sub mt-6 max-w-xl text-base leading-relaxed text-ground/85 md:text-lg">
              Croissant de chocolate belga, red velvet e o chocolate quente rosa que virou tradição.
              Um café que parece um jardim, no coração de {bari.city}.
            </p>

            <div className="hero-proof mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] tracking-[0.16em] uppercase text-ground/75">
              <span>
                <strong className="text-gold">{bari.rating}★</strong> no Google
              </span>
              <span className="h-3 w-px bg-ground/25" aria-hidden="true" />
              <span>{bari.reviews} avaliações</span>
              <span className="h-3 w-px bg-ground/25" aria-hidden="true" />
              <span>{bari.rank} no TripAdvisor</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  className="hero-cta inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-[1.03]"
                  href={whatsappLink(whatsappMessages.hero)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chamar no WhatsApp
                </a>
              </Magnetic>
              <a
                className="hero-cta inline-flex min-h-12 items-center justify-center rounded-full border border-ground/35 bg-ground/5 px-7 py-3.5 text-sm tracking-wide text-ground backdrop-blur-sm transition-colors hover:bg-ground/15"
                href="#cardapio"
              >
                Ver o cardápio
              </a>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-[0.62rem] tracking-[0.28em] uppercase text-ground/55 [writing-mode:vertical-rl] md:block">
          Ter–Sáb 12h–20h · Dom 15h–19h
        </div>

        <p className="hero-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.62rem] tracking-[0.32em] uppercase text-ground/60">
          role para provar ↓
        </p>
      </div>
    </section>
  );
}
