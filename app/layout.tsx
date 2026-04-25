import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Falah.dev | Backend Architect & API Specialist",
    template: "%s | Falah.dev",
  },
  description: "Senior Backend Developer specializing in Laravel, MySQL, and High-Performance API Architectures. Explore the portfolio of Ahmad Mathlaul Falah.",
  authors: [{ name: "Ahmad Mathlaul Falah" }],
  creator: "Ahmad Mathlaul Falah",
  metadataBase: new URL("https://falah.dev"),
  keywords: [
    "Ahmad Mathlaul Falah", "Backend Developer", "Laravel Expert", 
    "API Architect", "Surabaya Developer", "Clean Architecture",
    "MySQL Optimization", "Fullstack Portfolio", "Software Engineer"
  ],
  openGraph: {
    title: "Falah.dev | Backend Architect",
    description: "Crafting robust APIs and scalable server-side architectures.",
    url: "https://falah.dev",
    siteName: "Falah.dev Portfolio",
    images: [
      {
        url: "/og-image.png", // Kita asumsikan ini ada atau akan dibuat
        width: 1200,
        height: 630,
        alt: "Falah.dev Backend Architect",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Falah.dev | Backend Architect",
    description: "Senior Backend Developer specializing in Laravel and API Architectures.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <head />
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased min-h-screen relative flex flex-col`}
      >
        <Script
          id="anti-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
