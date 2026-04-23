import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";
import CustomCursor from "@/components/global/CustomCursor";
import StatusBar from "@/components/global/StatusBar";

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
    default: "Falah. | Backend Architect",
    template: "%s | Falah.",
  },
  description: "API Explorer Portfolio. Crafting Digital Experiences with Backend Precision.",
  authors: [{ name: "Ahmad Mathlaul Falah" }],
  creator: "Ahmad Mathlaul Falah",
  metadataBase: new URL("https://falah.dev"),
  keywords: ["Next.js", "Backend Developer", "Laravel", "Portofolio", "Ahmad Falah", "API"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0F",
  width: "device-width",
  initialScale: 1,
};

/**
 * Anti-flash script — dijalankan SEBELUM React hydration.
 * Membaca localStorage dan langsung menerapkan class ke <html>,
 * mencegah "flash of wrong theme" (FOWT).
 */
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
    // Fallback jika localStorage tidak tersedia
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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/*
          Anti-flash script: harus blocking (tanpa async/defer)
          agar theme diterapkan sebelum browser render konten pertama.
        */}
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased min-h-screen relative flex flex-col`}
      >
        <CustomCursor />
        <ClientLayout>
          <Toaster position="top-center" richColors theme="dark" />
          <main className="flex-grow">
            {children}
          </main>
          <StatusBar />
        </ClientLayout>
      </body>
    </html>
  );
}
