import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = "https://bari-caffe-conceito.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bari Caffè — Cafeteria e doceria em Jaraguá do Sul",
    template: "%s · Bari Caffè",
  },
  description:
    "Croissant de chocolate belga, red velvet, chocolate quente rosa e fondue de inverno. Cafeteria e doceria em Jaraguá do Sul. Ter–Sáb 12h–20h, Dom 15h–19h.",
  keywords: [
    "cafeteria Jaraguá do Sul",
    "Bari Caffè",
    "croissant chocolate Jaraguá",
    "fondue Jaraguá do Sul",
    "brunch Jaraguá do Sul",
    "doceria Jaraguá do Sul",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Bari Caffè",
    title: "Bari Caffè — Clássico & contemporâneo",
    description:
      "Croissant de chocolate belga, red velvet e fondue de inverno. Um café que parece um jardim, em Jaraguá do Sul.",
    images: [
      {
        url: "/brand/og-bari.jpg",
        width: 1200,
        height: 630,
        alt: "Croissant coberto com chocolate belga e avelãs da Bari Caffè",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bari Caffè — Clássico & contemporâneo",
    description: "Croissant de chocolate belga, red velvet e fondue de inverno em Jaraguá do Sul.",
    images: ["/brand/og-bari.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7eef0",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Bari Caffè",
  image: `${siteUrl}/brand/og-bari.jpg`,
  url: siteUrl,
  telephone: "+5547999552680",
  priceRange: "$$",
  servesCuisine: ["Café", "Doces", "Brunch", "Fondue"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Walter Marquardt, 1400",
    addressLocality: "Jaraguá do Sul",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "15:00",
      closes: "19:00",
    },
  ],
  sameAs: ["https://www.instagram.com/baricaffe"],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "796",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
      </head>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
