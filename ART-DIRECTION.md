# Bari Caffè v2 — Art Direction

**Sentence:** On this page, the real place replaces any 3D object — the interior photo crossfades into the croissant, petals fall as atmospheric depth, and "Clássico & contemporâneo" stops being a tagline and becomes the rhythm of the scroll.

## Ground / Ink / Accent

| Token | OKLCH | Uso |
|---|---|---|
| `--ground` | `oklch(0.97 0.015 20)` | Off-white rosado — papel da página |
| `--ink` | `oklch(0.25 0.06 30)` | Chocolate profundo — texto e massas |
| `--accent` | `oklch(0.82 0.11 5)` | Rosa Bari — momentos, nunca fundos inteiros |
| `--material` | `oklch(0.35 0.08 40)` | Caramelo/café — blocos de contraste e sombra quente |
| `--blush` | `oklch(0.92 0.04 5)` | Fundo leve para cards e tags |

## Type

- **Display:** Fraunces (serif editorial) — títulos gigantes, leading 0.95, tracking -0.02em. Carrega o "clássico".
- **Text:** Manrope — corpo, labels, botões. Carrega o "contemporâneo".
- Display nunca abaixo de 2.5rem em desktop; escala fluida via clamp().

## Hero object

**Foto real em duas camadas (lugar → croissant) + SplitText cinético + campo de pétalas 3D atmosférico.** Nenhum objeto 3D substituindo o produto. Fallback reduced-motion: tela estática 100dvh, conteúdo todo visível.

## Narrative (12 frames)

| # | Frame | Vê | Move | Entende |
|---|---|---|---|---|
| 01 | Entrada | Salão real (interior) + kicker | Foto interior parada | "lugar verdadeiro" |
| 02 | Tensão | Foto faz crossfade pro croissant | Scrub 0-0.55 | "o produto é o herói" |
| 03 | Promessa | "Clássico & contemporâneo" | SplitText sobe linha a linha | posicionamento |
| 04 | Prova | 4.6★ + 780 aval + #1 TripAdvisor | números aparecem com o texto | confiança |
| 05 | Ação | WhatsApp + Ver cardápio | CTAs pulam | conversão |
| 06 | Cardápio | 8 itens reais em galeria horizontal pinada | arraste / scroll-snap | variedade real |
| 07 | Assinatura | Croissant macro pinned + "chocolate" atravessa | scrub horizontal | o chocolate é protagonista |
| 08 | Lugar | Interior full-bleed com parallax leve | scroll revela texto | atmosfera |
| 09 | Detalhe | Drink + bolo em camadas + flor/fita/recado | revelação assimétrica | cuidado |
| 10 | Ritmo | Timeline do dia + fondue | reveal + CTA reserva | sempre motivo |
| 11 | Oferta | Presentes + encomendas + flores Amariles | photo + 3 cards | dar pra presente |
| 12 | Fechamento | "Te esperamos" + CTA final | sticky hide no fim | agir agora |

## Signature interaction

**Croissant macro pinado (200vh desktop) + palavra "chocolate" desliza horizontal** — a única cena pinned longa. Reduced motion: altura auto, conteúdo todo visível, sem scrub.

## Overrides of house rules

| Efeito | Role | Restraint | Fallback | Evidence |
|---|---|---|---|---|
| Grain rosado (low opacity) | Materialidade do "clássico" (papel) | 1 camada global | Página idêntica sem grain | Decoração rosada da casa |
| Pétalas 3D (InstancedMesh) | Profundidade atmosférica, não objeto | 56 desktop / 24 mobile, opacity 0.62 | Sem pétalas (reduced) | Pétalas de cerejeira no salão |
| Marquee (prova social) | Movimento contínuo de credibilidade | 1 instância, overflow-hidden | Estático | Faixa de prova no hero |
| Horizontal pin (cardápio) | Galeria de produto real | 1 scrub, snap no mobile | Grid mobile | Cardápio físico é horizontal |
| Foto real crossfade | Produto real, não primitiva | 2 fotos, 1 scrub | Foto única | Croissant é o herói |

## Motion budget

| Tipo | Qtd | Nota |
|---|---|---|
| Scroll pin/scrub | 2 | Hero (2 camadas) + Cardápio (horizontal) + Assinatura (palavra) |
| Entrance reveals | 4 | Hero typography + 3 seções (Proof/Detail/Close) |
| Interativo | 1 | Cursor-pétala (desktop) |
| Som ambiente | 1 | Jazz acústico, muted por padrão, toggle discreto |

## Non-goals

- NÃO é cardápio digital completo (o Goomer continua sendo o pedido online).
- NÃO tem e-commerce/checkout.
- NÃO tem blog.
- NÃO concorre com o Instagram — alimenta ele (CTA @baricaffe).

## Aceite visual (shots)

- Desktop 1440×900: 0 hidden reveals, 0 overflow, LCP < 2.5s, CLS 0, 60fps
- Mobile 390×844: 0 hidden reveals, 0 overflow, LCP < 2.5s, CLS 0, 60fps
- Tablet 768×1024: layout adapta, menu horizontal com 3 cards + peek
- Reduced motion: 0 canvas, 0 hidden reveals, conteúdo 100% visível