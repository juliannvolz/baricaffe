"use client";

import Image from "next/image";
import { Magnetic } from "@/components/Magnetic";
import { bari, whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import garden from "@/public/assets/area-externa3-1920w.webp";

/**
 * Objeção final: onde fica, que horas abre, como chegar e como pedir.
 * Um bloco denso, sem mapa falso e sem iframe pesado.
 */
export function Info() {
  const ref = useFadeReveal({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="visitar"
      aria-label="Horários, endereço e contato"
      className="bg-material px-6 py-24 text-ground md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-reveal className="mb-4 text-[0.65rem] tracking-[0.32em] uppercase opacity-60">
              Visitar
            </p>
            <h2
              data-reveal
              className="font-display max-w-4xl text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.03em] text-balance"
            >
              Fácil de achar. <em className="italic text-accent">Difícil de esquecer.</em>
            </h2>
          </div>
          <a
            data-reveal
            href={bari.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-ground/25 px-6 text-xs tracking-wide transition-colors hover:bg-ground hover:text-ink"
          >
            Abrir no Google Maps
          </a>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-6">
          <figure data-reveal className="relative aspect-[4/3] overflow-hidden md:col-span-7">
            <Image
              src={garden}
              alt="Área externa da Bari com guarda-sol rosa, mesas e o arco de cerejeira da entrada"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              quality={84}
              className="object-cover"
              style={{ objectPosition: "50% 58%" }}
            />
            <figcaption className="absolute right-4 bottom-4 rounded-full bg-ink/70 px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase text-ground backdrop-blur-sm">
              Barra do Rio Molha
            </figcaption>
          </figure>

          <div className="grid gap-8 md:col-span-5 md:pl-4">
            <div data-reveal>
              <h3 className="text-[0.6rem] tracking-[0.28em] uppercase opacity-55">Horários</h3>
              <ul className="mt-3 space-y-2">
                {bari.hours.map((entry) => (
                  <li
                    key={entry.days}
                    className="flex items-baseline justify-between gap-4 border-b border-ground/15 pb-2 text-sm"
                  >
                    <span className="opacity-70">{entry.days}</span>
                    <span className="font-medium">{entry.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <h3 className="text-[0.6rem] tracking-[0.28em] uppercase opacity-55">Endereço</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ground/80">{bari.address}</p>
              <a
                href={bari.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs tracking-[0.16em] uppercase text-accent underline-offset-4 hover:underline"
              >
                Como chegar →
              </a>
            </div>

            <div data-reveal className="flex flex-wrap gap-2">
              <Magnetic>
                <a
                  href={whatsappLink(whatsappMessages.info)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-xs font-semibold tracking-wide text-ink transition-transform hover:scale-[1.03]"
                >
                  Chamar no WhatsApp
                </a>
              </Magnetic>
              <a
                href={bari.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-ground/25 px-6 text-xs tracking-wide transition-colors hover:bg-ground hover:text-ink"
              >
                @baricaffe
              </a>
            </div>
          </div>
        </div>

        <div
          data-reveal
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ground/15 pt-5 text-[0.62rem] tracking-[0.18em] uppercase text-ground/50"
        >
          <span>delivery somente em Jaraguá do Sul</span>
          <span>cidades vizinhas pelo WhatsApp {bari.whatsappNumber}</span>
        </div>
      </div>
    </section>
  );
}
