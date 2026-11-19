"use client";

import Image from "next/image";
import { Magnetic } from "@/components/Magnetic";
import { timeline } from "@/lib/content";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import fondue from "@/public/assets/ig-fondue-cover-800w.avif";

/**
 * O ritmo do dia: brunch, café da tarde, fondue e fechamento.
 * Substitui a antiga seção "só no fim de semana" por uma linha do tempo real.
 */
export function Season() {
  const ref = useFadeReveal({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="ritmo"
      aria-label="O ritmo da casa"
      className="bg-material px-6 py-24 text-ground md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p data-reveal className="mb-4 text-[0.65rem] tracking-[0.32em] uppercase opacity-60">
            O ritmo da casa
          </p>
          <h2
            data-reveal
            className="font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.03em] text-balance"
          >
            Da primeira xícara ao último <em className="italic text-accent">fondue</em>.
          </h2>
          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-ground/70">
            A casa muda de ritmo ao longo do dia. Tem hora de brunch, hora de croissant e hora de
            dividir uma panela do nosso blend quente.
          </p>

          <figure data-reveal className="relative mt-8 aspect-[4/5] overflow-hidden md:mt-10">
            <Image
              src={fondue}
              alt="Fondue de chocolate com frutas, marshmallows e pão de mel"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={86}
              className="object-cover"
            />
            <figcaption className="absolute right-4 bottom-4 rounded-full bg-ink/70 px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase text-ground backdrop-blur-sm">
              sexta e sábado
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-7 md:pt-14">
          <ol data-reveal className="border-t border-ground/20">
            {timeline.map((item) => (
              <li
                key={item.time}
                className="group grid grid-cols-[4.5rem_1fr] gap-4 border-b border-ground/20 py-6 md:grid-cols-[6rem_1fr] md:py-8"
              >
                <span className="font-display text-2xl leading-none text-gold md:text-3xl">
                  {item.time}
                </span>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl leading-none tracking-[-0.02em] md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-ground/65">
                      {item.note}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden text-lg text-ground/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent md:block"
                  >
                    →
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={whatsappLink(whatsappMessages.season)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-xs font-semibold tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                Reservar uma mesa
              </a>
            </Magnetic>
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-ground/45">
              grupos pelo WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
