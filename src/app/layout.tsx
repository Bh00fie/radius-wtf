import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only used for the end-of-game countdown — not worth a preload.
  preload: false,
});

// Shippori Mincho, subset to just the glyphs the game shows (Latin plus
// 円 連 一 二 三 四 五 六 and a few symbols) — ~25 KB per weight, versus
// ~120 unicode-range slices from Google Fonts. If new kanji/symbols are added
// to the UI, regenerate these with fontTools' pyftsubset. License: OFL
// (see ./fonts/ShipporiMincho-OFL.txt).
const mincho = localFont({
  variable: "--font-mincho",
  src: [
    { path: "./fonts/ShipporiMincho-Medium.subset.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ShipporiMincho-Bold.subset.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const TITLE = "radiusgame — guess the radius";
const DESCRIPTION =
  "A daily browser puzzle: guess a circle's radius in up to 4 tries, build a streak, and come back tomorrow for a new one.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "radius guessing game",
    "daily puzzle game",
    "geometry game",
    "size estimation game",
    "angle.wtf",
    "wordle for shapes",
  ],
  applicationName: "radiusgame",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "radiusgame",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee4" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "radiusgame",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "Game",
  genre: "Puzzle",
  operatingSystem: "Any",
  isAccessibleForFree: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${mincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
      </body>
    </html>
  );
}
