"use client";

import dynamic from "next/dynamic";

export const BrandCursor = dynamic(
  () => import("@/components/BrandCursor").then((mod) => mod.BrandCursor),
  { ssr: false },
);
export const SignatureMarquee = dynamic(
  () => import("@/components/SignatureMarquee").then((mod) => mod.SignatureMarquee),
  { ssr: false },
);
export const AmbientPetals = dynamic(
  () => import("@/components/AmbientPetals").then((mod) => mod.AmbientPetals),
  { ssr: false },
);
export const HeroScene = dynamic(
  () => import("@/components/HeroScene").then((mod) => mod.default),
  { ssr: false },
);
export const CupWrapper = dynamic(
  () => import("@/components/three/CupScene").then((mod) => mod.default),
  { ssr: false },
);
