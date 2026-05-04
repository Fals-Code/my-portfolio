import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import GoogleAnalytics from "@/components/global/GoogleAnalytics";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://falah.dev"),
  title: {
    default: "Ahmad Mathlaul Falah | Backend Architect & API Specialist",
    template: "%s | Falah.dev",
  },
  description: "Portofolio Ahmad Mathlaul Falah - Lead Backend Developer yang ahli dalam Laravel, MySQL, dan Arsitektur API performa tinggi. Membangun sistem yang scalable dan maintainable.",
  authors: [{ name: "Ahmad Mathlaul Falah", url: "https://falah.dev" }],
  creator: "Ahmad Mathlaul Falah",
  publisher: "Ahmad Mathlaul Falah",
  keywords: [
    "Ahmad Mathlaul Falah", "Falah Bot", "Backend Developer Indonesia", 
    "Laravel Expert", "API Architect", "Surabaya Backend Developer", 
    "Teknik Informatika UNAIR", "Software Engineer Portfolio", "Web Developer Gresik"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ahmad Mathlaul Falah | Backend Architect",
    description: "Crafting robust APIs and scalable server-side architectures. Explore the technical portfolio of Falah.",
    url: "https://falah.dev",
    siteName: "Falah.dev Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmad Mathlaul Falah - Backend Architect Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Mathlaul Falah | Backend Architect",
    description: "Specializing in Laravel, PHP, and high-performance backend systems.",
    creator: "@mathlaulfalah", // Ganti jika punya handle twitter lain
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0F",
  width: "device-width",
  initialScale: 1,
};

const ANTI_FLASH_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('falah-theme-v2');
    var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    var html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    html.setAttribute('data-theme', theme);
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <head>
        {/* Anti-flash: must run before paint, inline in <head> */}
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body
        className={`${syne.variable} ${inter.variable} ${spaceMono.variable} antialiased min-h-screen relative flex flex-col`}
      >
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `
          }}
        />
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
