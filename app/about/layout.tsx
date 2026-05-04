import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Ahmad Mathlaul Falah",
  description: "Pelajari lebih lanjut tentang Ahmad Mathlaul Falah, seorang Backend Developer yang berfokus pada ekosistem Laravel, Clean Architecture, dan ACID compliance di Surabaya/Gresik.",
  openGraph: {
    title: "About | Falah.dev",
    description: "Backend Developer specializing in Laravel and scalable architectures. Student at UNAIR.",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Falah.dev",
    description: "Backend Developer specializing in Laravel and scalable architectures.",
    images: ["/icon.png"],
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
