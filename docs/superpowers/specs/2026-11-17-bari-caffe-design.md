# Bari Caffè Demo — Design Doc (2026-11-17)

## Intent & why

Demo de prospecção para a Bari Caffè (cafeteria, Barra do Rio Molha, Jaraguá do Sul). Objetivo: transformar a casa mais instagramável da cidade (94,5K seguidores, #1 no TripAdvisor, ~780 avaliações Google 4.6) no site mais bonito da cidade, como peça de portfólio para fechar o primeiro cliente (ticket R$350) e abrir réplicas em outros segmentos.

## Goals

- One-page cinematográfico com narrativa de 12 frames (ver ART-DIRECTION.md)
- Hero 3D em R3F: xícara + pour de chocolate scroll-driven (signature interaction)
- Fotos reais da casa (públicas: TripAdvisor, Google Maps, Goomer) com créditos
- Som ambiente com licença livre, muted por padrão
- Entrega: deploy Vercel (link) + vídeo vertical 30s para WhatsApp

## Non-goals

- Cardápio de pedido online (Goomer/iFood seguem)
- E-commerce, blog, área administrativa
- Multi-página

## Anti-goals (o que faria isso falhar)

- Padrão estético genérico de IA (título→título→imagem, fonte padrão)
- Mais de um objeto 3D / efeitos empilhados sem hierarquia
- Página quebrada em mobile ou reduced-motion

## Constraints

- Next.js 16, React 19, R3F v9, GSAP + Lenis, Tailwind v4, TypeScript strict
- 1 canvas, dpr ≤ 1.75, LCP < 2.5s, 60fps desktop / ≥45 mobile
- `prefers-reduced-motion`: fallback estático completo
- Imagens: AVIF/WebP, prioridade à maior resolução disponível, créditos obrigatórios
- Dados fixos: R. Walter Marquardt 1400, Ter–Sáb 12h–20h, Dom 15h–19h, WhatsApp (47) 99955-2680

## Approaches considered

1. **R3F + shader de líquido no hero (escolhido)** — assinatura memorável, risco controlado com fallback. 
2. Frame sequence de vídeo de fondue real (tools/frames.mjs) — cinematográfico mas depende de material de vídeo que não temos; pesado no mobile.
3. Hero só com tipografia + fotos — mais seguro, zero assinatura; rejeitado.

## Decisions taken

- Projeto isolado `bari-caffe-conceito/` espelhando `conceito-skate-shop/`
- Paleta/tipo/narrativa/motion budget: ver ART-DIRECTION.md
- Fotos públicas agora, originais do cliente depois do fechamento
- Sem drei (R3F puro + three) para manter bundle enxuto

## Left to the builder

- Estrutura exata de componentes e shaders (plano em docs/superpowers/plans/)
- Curvas de animação finas, ajustes de copy dentro do tom da marca
