"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Magnetic } from "@/components/Magnetic";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import sweetSavory from "@/public/assets/doce-salgado-1280w.avif";
import giftBox from "@/public/assets/presente1-1280w.avif";

/**
 * O detalhe que não aparece no cardápio: flor, fita e recado.
 * Split assimétrico com duas fotos em camadas.
 */
export function Detail() {
  const sectionRef = useFadeReveal({ stagger: 0.08, delay: 0.1 });

  // Parallax nas imagens
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Drink image: parallax suave
      gsap.fromTo(
        ".detail-drink",
        { yPercent: -5, scale: 1.05 },
        {
          yPercent: 5,
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

      // Cake image: parallax inverso
      gsap.fromTo(
        ".detail-cake",
        { yPercent: 5, scale: 1.05 },
        {
          yPercent: -5,
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
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="detalhe"
      aria-label="Os detalhes da Bari"
      className="bg-ground px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:sticky md:top-28 md:col-span-5 md:self-start">
            <p data-reveal className="mb-4 text-[0.65rem] tracking-[0.32em] uppercase opacity-55">
              Nos detalhes
            </p>
            <h2
              data-reveal
              className="font-display text-[clamp(2.3rem,4.8vw,4.4rem)] leading-[0.94] tracking-[-0.03em] text-balance"
            >
              Cada prato sai com flor, fita e <em className="italic text-accent">recado</em>.
            </h2>
            <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
              O cuidado que não cabe no cardápio: a flor escolhida, a fita amarrada à mão e o recado
              que faz a mesa ser lembrada depois.
            </p>

            <ul data-reveal className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {[
                ["01", "Flor fresca", "Selecionada para cada pedido."],
                ["02", "Fita da Bari", "Amarrada à mão, sem pressa."],
                ["03", "Recado", "Escrito para quem vai receber."],
              ].map(([number, title, note]) => (
                <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-3 py-3.5">
                  <span className="text-[0.6rem] tracking-[0.2em] text-gold">{number}</span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs leading-relaxed text-ink/55">{note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Magnetic>
              <a
                data-reveal
                href={whatsappLink(whatsappMessages.detail)}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-xs font-semibold tracking-wide text-ground transition-colors hover:bg-material"
              >
                Encomendar o seu
              </a>
            </Magnetic>

            <div data-reveal className="mt-12 max-w-sm border-t border-ink/10 pt-5">
              <p className="font-display text-lg italic leading-snug text-ink/80">
                “A flor é da Amariles, a florista que já virou parte da casa.”
              </p>
              <p className="mt-3 text-[0.58rem] tracking-[0.2em] uppercase text-ink/45">
                Floricultura parceira · Jaraguá do Sul
              </p>
            </div>
          </div>

          <div className="md:col-span-7 md:pl-8">
            <figure data-reveal className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
              <Image
                src={giftBox}
                alt="Caixa da Bari com fita, bolo e buquê de flores frescas"
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                quality={86}
                className="detail-drink object-cover"
                style={{ objectPosition: "50% 42%" }}
              />
              <figcaption className="absolute right-4 bottom-4 rounded-full bg-ground/85 px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase text-ink backdrop-blur-sm">
                flor, fita e recado
              </figcaption>
            </figure>

            <figure
              data-reveal
              className="relative -mt-12 ml-auto w-[58%] border-8 border-ground md:-mt-16 md:w-[48%]"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={sweetSavory}
                  alt="Croissant com rúcula e pão de mel com cobertura de matcha, vistos de cima"
                  fill
                  sizes="(min-width: 768px) 28vw, 58vw"
                  quality={86}
                  className="detail-cake object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[0.6rem] tracking-[0.16em] uppercase text-ink/50">
                doce &amp; salgado
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
