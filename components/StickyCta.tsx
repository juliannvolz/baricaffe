"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappLink, whatsappMessages } from "@/lib/tokens";

type SectionKey = keyof typeof whatsappMessages;

interface CtaConfig {
  /** Atalho da ação secundária: leva para a próxima seção útil. */
  anchor: string;
  label: string;
  message: string;
}

const CTA: Record<SectionKey, CtaConfig> = {
  hero: { anchor: "#cardapio", label: "Cardápio", message: whatsappMessages.hero },
  menu: { anchor: "#presentes", label: "Presentes", message: whatsappMessages.menu },
  signature: { anchor: "#cardapio", label: "Cardápio", message: whatsappMessages.signature },
  place: { anchor: "#visitar", label: "Visitar", message: whatsappMessages.place },
  detail: { anchor: "#presentes", label: "Presentes", message: whatsappMessages.detail },
  season: { anchor: "#visitar", label: "Visitar", message: whatsappMessages.season },
  offer: { anchor: "#cardapio", label: "Cardápio", message: whatsappMessages.offer },
  info: { anchor: "#cardapio", label: "Cardápio", message: whatsappMessages.info },
  close: { anchor: "#cardapio", label: "Cardápio", message: whatsappMessages.close },
};

/** Ordem real do DOM — o id é o que existe na página, a key é a intenção. */
const SECTIONS: { id: string; key: SectionKey }[] = [
  { id: "top", key: "hero" },
  { id: "cardapio", key: "menu" },
  { id: "assinatura", key: "signature" },
  { id: "lugar", key: "place" },
  { id: "detalhe", key: "detail" },
  { id: "ritmo", key: "season" },
  { id: "presentes", key: "offer" },
  { id: "visitar", key: "info" },
  { id: "fim", key: "close" },
];

/**
 * CTA sticky mobile: a seção visível define a intenção da mensagem do WhatsApp.
 * A ação secundária sempre aponta para uma âncora que existe.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionKey>("hero");
  const frameRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      frameRef.current = 0;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setVisible(scrollY > viewportHeight * 0.7);

      const end = document.getElementById("fim");
      if (end) setAtEnd(end.getBoundingClientRect().top < viewportHeight * 0.5);

      let next: SectionKey = "hero";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < viewportHeight * 0.45) next = section.key;
      }
      setCurrentSection((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const show = visible && !atEnd;
  const cta = CTA[currentSection];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ground/95 px-3 sm:px-4 pt-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <a
          href={cta.anchor}
          className="inline-flex shrink-0 min-h-11 items-center justify-center rounded-full border border-ink/20 px-3 sm:px-4 text-[0.62rem] sm:text-xs tracking-wide text-ink"
          tabIndex={show ? 0 : -1}
        >
          {cta.label}
        </a>
        <a
          href={whatsappLink(cta.message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 min-h-11 min-w-[260px] max-w-full items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold tracking-wide text-ground text-wrap text-balance"
          tabIndex={show ? 0 : -1}
        >
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
}
