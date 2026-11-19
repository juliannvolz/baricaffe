"use client";

import Image from "next/image";
import { Magnetic } from "@/components/Magnetic";
import { gifts } from "@/lib/content";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import basket from "@/public/assets/cesta1-1280w.avif";

/**
 * Presentes e encomendas: a oferta de maior valor percebido da casa.
 * Sem preço inventado; o CTA é orçamento com intenção.
 */
export function Offer() {
  const ref = useFadeReveal({ stagger: 0.1 });

  return (
    <section
      ref={ref}
      id="presentes"
      aria-label="Presentes e encomendas"
      className="bg-ground px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:gap-8">
        <figure data-reveal className="relative aspect-[4/5] overflow-hidden md:col-span-5">
          <Image
            src={basket}
            alt="Cesta de café da manhã da Bari com pães, morangos, waffles, queijos e doces"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            quality={86}
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          <figcaption className="absolute right-4 bottom-4 rounded-full bg-ground/85 px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase text-ink backdrop-blur-sm">
            feito para presentear
          </figcaption>
        </figure>

        <div className="md:col-span-7 md:pl-8">
          <p data-reveal className="mb-4 text-[0.65rem] tracking-[0.32em] uppercase opacity-55">
            Presenteie
          </p>
          <h2
            data-reveal
            className="font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.03em] text-balance"
          >
            Cesta montada, <em className="italic text-accent">presente resolvido</em>.
          </h2>
          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
            Cestas de café da manhã, brownies com flores e brunch para grupos. A caixa sai da Bari
            pronta para ser entregue — com fita, flor e recado.
          </p>

          <ul data-reveal className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {gifts.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[2.5rem_1fr] gap-3 py-4 gold-border-hover rounded-xl p-3 border border-ground/10 bg-ground/5"
              >
                <span className="text-[0.6rem] tracking-[0.2em] text-gold">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink/55">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={whatsappLink(whatsappMessages.offer)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-xs font-semibold tracking-wide text-ground transition-colors hover:bg-material"
              >
                Pedir orçamento
              </a>
            </Magnetic>
            <p className="max-w-[18rem] text-[0.62rem] leading-relaxed tracking-[0.12em] uppercase text-ink/45">
              flores frescas da Amariles · encomendas com antecedência
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
