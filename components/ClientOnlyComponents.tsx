"use client";

import dynamic from "next/dynamic";

export const BrandCursor = dynamic(
  () => import("@/components/BrandCursor").then((mod) => mod.BrandCursor),
  { ssr: true },
);
export const SignatureMarquee = dynamic(
  () => import("@/components/SignatureMarquee").then((mod) => mod.SignatureMarquee),
  { ssr: true },
);
export const AmbientPetals = dynamic(
  () => import("@/components/AmbientPetals").then((mod) => mod.AmbientPetals),
  { ssr: true },
);
