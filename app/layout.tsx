import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import PageTransition from "@/components/global/PageTransition";

const outfit = Outfit({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Falah. | Backend Developer",
    template: "%s | Falah.",
  },
  description: "Crafting Digital Experiences with Backend Precision. Portfolio of Ahmad Mathlaul Falah.",
  authors: [{ name: "Ahmad Mathlaul Falah" }],
  creator: "Ahmad Mathlaul Falah",
  metadataBase: new URL("https://falah.com"),
  keywords: ["Next.js", "Backend Developer", "Laravel", "Portofolio", "Ahmad Falah"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e8533a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://skillicons.dev" />
        <style dangerouslySetInnerHTML={{ __html: `
          #instant-boot-loader {
            position: fixed;
            inset: 0;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
          }
          #instant-boot-loader.hidden { opacity: 0; pointer-events: none; }
          .boot-logo { 
            font-family: sans-serif; 
            font-weight: 900; 
            font-size: 2rem; 
            color: #e8533a; 
            letter-spacing: -2px;
            animation: boot-pulse 1s ease-in-out infinite alternate;
          }
          @keyframes boot-pulse { 
            from { opacity: 0.5; transform: scale(0.95); } 
            to { opacity: 1; transform: scale(1); } 
          }
        `}} />
      </head>
      <body className={`${outfit.variable} ${dmSans.variable} font-dm-sans antialiased mesh-bg min-h-screen relative overflow-x-hidden`}>
        <div id="instant-boot-loader" suppressHydrationWarning>
          <div className="boot-logo">FALAH.DEV</div>
          <script dangerouslySetInnerHTML={{ __html: `
            window.addEventListener('load', function() {
              var loader = document.getElementById('instant-boot-loader');
              if (loader) {
                loader.classList.add('hidden');
                setTimeout(function() { loader.remove(); }, 500);
              }
            });
          `}} />
        </div>
        <ClientLayout>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientLayout>
      </body>
    </html>
  );
}
