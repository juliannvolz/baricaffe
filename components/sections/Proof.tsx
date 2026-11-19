"use client";

import { useCallback, useState } from "react";
import { reviews, stats } from "@/lib/content";
import { bari } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";

/**
 * Prova social: números reais à esquerda, depoimentos reais do Google à direita.
 * Carrossel manual (sem autoplay) para não competir com o scroll.
 */
export function Proof() {
  const ref = useFadeReveal({ stagger: 0.08 });
  const [current, setCurrent] = useState(0);
  const review = reviews[current] ?? reviews[0];

  const go = useCallback((dir: 1 | -1) => {
    setCurrent((prev) => (prev + dir + reviews.length) % reviews.length);
  }, []);

  return (
    <section
      ref={ref}
      id="prova"
      aria-label="Avaliações e especialidades"
      className="border-y border-ground/10 bg-ink px-6 py-16 text-ground md:px-12 md:py-24"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:gap-10">
        {/* Números */}
        <div className="md:col-span-4">
          <p data-reveal className="text-[0.65rem] tracking-[0.32em] uppercase text-ground/55">
            A cidade já provou
          </p>
          <h2
            data-reveal
            className="mt-4 font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.03em] text-balance"
          >
            Quem entra, <em className="italic text-gold">volta</em>.
          </h2>

          <dl className="mt-10 grid grid-cols-3 gap-4 md:mt-12 md:block">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-reveal
                className="border-t border-ground/15 pt-3 md:flex md:items-baseline md:gap-4 md:pt-4 md:pb-4"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-none tracking-[-0.03em]">
                  {stat.value}
                </dd>
                <dd className="mt-1.5 text-[0.7rem] leading-snug text-ground/55 md:mt-0 md:text-xs">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Depoimentos */}
        <div data-reveal className="flex flex-col md:col-span-8 md:pl-10">
          <div
            className="flex flex-1 flex-col justify-between gap-8 border-t border-ground/15 pt-6 md:pt-8"
            aria-live="polite"
          >
            <blockquote className="min-h-[9.5rem] md:min-h-[11rem] gold-border-hover rounded-xl p-6 md:p-8 bg-ground/5 border-ground/15">
              <p className="font-display text-[clamp(1.35rem,2.35vw,2.15rem)] leading-[1.24] tracking-[-0.015em] text-ground/90 text-balance">
                “{review.text}”
              </p>
              <footer className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ground/10 font-display text-sm text-ground/80"
                >
                  {review.avatar}
                </span>
                <span className="text-xs font-medium tracking-wide text-ground">
                  {review.author}
                </span>
                <span
                  className="flex gap-0.5 text-[0.7rem] text-gold"
                  role="img"
                  aria-label={`${review.rating} de 5 estrelas`}
                >
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </span>
                <span className="text-[0.6rem] tracking-[0.14em] uppercase text-ground/40">
                  {review.source}
                </span>
              </footer>
            </blockquote>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Depoimento anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/15 text-ground/70 transition-colors hover:border-ground/40 hover:text-ground"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próximo depoimento"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/15 text-ground/70 transition-colors hover:border-ground/40 hover:text-ground"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <fieldset className="flex items-center gap-2.5" aria-label="Escolher depoimento">
                {reviews.map((item, i) => (
                  <button
                    key={item.author}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Depoimento ${i + 1} de ${reviews.length}`}
                    aria-current={i === current}
                    className={`h-[3px] transition-all duration-300 ${
                      i === current ? "w-8 bg-gold" : "w-4 bg-ground/25 hover:bg-ground/45"
                    }`}
                  />
                ))}
              </fieldset>

              <span className="font-display text-xs tabular-nums text-ground/40">
                {String(current + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
              </span>

              <a
                href={bari.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-[0.62rem] tracking-[0.16em] uppercase text-ground/55 underline-offset-4 transition-colors hover:text-ground hover:underline"
              >
                Ler no Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
