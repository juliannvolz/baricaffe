"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { Magnetic } from "@/components/Magnetic";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";
import chocolate from "@/public/assets/doce-bari-1920w.avif";
import croissant from "@/public/assets/ig-csogzkou-2-1280w.avif";
import chocolateGlass from "@/public/assets/taça-doce-bari-1920w.avif";
import chocolateCup from "@/public/assets/xicara-bari-1920w.avif";

const ways = [
  {
    img: chocolate,
    alt: "Chocolate derretido com morangos frescos, bombons e granulado",
    label: "01 — Chocolate belga",
    note: "Chocolate quente, morangos frescos e bombons. O jeito mais generoso.",
  },
  {
    img: chocolateCup,
    alt: "Xícara rosa da Bari com borda de chocolate, creme e raspas",
    label: "02 — Chocolate quente",
    note: "Na xícara da casa, com creme e raspas de chocolate por cima.",
  },
  {
    img: chocolateGlass,
    alt: "Taça de chocolate com chantilly e bombom, sob as cerejeiras",
    label: "03 — Taça de chocolate",
    note: "Chocolate, chantilly e bombom. Para dividir no fim da tarde.",
  },
] as const;

/**
 * Momento de assinatura: o croissant em macro + palavra "chocolate" no scroll
 * (1ª cena). 2ª cena: três jeitos reais de provar o chocolate da casa.
 */
export function Signature() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Cena 1: croissant macro + palavra no scroll
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl1
          .fromTo(".sig-img", { scale: 1.16 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .fromTo(".sig-word", { xPercent: -8 }, { xPercent: 8, ease: "none", duration: 1 }, 0)
          .fromTo(".sig-copy", { y: 40 }, { y: 0, ease: "power2.out", duration: 0.6 }, 0.15)
          .to(".sig-scene-1", { opacity: 0, ease: "none", duration: 0.3 }, 0.7);

        // Cena 2: os três jeitos entram no último terço
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl2
          .fromTo(
            ".sig-scene-2",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.4 },
            0.55,
          )
          .fromTo(
            ".sig-detail",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.3, stagger: 0.08 },
            0.62,
          );

        // Parallax sutil nas imagens da cena 2
        gsap.fromTo(
          ".sig-detail img",
          { yPercent: -3, scale: 1.03 },
          {
            yPercent: 3,
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
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="assinatura"
      aria-label="O chocolate da Bari"
      className="relative overflow-hidden bg-ink text-ground md:h-[160vh]"
    >
      {/* Cena 1: croissant macro + palavra "chocolate" */}
      <div className="sig-scene-1 relative h-[78vh] overflow-hidden md:sticky md:top-0 md:h-screen md:w-full">
        <Image
          src={croissant}
          alt="Croissant coberto com chocolate belga, avelãs e trufa — close no chocolate derretido"
          fill
          sizes="100vw"
          quality={88}
          className="sig-img object-cover"
          style={{ objectPosition: "50% 35%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
        >
          <span className="sig-word whitespace-nowrap font-display text-[21vw] leading-none tracking-[-0.05em] text-ground/90 italic">
            chocolate
          </span>
        </div>

        <div className="sig-copy absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-12 md:pb-16">
          <div className="max-w-xl">
            <p className="mb-3 text-[0.65rem] tracking-[0.32em] uppercase text-accent">
              A assinatura
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              O chocolate é o <em className="italic text-accent">personagem</em>.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ground/75 md:text-base">
              Chocolate derretido na hora, avelã tostada e trufa. A camada que faz o croissant da
              Bari ser reconhecido antes da primeira mordida.
            </p>
            <Magnetic>
              <a
                href={whatsappLink(whatsappMessages.signature)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-xs font-semibold tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                Pedir o meu
              </a>
            </Magnetic>
          </div>
        </div>

        <p className="absolute top-24 right-6 hidden text-[0.58rem] tracking-[0.3em] uppercase text-ground/50 [writing-mode:vertical-rl] md:block">
          blend da casa · avelã tostada · trufa
        </p>
      </div>

      {/* Cena 2: três jeitos de provar o chocolate */}
      <div className="sig-scene-2 relative flex h-auto items-center justify-center px-6 py-16 opacity-100 md:h-[60vh] md:px-12 md:py-0 md:opacity-0">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 md:mb-8">
            <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none tracking-[-0.02em]">
              Três jeitos de provar <em className="italic text-accent">o mesmo chocolate</em>.
            </h3>
            <p className="text-[0.58rem] tracking-[0.28em] uppercase text-ground/45">
              servido todos os dias
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ways.map((item) => (
              <figure
                key={item.label}
                className="sig-detail group relative aspect-[4/5] overflow-hidden md:aspect-[4/3]"
              >
                <Image
                  src={item.img}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  quality={86}
                  className="sig-detail-img object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-ground md:p-6">
                  <p className="mb-1 text-[0.6rem] tracking-[0.2em] uppercase text-gold">
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed text-ground/80">{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
