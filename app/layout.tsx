import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sc-bagration.ru";
const title = "Багратион — клуб карате киокушин";
const description = "Карате киокушин для детей и взрослых в Москве и Московской области.";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Спортивный клуб «Багратион»",
  url: siteUrl,
  logo: new URL("/images/logo.png", siteUrl).toString(),
  image: new URL("/images/hero-team.png", siteUrl).toString(),
  telephone: "+7-915-059-00-50",
  sport: "Киокушин",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Тимирязевская, д. 16",
    addressLocality: "Москва",
    addressCountry: "RU",
  },
  areaServed: ["Москва", "Московская область"],
  sameAs: ["https://t.me/s/kyokushin_bagration"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Спортивный клуб «Багратион»",
    title,
    description,
    images: [
      {
        url: "/images/hero-team.png",
        width: 722,
        height: 670,
        alt: "Тренеры и спортсмены клуба Багратион",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-team.png"],
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className={`${oswald.className} min-h-full flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
