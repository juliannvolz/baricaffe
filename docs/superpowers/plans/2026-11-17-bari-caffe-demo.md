# Bari Caffè Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Demo cinematográfico one-page (`/`) com hero 3D (pour de chocolate scroll-driven), narrativa de 12 frames, fotos reais do cliente, deploy Vercel + vídeo vertical.

**Architecture:** Next.js 16 + R3F (1 canvas no hero) + GSAP ScrollTrigger sincronizado com Lenis. Seções DOM com reveals via clip-path; 3D isolado no hero com fallback estático.

**Tech Stack:** Next 16, React 19, R3F v9 + three, GSAP + @gsap/react, Lenis, Tailwind v4, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-11-17-bari-caffe-design.md` + `ART-DIRECTION.md`

## Global Constraints

- 1 canvas WebGL; dpr clampado `[1, 1.75]`
- `prefers-reduced-motion`: hero vira foto estática, reveals viram fades
- Mobile: partículas reduzidas (40) ou fallback de imagem
- Motion budget: 1 pin/scrub · 2 reveals · 1 interativo · 1 transição · 1 som muted
- Tipografia: Fraunces (display) + sans quieto; tokens OKLCH
- LCP < 2.5s · 60fps desktop · ≥45 mobile · zero console errors
- Dados fixos: R. Walter Marquardt 1400 · Ter–Sáb 12h–20h · Dom 15h–19h · wa.me/5547999552680

## Review Focus

1. Imagens < 800px — rejeitar na coleta (Task 1 checklist).
2. Console errors no canvas (dispose no unmount) — `tools/shot.mjs` na Task 6.
3. Reduced-motion — teste manual na Task 6.
4. Áudio tocando sem clique — verificações da Task 5.
5. Créditos de imagem/áudio ausentes — arquivo de créditos na Task 1/5.

## Tasks

### Task 0: Docs e contrato
- [x] ART-DIRECTION.md, design doc, referências, este plano

### Task 1: Coleta de imagens
- [x] Playwright → TripAdvisor (fotos de viajantes), Google Maps, Goomer (TripAdvisor 403 — usado Goomer + Maps + IG embeds)
- [x] Selecionar 10–14 imagens ≥800px cobrindo os 12 frames (12 imagens: 6 Goomer produtos, 1 fachada Maps, 5 nativas @baricaffe via embeds)
- [x] AVIF/WebP + créditos em `docs/demo/image-credits.md` (otimização delegada ao next/image com imports estáticos; masters ficam em raw/)
- [ ] Texturas veludo rosa/mármore via tools/img.mjs (opcional — dispensado: fotos reais + paleta já sustentam a direção)

### Task 2: Fundação
- [x] `lib/tokens.ts` (cores OKLCH, durações 180/420/900, eases), `lib/useLenis.ts`
- [x] `app/layout.tsx` (Fraunces via next/font), `app/page.tsx`, `app/globals.css` (+ `components/SmoothScroll.tsx`)
- [x] Verificação: dev server renderiza sem erros (HTTP 200, typecheck ✓, biome ✓)

### Task 3: Hero 3D
- [x] `components/HeroScene.tsx` (Canvas, dpr, dispose), `ChocolateCup.tsx` (LatheGeometry), `ChocolatePour.tsx` (shader UV scroll + noise), `Petals.tsx` (InstancedMesh 120/40)
- [x] Scrub do hero via ScrollTrigger + progress compartilhado (`lib/scroll-progress.ts`, sticky via CSS — sem pin nativo)
- [x] Fallback reduced-motion/mobile fraco (foto nativa + overlay de tinta)
- [x] Verificação: shot.mjs 60fps desktop e mobile, LCP 436ms, CLS 0, console limpo, sem overflow 390/1440

### Task 4: Seções (frames 04–12)
- [x] `components/sections/{Menu,Detail,Season,Proof,Offer,Info,Close}.tsx` (Promise foi fundido no Hero)
- [x] CTA magnético WhatsApp + dados fixos
- [x] Verificação: lint, typecheck, scroll completo (revisão visual sec-0..sec-6)

### Task 5: Som + cursor
- [x] `AmbientSound.tsx` (pad generativo Web Audio, muted por padrão, fade 900ms — sem arquivo/licença), `CursorPetal.tsx` (desktop only, pointer fino)
- [x] Créditos: áudio gerado proceduralmente — sem atribuição externa necessária (`docs/demo/image-credits.md` cobre as fotos)

### Task 6: QA
- [x] lint, typecheck, build, shot.mjs desktop+mobile (60fps/60fps, LCP 536ms, CLS 0, 0 overflow, 0 reveals presos)
- [ ] Rubrica signature-motion-system (nota ≥4 em conceito/objeto/narrativa/assinatura)
- [x] reduced-motion e sem-JS legível (canvas 0, foto estática, texto claro, hero 100dvh)

### Task 7: Entrega
- [x] Deploy Vercel preview → https://bari-caffe-conceito.vercel.app (produção, QA público verde: 60fps/60fps, LCP 1352ms, CLS 0, 505KB)
- [x] Vídeo vertical 1080×1920 + corte 30s → `tools/out/bari-demo-30s.mp4`
- [x] Mensagem de prospecção para WhatsApp → `docs/demo/mensagem-prospectacao.txt`
