"use client";

import dynamic from "next/dynamic";

export const BrandCursor = dynamic(() => import("@/components/BrandCursor").then((mod) => mod.BrandCursor), { ssr: false });
export const SignatureMarquee = dynamic(() => import("@/components/SignatureMarquee").then((mod) => mod.SignatureMarquee), { ssr: false });
export const AmbientPetals = dynamic(() => import("@/components/AmbientPetals").then((mod) => mod.AmbientPetals), { ssr: false });