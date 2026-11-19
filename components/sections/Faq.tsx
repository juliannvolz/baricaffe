"use client";

import { faqs } from "@/lib/content";
import { whatsappLink } from "@/lib/tokens";
import { useFadeReveal } from "@/lib/useSectionReveal";

/**
 * Objeções reais: reserva, fondue, encomenda, entrega e horário.
 * <details> nativo: funciona sem JS e é acessível por teclado.
 */
export function Faq() {
  const ref = useFadeReveal({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="duvidas"
      aria-label="Dúvidas frequentes"
      className="bg-blush px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p data-reveal className="mb-4 text-[0.65rem] tracking-[0.32em] uppercase opacity-55">
            Antes de vir
          </p>
          <h2
            data-reveal
            className="font-display text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[0.94] tracking-[-0.03em] text-balance"
          >
            O que você precisa <em className="italic text-accent">saber</em>.
          </h2>
          <p data-reveal className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65">
            Se a sua dúvida não estiver aqui, chame no WhatsApp. A gente responde antes de você sair
            de casa.
          </p>
          <a
            data-reveal
            href={whatsappLink("Olá! Tenho uma dúvida sobre a Bari.")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-ink/25 px-6 text-xs font-semibold tracking-wide transition-colors hover:bg-ink hover:text-ground"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div data-reveal className="md:col-span-8 md:pl-8">
          {faqs.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group border-b border-ink/15 py-5 gold-focus"
            >
              <summary className="flex items-center justify-between gap-4">
                <span className="text-base font-medium tracking-tight md:text-lg">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="faq-plus flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 text-lg leading-none transition-transform duration-300"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-3 text-sm leading-relaxed text-ink/65">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
