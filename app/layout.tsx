import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import PageTransition from "@/components/global/PageTransition";

const outfit = Outfit({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      <body className={`${outfit.variable} ${dmSans.variable} font-dm-sans antialiased mesh-bg min-h-screen relative overflow-x-hidden`}>
        <ClientLayout>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientLayout>
      </body>
    </html>
  );
}
