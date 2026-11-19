/**
 * Tokens do contrato de arte (ART-DIRECTION.md).
 * Única fonte de verdade para cor, tempo e easing — componentes não inventam valores.
 */

export const colors = {
  ground: "oklch(0.97 0.015 20)",
  ink: "oklch(0.25 0.06 30)",
  accent: "oklch(0.82 0.11 5)",
  material: "oklch(0.35 0.08 40)",
  /** Dourado da logo oficial (#C99A2E). Usado em ~5% da página: numeração, estrelas, filetes. */
  gold: "oklch(0.712 0.131 83.7)",
} as const;

/** Durações do sistema (ms). Fora disso é slop. */
export const duration = {
  micro: 180,
  base: 420,
  cinematic: 900,
} as const;

/** Eases autorais — um por papel, sem biblioteca de eases. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  soft: [0.16, 1, 0.3, 1] as const,
} as const;

/** Contatos e dados fixos do cliente (não hardcodar em componentes). */
export const bari = {
  name: "Bari Caffè",
  city: "Jaraguá do Sul",
  state: "SC",
  whatsapp: "https://wa.me/5547999552680",
  whatsappNumber: "47 99955-2680",
  instagram: "https://www.instagram.com/baricaffe",
  address: "R. Walter Marquardt, 1400 — Barra do Rio Molha, Jaraguá do Sul",
  shortAddress: "R. Walter Marquardt, 1400",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bari+Caff%C3%A8+Jaragu%C3%A1+do+Sul",
  hours: [
    { days: "Ter — Sáb", time: "12h — 20h" },
    { days: "Dom", time: "15h — 19h" },
  ],
  rating: "4,6",
  reviews: "790+",
  reviewsCount: "796",
  rank: "#1",
} as const;

/** Link de WhatsApp com intenção declarada. */
export function whatsappLink(message: string) {
  return `${bari.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const primaryMessage = "Olá! Vim pelo site da Bari e quero fazer um pedido.";

/** Mensagens contextuais por seção — CRO orientado a intenção. */
export const whatsappMessages = {
  hero: "Olá! Vi o site da Bari e quero reservar uma mesa.",
  menu: "Olá! Quero ver o cardápio completo e fazer um pedido.",
  signature: "Olá! Quero garantir meu croissant de chocolate.",
  place: "Olá! Quero ir aí hoje, tem vaga?",
  detail: "Olá! Quero encomendar um doce com flor e recado personalizado.",
  season: "Olá! Quero reservar para o fondue de sexta/sábado.",
  offer: "Olá! Quero orçamento para cesta/brunch/brownie para presente.",
  info: "Olá! Quero ir aí hoje, tem vaga?",
  close: "Olá! Quero reservar uma mesa na Bari.",
} as const;
