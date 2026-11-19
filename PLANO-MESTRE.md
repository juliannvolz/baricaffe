# PLANO MESTRE — Bari Caffè Concept Site v2.0

> **Objetivo:** Transformar o site atual (bonito mas estático/minimalista) em uma experiência **viva, identitária, performática e premium** — com a xícara rosa 3D como assinatura, animações de entrada escalonadas, Close híbrido, e qualidade máxima em todos os assets.

---

## 📐 Princípios Norteadores (Non-Negotiables)

1. **Qualidade Máxima Sempre** — Assets na maior resolução possível → otimizados (AVIF/WebP) via pipeline. Nunca shipar compressão Facebook/IG direta.
2. **Performance First** — 60fps desktop, ≥45fps mobile médio (Snapdragon 778G), LCP < 2.5s, CLS 0.
3. **Motion Purposeful** — Cada animação tem papel claro; `prefers-reduced-motion` respeitado (fallback estático elegante).
4. **Identidade Visual** — Rosa + Dourado + Marfim + Chocolate; xícara rosa = hero product; pétalas = atmosfera.
5. **Acessibilidade Real** — Semantic HTML, focus-visible, contrastes, keyboard navigation, screen readers.
6. **CRO Embutido** — Um CTA principal por viewport, WhatsApp pré-preenchido por intenção, prova social honesta.

---

## 🗂️ Fases de Execução

| Fase | Foco | Entregáveis | Tempo Estimado |
|------|------|-------------|----------------|
| **0** | Preparação & Asset Pipeline | Upscale/otimização de todas as imagens, geração de variants, manifest | 1.5h |
| **1** | Fixes Críticos | WhatsApp mobile, Hero image quality, Close foto base | 45min |
| **2** | Reveal System Unificado | `lib/reveal.ts` + aplicação em 11 seções | 2h |
| **3** | Close Híbrido | Composição foto + pétalas SVG animadas + tipografia expandida | 1.5h |
| **4** | Identidade Extra | Grain global, gold borders, marquee assinatura, ícones SVGs, cursor evoluído | 2h |
| **5** | Xícara 3D (Blender → R3F) | Modelagem → GLB otimizado → `CupScene` + GSAP choreography | 6-8h |
| **6** | Polish & Deploy | Lint, typecheck, build, shot.mjs (390/768/1440), Vercel prod | 45min |

**Total estimado:** ~13-15h de trabalho focado.

---

## 🎯 FASE 0 — Asset Pipeline & Quality Upgrade

### 0.1 Auditoría de Qualidade Atual
| Imagem | Uso Atual | Tamanho | Qualidade | Ação |
|--------|-----------|---------|-----------|------|
| `area-externa4.jpg` | Hero bg (280vh) | 475KB | **Baixa** (FB comprimido) | **Upscale 2x via Pollinations + re-fotografar se possível** |
| `xicara-bari.jpg` | Signature + 3D ref | 756KB | Média | Upscale 1.5x + recorte preciso para textura |
| `area-externa2.jpg` | Close (novo) | 1.27MB | Boa | Otimizar AVIF/WebP multi-size |
| `taça-doce-bari.jpg` | Hero photo B | 941KB | Boa | Otimizar |
| `doce-bari.jpg` | Signature cena 2 | 898KB | Boa | Otimizar |
| `croissant-doce.jpg` | Menu item 8 | 832KB | Boa | Otimizar (mas tem árvore de natal - verificar) |
| `ig-daadcxx-1.jpg` | — | 3.6MB | **Excelente** | Candidata a hero alternativo |

### 0.2 Pipeline de Otimização (script reutilizável)
```bash
# tools/optimize-assets.mjs (novo)
# Para cada imagem fonte:
# 1. Upscale se < 1200px width (Pollinations --ref)
# 2. Gerar variants: 1920w, 1280w, 800w, 400w (AVIF + WebP)
# 3. Manifest JSON com srcset/sizes sugeridos
# 4. Blur placeholders (20px, base64)
```

**Imagens prioritárias para upscale:**
1. `area-externa4.jpg` → 2560px width (hero 280vh precisa de resolução)
2. `xicara-bari.jpg` → 1600px + alpha channel (recorte fundo para textura 3D)
3. `taça-doce-bari.jpg` → 1920px

### 0.3 Recorte da Xícara (para textura 3D)
- Usar `tools/img.mjs --prompt "recorte preciso da xícara rosa com logo, fundo transparente, manter borda de chocolate e creme" --ref public/demo/bari/raw/facebook/xicara-bari.jpg --provider gemini --aspect 1:1`
- Salvar como `public/assets/cup-texture.png` (RGBA, 1024x1024)
- Também gerar versão "clean" sem reflexos para material base

---

## 🔧 FASE 1 — Fixes Críticos (45min)

### 1.1 WhatsApp Mobile Cortado (`StickyCta.tsx`)
```tsx
// Problemas: px-4 + flex-1 + texto longo = overflow
// Fix:
<div className="fixed inset-x-0 bottom-0 z-40 ... px-3 sm:px-4 ...">
  <div className="flex items-center gap-1.5 sm:gap-2">
    <a className="shrink-0 min-h-11 px-3 sm:px-4 text-xs sm:text-sm ...">
    <a className="flex-1 min-h-11 min-w-[260px] max-w-full px-4 text-sm font-semibold text-wrap balance ...">
```

### 1.2 Hero Background Quality
- Substituir `gardenNight` import por versão upscaleada (`area-externa4-upscale.avif`)
- Ajustar `objectPosition: "50% 42%"` (foco no arco)
- Adicionar `sizes="100vw"` + `srcSet` multi-width via `next/image` config

### 1.3 Close Base Photo
- Trocar `area-externa.jpg` (2.1MB, compressão FB) por `area-externa2.jpg` (1.27MB, melhor luz noturna)
- Preparar para composição híbrida (Fase 3)

---

## ✨ FASE 2 — Reveal System Unificado (2h)

### 2.1 Novo `lib/reveal.ts`
```typescript
// lib/reveal.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface RevealConfig {
  trigger: HTMLElement | string;
  elements: string | Element[];          // selector ou array de elementos
  from?: gsap.TweenVars;                 // { y: 30, opacity: 0, ... }
  to?: gsap.TweenVars;                   // { y: 0, opacity: 1, ... }
  stagger?: number;                      // 0.06 default
  duration?: number;                     // 0.6 default
  ease?: string;                         // "power2.out" default
  start?: string;                        // "top 85%"
  once?: boolean;                        // true = clearProps no final
  delay?: number;                        // delay inicial
  onComplete?: () => void;
}

export function createReveal(config: RevealConfig): ScrollTrigger {
  const els = typeof config.elements === "string"
    ? gsap.utils.toArray(config.elements)
    : config.elements;

  return gsap.fromTo(
    els,
    { ...config.from, opacity: config.from?.opacity ?? 0 },
    {
      ...config.to,
      opacity: 1,
      stagger: config.stagger ?? 0.06,
      duration: config.duration ?? 0.6,
      ease: config.ease ?? "power2.out",
      clearProps: config.once ? "all" : undefined,
      scrollTrigger: {
        trigger: config.trigger,
        start: config.start ?? "top 85%",
        once: config.once ?? true,
        onEnter: () => ScrollTrigger.refresh(),
      },
    }
  );
}

// Helper para sequências complexas (timeline)
export function createRevealTimeline(
  trigger: HTMLElement | string,
  steps: Array<{ selector: string; config: Partial<RevealConfig> }>
) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start: "top 85%", once: true },
  });
  steps.forEach(({ selector, config }) => {
    tl.fromTo(
      selector,
      { ...config.from, opacity: config.from?.opacity ?? 0 },
      {
        ...config.to,
        opacity: 1,
        stagger: config.stagger ?? 0.06,
        duration: config.duration ?? 0.6,
        ease: config.ease ?? "power2.out",
        clearProps: config.once ? "all" : undefined,
      },
      config.delay ?? 0
    );
  });
  return tl;
}
```

### 2.2 Aplicação por Seção (configs)

| Seção | Trigger | Elements (ordem) | Stagger | Delay | Notas |
|-------|---------|------------------|---------|-------|-------|
| **Hero** | `#top` | `.hero-kicker` → `.hero-line` (words) → `.hero-sub` → `.hero-proof` → `.hero-cta` | 0.045 | 0, -0.55, -0.45, -0.4, -0.4 | Mantém SplitText atual |
| **Proof** | `#prova` | `.stat-item` (3) → `.quote-card` → `.controls` | 0.08 | 0, 0.2, 0.3 | Stats = grid 3 cols |
| **Menu** | `#cardapio` | `.menu-header` → `.menu-card` (horizontal) | 0.06 | 0, 0.15 | Cards usam `x: 40` |
| **Signature** | `#assinatura` | `.sig-scene-1 .sig-img` → `.sig-word` → `.sig-copy` → `.sig-scene-2 .sig-detail` (3) | 0.07 | 0, 0.1, 0.2, 0.4 | Cena 1 já tem GSAP scrub |
| **Place** | `#lugar` | `.place-img` → `.place-copy` → `.place-tags` | 0.06 | 0, 0.1, 0.2 | |
| **Detail** | `#detalhe` | `.detail-numbers` → `.detail-main-img` → `.detail-inset` → `.detail-copy` | 0.07 | 0, 0.1, 0.2, 0.3 | |
| **Season** | `#ritmo` | `.season-header` → `.fondue-img` → `.season-card` (3) | 0.08 | 0, 0.15, 0.25 | |
| **Offer** | `#presentes` | `.offer-img` → `.offer-headline` → `.offer-item` (3) → `.offer-cta` | 0.06 | 0, 0.1, 0.2, 0.35 | |
| **Faq** | `#duvidas` | `.faq-header` → `details` (accordion) | 0.05 | 0, 0.1 | `details` nativo |
| **Info** | `#visitar` | `.info-img` → `.info-copy` → `.info-cta` | 0.06 | 0, 0.1, 0.2 | |
| **Close** | `#fim` | `.close-top` → `.close-kicker` → `.close-title` → `.close-copy` → `.close-ctas` → `.close-hours` | 0.07 | 0, 0.1, 0.2, 0.3, 0.4, 0.5 | Expandido |

### 2.3 Reduced Motion
```css
/* globals.css - adicionar */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1 !important; transform: none !important; }
  .hero-word, .hero-line { opacity: 1 !important; transform: none !important; }
}
```
No `reveal.ts`: detectar `matchMedia('(prefers-reduced-motion: reduce)')` → `duration: 0.01, stagger: 0`.

---

## 🏁 FASE 3 — Close Híbrido (1.5h)

### 3.1 Conceito Visual
```
┌─────────────────────────────────────────────────────────────┐
│  Foto area-externa2.jpg (full bleed, opacity ~0.35)        │
│  ├── Gradiente escuro bottom→top (ink/95 → ink/10)         │
│  ├── Gradiente lateral right→left (ink/60 → transparent)   │
│  ├── Pétalas SVG caindo (CSS animation, 12-15 pétalas)     │
│  ├── Brilho sutil "xícara" no canto inf. dir. (CSS filter) │
│  └── Conteúdo tipográfico centralizado (max-w-5xl)         │
│       "Te esperamos" (kicker, gold)                        │
│       "O próximo capítulo é com você" (display, 7.5rem)    │
│       Copy expandida + CTAs duplos + Horários              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Pétalas SVG (CSS-only, performático)
```tsx
// components/AmbientPetals.tsx (novo, reutilizável)
const petalPaths = [
  "M10 0 C15 -5, 25 -5, 30 10 C35 25, 25 35, 10 30 C-5 25, -5 15, 0 10 Z", // pétala 1
  "M8 0 C12 -4, 20 -4, 24 8 C28 20, 20 28, 8 24 C4 20, 4 12, 0 8 Z",       // pétala 2 (menor)
  // ... 3 variações
];

// Cada pétala: position absolute, animation: fall 12-18s linear infinite
// Delays escalonados, sizes 12-28px, opacity 0.15-0.35
// prefers-reduced-motion: animation: none; opacity: 0;
```

### 3.3 Brilho "Xícara" (CSS)
```css
.cup-glint {
  position: absolute;
  bottom: 8%; right: 6%;
  width: 60px; height: 60px;
  background: radial-gradient(circle at 30% 30%, var(--color-gold)/0.4, transparent 70%);
  filter: blur(8px);
  animation: glint 4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes glint { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.15); } }
```

### 3.4 Tipografia Expandida
- `max-w-5xl` → `max-w-6xl`
- Título: `clamp(3rem, 9vw, 8.5rem)` (era 7.5rem)
- Copy: `max-w-2xl` → `max-w-3xl`, `text-base` → `text-lg md:text-xl`
- Espaçamento: `gap-4` → `gap-6` entre CTAs

---

## 🎨 FASE 4 — Identidade Extra (2h)

### 4.1 Grain Global Ajustado (`globals.css`)
```css
.grain::after {
  opacity: 0.05; /* era 0.035 */
  mix-blend-mode: multiply;
  background-size: 200px 200px; /* era 160px */
}
```
Aplicar no `<html>` ou `<body>` via `className="grain"`.

### 4.2 Gold Borders & Shadows (Utility Classes)
```css
/* globals.css - adicionar */
.gold-border { border: 1px solid var(--color-gold); }
.gold-border-hover:hover { border-color: var(--color-gold); box-shadow: 0 0 0 1px var(--color-gold), 0 8px 32px var(--color-gold)/0.15; }
.gold-focus:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 3px; }
```
Aplicar em: Proof quote card, Menu cards, Offer items, Close CTAs, Faq summary.

### 4.3 Marquee "Assinatura" (Onde Couber Melhor)
**Local escolhido:** Entre Hero e Proof — faixa full-width, sutil, `text-gold/20`, `font-display`, `tracking-[0.4em]`.
```tsx
// components/SignatureMarquee.tsx
<div className="overflow-hidden bg-ink/5 border-y border-ground/10 py-3" aria-hidden="true">
  <div className="marquee-track flex whitespace-nowrap text-[0.65rem] tracking-[0.4em] uppercase text-gold/20 font-display">
    {["chocolate belga · avelã tostada · trufa · chocolate quente rosa · fondue de inverno · croissant de chocolate · red velvet · brownie decorado · cesta de café da manhã · presente com flor e recado ·"].join("  •  ")}
  </div>
</div>
```
`marquee-track` já tem CSS em globals.css (32s linear infinite).

### 4.4 Ícones SVGs Customizados (Gemini)
Gerar via `tools/img.mjs` (provider gemini, aspect 1:1, prompt estilo "minimal line art icon, single weight stroke, rounded caps, Bari Caffè brand style, rosa/dourado"):

| Ícone | Prompt | Uso |
|-------|--------|-----|
| `cup-icon.svg` | "minimal line art ceramic cup with heart logo, single stroke weight, rounded caps" | Hero proof, Menu, Signature |
| `flower-icon.svg` | "minimal line art cherry blossom branch, single stroke" | Place tags, Close, Offer |
| `clock-icon.svg` | "minimal line art clock face, 3:15, single stroke" | Hero hours, Info, Close |
| `map-pin-icon.svg` | "minimal line art map pin with heart cutout, single stroke" | Info, Close |
| `whatsapp-icon.svg` | "minimal line art whatsapp logo, single stroke" | CTAs (substituir SVG atual) |
| `sparkle-icon.svg` | "minimal line art 3-point sparkle, single stroke" | Hover states, Detail, Signature |

Salvar em `public/icons/` + importar como React components.

### 4.5 Cursor Evoluído (`CursorPetal.tsx` → `BrandCursor.tsx`)
```tsx
// Estados: default | hover-link | hover-image | dragging | reduced-motion
// Visual: pétala única (default) → pétala + anel dourado (hover) → pétala expandida (drag)
// Reduced-motion: cursor nativo
// Implementação: div fixed, pointer-events-none, mix-blend-mode: difference (ou transform follow)
```

---

## 🍫 FASE 5 — Xícara 3D (6-8h) — *O Centro da Identidade*

### 5.1 Modelagem Blender (Passo a Passo)
```
1. Referências: xicara-bari.jpg (frente, topo, lado) + fotos complementares
2. Base: Cilindro → Boolean/LoopCut para forma cônica da xícara
3. Alça: Curva Bezier → Curve to Mesh → Boolean union
4. Logo: Texto "BARI" curvado na superfície → Shrinkwrap → Extrude sutil (0.3mm)
5. Borda chocolate: Edge loop no rim → Separate → Material "chocolate derretido"
6. Creme/Chantilly: Esfera achatada no topo + partículas (Geometry Nodes)
7. Morangos/Bombons: Instâncias simples sobre o creme
8. UV Unwrap: Smart UV Project + costura manual na logo
9. Bake: Normal, AO, Curvature, Roughness (4k → resize 2k)
10. Export: GLB (Draco compression) + texturas separadas (WebP)
```

**Especificações Técnicas:**
- Triângulos: < 15k (target 8-10k)
- Texturas: BaseColor (2k), Normal (1k), Roughness/Metalness (1k), AO (1k)
- Materials: 3 (cerâmica rosa, chocolate, creme)
- Centro de massa na base (para rotação natural)
- Pivot no centro geométrico

### 5.2 Otimização GLB
```bash
# gltf-transform (npm i -g @gltf-transform/cli)
gltf-transform draco cup.glb cup-draco.glb
gltf-transform resize cup-draco.glb cup-final.glb --width 1024
gltf-transform weld cup-final.glb cup-final.glb
gltf-transform prune cup-final.glb cup-final.glb
# Target: < 200KB gzipped
```

### 5.3 Integração R3F (`components/three/CupScene.tsx`)
```tsx
"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroProgress } from "@/lib/scroll-progress";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

export function CupScene() {
  const gltf = useLoader(GLTFLoader, "/models/cup-final.glb");
  const cupRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);

  // IntersectionObserver para frameloop demand
  useEffect(() => { /* ... */ }, []);

  // Animação de entrada (load)
  useGSAP(() => {
    if (!cupRef.current) return;
    gsap.fromTo(cupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8 },
      { x: 1, y: 1, z: 1, duration: 1.2, ease: "power3.out" });
    gsap.fromTo(cupRef.current.rotation, { y: 0.4 },
      { y: 0, duration: 1.4, ease: "power3.out" }, "-=0.8");
    gsap.fromTo(cupRef.current.position, { y: 0.3 },
      { y: 0, duration: 1, ease: "power2.out" }, "-=0.6");
  }, { scope: cupRef });

  // Scroll scrub: rotação Y suave + flutuação
  useGSAP(() => {
    if (!cupRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(cupRef.current.rotation, {
        y: "+=0.6", ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom bottom", scrub: 1 }
      });
      gsap.to(cupRef.current.position, {
        y: "+=0.08", yoyo: true, repeat: -1, ease: "sine.inOut", duration: 3,
      });
    }, cupRef);
    return () => ctx.revert();
  }, { scope: cupRef });

  // Mouse follow (desktop only)
  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      Observer.create({
        target: window, type: "pointer", onMove: (self) => {
          if (!cupRef.current) return;
          gsap.to(cupRef.current.rotation, {
            x: self.y * 0.15, y: self.x * 0.15 + cupRef.current.rotation.y,
            duration: 0.6, ease: "power2.out", overwrite: "auto"
          });
        }
      });
    }
  }, { scope: cupRef });

  // Hover/tap sparkle (partículas)
  // ... usar Canvas 2D overlay ou Three.js Points

  return (
    <group ref={cupRef} position={[0.8, -0.4, -1.2]} scale={1.3}>
      <primitive object={gltf.scene} />
      <spotLight position={[2, 4, 3]} intensity={1.5} angle={0.4} penumbra={0.5} />
      <directionalLight position={[-3, 5, -2]} intensity={0.8} color="#efb9c4" />
    </group>
  );
}

export default function CupWrapper() {
  const dpr = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? [1, 1.25] : [1, 1.5];
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      <Canvas dpr={dpr} camera={{ position: [0, 0, 3.5], fov: 35 }} frameloop="demand" gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <CupScene />
      </Canvas>
    </div>
  );
}
```

### 5.4 Posicionamento no Hero
```tsx
// Hero.tsx - adicionar após HeroScene
<div className="absolute inset-0 z-5 pointer-events-none hidden md:block">
  <CupWrapper />
</div>
```
Posição: `right-1/4 top-1/2` (lado direito, centro vertical) — ocupa o "espaço vazio" mencionado.

### 5.5 Reduced Motion
- `prefers-reduced-motion`: CupWrapper renderiza `<img src="/images/cup-static.webp" alt="" className="absolute right-1/4 top-1/2 w-[35vw] max-w-[400px] opacity-80" />` (versão estática da xícara renderizada)

---

## 🧪 FASE 6 — Polish, QA & Deploy (45min)

### 6.1 Checklist Pré-Deploy
```bash
# 1. Lint & Format
npm run lint          # biome + oxlint
npm run format        # biome format --write

# 2. TypeCheck
npm run typecheck     # tsc --noEmit

# 3. Build
npm run build         # next build (Turbopack)

# 4. Visual QA (shot.mjs)
npm run dev &         # background
sleep 10
node tools/shot.mjs http://localhost:3000 --out tools/out/bari-v2-final
# Verificar: desktop.png, mobile.png, desktop-full.png, report.json
# Métricas alvo: FPS 60/45, LCP < 2.5s, CLS 0, 0 overflow, 0 missing alt

# 5. Reduced Motion QA
node tools/shot.mjs http://localhost:3000 --out tools/out/bari-v2-reduced --reduced

# 6. Deploy
vercel --prod
```

### 6.2 Métricas de Sucesso
| Métrica | Target | Ferramenta |
|---------|--------|------------|
| Desktop FPS | 60 | shot.mjs |
| Mobile FPS (mid) | ≥45 | shot.mjs (emulado) |
| LCP | < 2.5s | shot.mjs / Lighthouse |
| CLS | 0 | shot.mjs |
| Transfer Size | < 2.5MB | shot.mjs / Network tab |
| Console Errors | 0 | shot.mjs |
| Keyboard Navigation | 100% | Manual |
| Screen Reader | Semântico | NVDA/VoiceOver |
| WhatsApp Links | Pré-preenchidos | Manual click |

---

## 📁 Estrutura de Arquivos Novos/Modificados

```
bari-caffe-conceito/
├── components/
│   ├── three/
│   │   ├── CupScene.tsx          # NOVO - R3F xícara
│   │   ├── CupWrapper.tsx        # NOVO - wrapper com Canvas
│   │   └── index.ts              # exports
│   ├── AmbientPetals.tsx         # NOVO - pétalas CSS global
│   ├── BrandCursor.tsx           # NOVO - evolução CursorPetal
│   ├── SignatureMarquee.tsx      # NOVO - faixa assinatura
│   ├── StickyCta.tsx             # MODIFICADO - fix mobile
│   └── sections/
│       ├── Hero.tsx              # MODIFICADO - CupWrapper + image quality
│       ├── Close.tsx             # MODIFICADO - híbrido
│       ├── Proof.tsx             # MODIFICADO - reveal + gold borders
│       ├── Menu.tsx              # MODIFICADO - reveal
│       ├── Signature.tsx         # MODIFICADO - reveal
│       ├── Place.tsx             # MODIFICADO - reveal
│       ├── Detail.tsx            # MODIFICADO - reveal
│       ├── Season.tsx            # MODIFICADO - reveal
│       ├── Offer.tsx             # MODIFICADO - reveal
│       ├── Faq.tsx               # MODIFICADO - reveal
│       └── Info.tsx              # MODIFICADO - reveal
├── lib/
│   ├── reveal.ts                 # NOVO - sistema unificado
│   ├── tokens.ts                 # MODIFICADO - gold borders util
│   └── scroll-progress.ts        # EXISTENTE
├── public/
│   ├── assets/
│   │   ├── cup-texture.png       # NOVO - recorte xícara
│   │   ├── area-externa4-upscale.avif/webp  # NOVO
│   │   ├── area-externa2.avif/webp          # NOVO
│   │   └── ...
│   ├── models/
│   │   └── cup-final.glb         # NOVO - modelo 3D otimizado
│   └── icons/                    # NOVO - SVGs customizados
│       ├── cup-icon.svg
│       ├── flower-icon.svg
│       ├── clock-icon.svg
│       ├── map-pin-icon.svg
│       ├── whatsapp-icon.svg
│       └── sparkle-icon.svg
├── tools/
│   ├── optimize-assets.mjs       # NOVO - pipeline otimização
│   └── ... (existentes)
├── app/
│   ├── globals.css               # MODIFICADO - grain, gold utilities, reduced-motion
│   ├── page.tsx                  # MODIFICADO - SignatureMarquee, AmbientPetals, BrandCursor
│   └── layout.tsx                # VERIFICAR - OG image atualizada
└── PLANO-MESTRE.md               # ESTE ARQUIVO
```

---

## ⚠️ Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Modelagem 3D > 8h | Média | Alto | Timebox 6h; se estourar, usar sprite 3D (plano recortado + parallax) como fallback v1 |
| GLB > 300KB | Baixa | Médio | `gltf-transform draco + resize + weld`; target 200KB gz |
| Mobile FPS < 45 com 3D | Média | Alto | `frameloop="demand"`, `dpr clamp`, reduzir `petalCount` 56→32, CupWrapper só `md:block` |
| Pollinations rate limit | Alta | Baixo | Batch upscale com delays; Gemini como fallback (precisa API key) |
| Fontes (Fraunces/Manrope) FOUC | Baixa | Médio | `next/font` com `display: swap` + `preload` no layout |
| Close híbrido pesado | Baixa | Baixo | Pétalas CSS-only (sem JS), brilho CSS-only |

---

## 🚀 Ordem de Execução Recomendada

```
1. tools/optimize-assets.mjs → rodar → commit assets otimizados
2. StickyCta.tsx (fix mobile) + Hero.tsx (image import update)
3. lib/reveal.ts → aplicar em Hero, Proof, Menu (teste rápido)
4. Close.tsx (híbrido) + AmbientPetals.tsx
5. Aplicar reveal nas 8 seções restantes
6. globals.css (grain, gold utils, reduced-motion)
7. SignatureMarquee.tsx + BrandCursor.tsx + ícones SVGs
8. Blender → CupScene.tsx → CupWrapper.tsx → Hero.tsx integração
9. QA completo (shot.mjs 390/768/1440 + reduced)
10. Deploy prod
```

---

## 📝 Notas para Execução

- **Commits atômicos** por fase (facilita rollback)
- **Branches:** `feat/asset-pipeline`, `feat/reveal-system`, `feat/close-hybrid`, `feat/identity-extras`, `feat/cup-3d`, `feat/polish-deploy`
- **Teste mobile real** (não só emulado) após Fase 1 e Fase 5
- **Documentar decisões** em `ART-DIRECTION.md` conforme forem tomadas
- **Screenshot comparativo** antes/depois de cada fase visual

---

**Próximo passo:** Aprovação deste plano → Início da Fase 0 (Asset Pipeline).