"use client";

import Image from "next/image";
import { AmbientPetals } from "@/components/AmbientPetals";
import { Magnetic } from "@/components/Magnetic";
import { bari, whatsappLink, whatsappMessages } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";
import garden from "@/public/assets/area-externa2-1920w.avif";

/**
 * Fechamento híbrido: foto real + atmosfera animada (pétalas + brilho xícara).
 * Tipografia expandida, max-w-6xl, duas CTAs, horários.
 */
export function Close() {
  const ref = useFadeReveal({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="fim"
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-ink px-6 py-20 text-ground md:px-12 md:py-28"
    >
      {/* Foto base: área externa noturna */}
      <Image
        src={garden}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={82}
        className="object-cover opacity-30"
        style={{ objectPosition: "50% 52%" }}
      />

      {/* Gradientes de profundidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/98 via-ink/60 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      {/* Pétalas caindo — CSS-only */}
      <AmbientPetals />

      {/* Brilho sutil "xícara" canto inf. direito */}
      <span className="cup-glint" aria-hidden="true" />

      {/* Top bar: marca + localização */}
      <div className="relative z-10 flex items-center justify-between gap-4 text-[0.6rem] tracking-[0.24em] uppercase text-ground/55">
        <span>Bari Caffè</span>
        <span>
          {bari.city} · {bari.state}
        </span>
      </div>

      {/* Conteúdo principal — tipografia expandida */}
      <div className="relative z-10 my-16 max-w-6xl">
        <p data-reveal className="mb-5 text-[0.65rem] tracking-[0.32em] uppercase text-gold">
          Te esperamos
        </p>
        <h2
          data-reveal
          className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.045em] text-balance"
        >
          O próximo capítulo é <em className="italic text-accent">com você</em>.
        </h2>
        <p
          data-reveal
          className="mt-7 max-w-2xl text-base leading-relaxed text-ground/75 md:text-lg"
        >
          Reserve uma mesa, encomende um presente ou venha sem pressa. O café está pronto, a flor já
          foi escolhida, a xícara te espera.
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href={whatsappLink(whatsappMessages.close)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              Chamar no WhatsApp
            </a>
          </Magnetic>
          <a
            href={bari.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center rounded-full border border-ground/30 px-7 text-sm tracking-wide text-ground transition-colors hover:bg-ground hover:text-ink gold-border-hover"
          >
            Como chegar
          </a>
        </div>

        <div
          data-reveal
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2 text-[0.62rem] tracking-[0.18em] uppercase text-ground/50"
        >
          {bari.hours.map((entry) => (
            <span key={entry.days}>
              {entry.days} · {entry.time}
            </span>
          ))}
          <span>{bari.shortAddress}</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-ground/15 pt-5 text-[0.58rem] tracking-[0.14em] uppercase text-ground/40">
        <span>© 2026 Bari Caffè</span>
        <a
          href={bari.instagram}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ground"
        >
          @baricaffe
        </a>
        <span>site conceito · portfólio</span>
      </footer>
    </section>
  );
}
