"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { menuItems } from "@/lib/content";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";

/**
 * Cardápio como galeria horizontal pinada no desktop (1 scrub) e scroll-snap
 * nativo no mobile. Oito itens reais, sem preço inventado.
 */
export function Menu() {
  const sectionRef = useFadeReveal({ stagger: 0.06, delay: 0.1 });
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="cardapio"
      aria-label="Cardápio da Bari"
      className="relative overflow-hidden bg-ground pt-20 pb-28 md:h-dvh md:py-0"
    >
      <div className="md:flex md:h-full md:flex-col md:justify-start md:pt-24 md:pb-6">
        <header className="menu-header mx-auto flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-6 px-6 md:px-12">
          <div data-reveal>
            <p className="mb-3 text-[0.65rem] tracking-[0.32em] uppercase opacity-60">O cardápio</p>
            <h2 className="font-display max-w-4xl text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[0.92] tracking-[-0.03em] text-balance">
              O clássico, no ponto.
              <br />
              <em className="italic text-accent">O contemporâneo</em>, no detalhe.
            </h2>
          </div>
          <div data-reveal className="flex items-center gap-4 pb-2">
            <span className="text-[0.65rem] tracking-[0.22em] uppercase opacity-55">
              {menuItems.length.toString().padStart(2, "0")} itens
            </span>
            <a
              href={whatsappLink(whatsappMessages.menu)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/20 px-5 text-xs tracking-wide transition-colors hover:bg-ink hover:text-ground"
            >
              Ver completo
            </a>
          </div>
        </header>

        <section
          aria-label="Cardápio — arraste para o lado"
          className="mt-8 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] md:mt-10 md:overflow-visible md:pb-0"
        >
          <div
            ref={trackRef}
            className="flex w-max snap-x snap-mandatory gap-4 px-6 md:gap-6 md:px-12"
          >
            {menuItems.map((item, index) => (
              <article
                key={item.name}
                className="menu-card group w-[76vw] max-w-[330px] shrink-0 snap-start md:w-[38vw] md:max-w-none lg:w-[30vw] xl:w-[22vw] gold-border-hover rounded-2xl bg-ground border border-ground/15 p-4"
                data-reveal
              >
                <div className="relative h-[46vh] max-h-[520px] min-h-[300px] overflow-hidden bg-blush md:h-[38vh]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 38vw, 76vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-ground/85 px-3 py-1 text-[0.55rem] tracking-[0.2em] uppercase text-ink backdrop-blur-sm">
                    {item.tag}
                  </span>
                  <span className="absolute right-3 bottom-3 font-display text-[0.8rem] tracking-[0.16em] text-ground/80">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl leading-tight tracking-[-0.02em] md:text-[1.7rem]">
                  {item.name}
                </h3>
                <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-ink/65">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer
          data-reveal
          className="mx-auto hidden w-full max-w-[1600px] items-center justify-between gap-6 px-6 pt-8 md:flex md:px-12"
        >
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-ink/45">
            arraste para o lado · ou peça pelo WhatsApp
          </p>
          <span className="text-[0.65rem] tracking-[0.22em] uppercase text-ink/45">
            Bari Caffè · Jaraguá do Sul
          </span>
        </footer>
      </div>
    </section>
  );
}
