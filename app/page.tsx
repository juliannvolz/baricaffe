import { AmbientSound } from "@/components/AmbientSound";
import { AmbientPetals, BrandCursor, SignatureMarquee } from "@/components/ClientOnlyComponents";
import { ScrollRefresh } from "@/components/ScrollRefresh";
import { SiteNav } from "@/components/SiteNav";
import { StickyCta } from "@/components/StickyCta";
import { Close } from "@/components/sections/Close";
import { Detail } from "@/components/sections/Detail";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Info } from "@/components/sections/Info";
import { Menu } from "@/components/sections/Menu";
import { Offer } from "@/components/sections/Offer";
import { Place } from "@/components/sections/Place";
import { Proof } from "@/components/sections/Proof";
import { Season } from "@/components/sections/Season";
import { Signature } from "@/components/sections/Signature";
import { faqs } from "@/lib/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[70] rounded-full bg-ink px-5 py-3 text-ground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Ir para o conteúdo
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SiteNav />

      <main id="conteudo">
        <Hero />
        <Proof />
        <SignatureMarquee />
        <Menu />
        <Signature />
        <Place />
        <Detail />
        <Season />
        <Offer />
        <Faq />
        <Info />
        <Close />
      </main>

      <StickyCta />
      <AmbientSound />
      <AmbientPetals />
      <BrandCursor />
      <ScrollRefresh />
    </>
  );
}
