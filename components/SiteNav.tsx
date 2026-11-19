"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/content";
import { primaryMessage, whatsappLink } from "@/lib/tokens";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-ink/85 via-ink/35 to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-ink/10 bg-ground/90 text-ink backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-ground"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 md:h-20 md:px-10">
          <Logo variant={scrolled ? "bronze" : "ivory"} />

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.68rem] tracking-[0.22em] uppercase opacity-90 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden text-[0.6rem] tracking-[0.2em] uppercase opacity-75 lg:inline">
              Ter–Sáb 12h–20h
            </span>
            <a
              href={whatsappLink(primaryMessage)}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[0.7rem] font-semibold tracking-wide transition-colors ${
                scrolled
                  ? "bg-ink text-ground hover:bg-material"
                  : "bg-accent text-ink hover:bg-ground"
              }`}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
