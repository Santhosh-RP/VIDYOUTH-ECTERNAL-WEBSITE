import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { SITE_URL } from "./lib/site";

// Display / heading face — Sora: a modern, geometric-humanist face that reads
// as premium and technical without the cyberpunk-terminal feel.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Body / UI face — Inter: highly readable at length across nav, forms, and
// long-form copy.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const TITLE = "Vidyouth — Empowering Talent. Advancing Semiconductors. Building India.";
const DESCRIPTION =
  "A semiconductor workforce development platform aligned with India's Semiconductor Mission (ISM) — lighting the path to electrical intelligence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  // Link previews (WhatsApp, LinkedIn, X, Slack…)
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vidyouth Intelligence",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vidyouth Intelligence Institute Pvt. Ltd." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VidyouthEdu",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

// Organisation details for search engines (schema.org).
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Vidyouth Intelligence Institute Pvt. Ltd.",
  alternateName: "Vidyouth Intelligence",
  url: SITE_URL,
  logo: `${SITE_URL}/vidyouth-logo.png`,
  email: "info@vidyouthintelligence.com",
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  sameAs: [
    "https://www.linkedin.com/company/vidyouth-intelligence-institute-pvt-ltd/",
    "https://www.instagram.com/vidyouthintelligence",
    "https://www.youtube.com/@vidyouthintelligence",
    "https://x.com/VidyouthEdu",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Google tag (gtag.js) — Google Analytics 4 (G-Y7GLQ299GH) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y7GLQ299GH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Y7GLQ299GH');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
      </head>
      <body className="min-h-full bg-[#08111F] text-[#FFFFFF]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
