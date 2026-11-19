"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

/**
 * Recalcula as posições dos ScrollTrigger quando o layout assenta
 * (fontes, imagens lazy, canvas 3D do hero). Sem isso, seções montadas
 * cedo podem ficar com start/end desatualizados e nunca disparar.
 */
export function ScrollRefresh() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const refresh = () => ScrollTrigger.refresh();

    const onLoad = () => {
      refresh();
      // segunda passada: o hero 3D pode dimensionar o canvas depois do load
      window.setTimeout(refresh, 600);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    if (document.fonts?.ready) {
      void document.fonts.ready.then(refresh);
    }

    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
