import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono } from "next/font/google";
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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          id="anti-flash"
          dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased min-h-screen relative flex flex-col`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
