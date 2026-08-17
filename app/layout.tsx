import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

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

export const metadata: Metadata = {
  title: "Vidyouth — Empowering Talent. Advancing Semiconductors. Building India.",
  description:
    "A semiconductor workforce development platform aligned with India's Semiconductor Mission (ISM) — lighting the path to electrical intelligence.",
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
      </head>
      <body className="min-h-full bg-[#08111F] text-[#FFFFFF]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
