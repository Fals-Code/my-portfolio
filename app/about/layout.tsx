import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Ahmad Mathlaul Falah, a Backend Developer focusing on Laravel ecosystem, Clean Architecture, and ACID compliance.",
  openGraph: {
    title: "About | Falah.",
    description: "Learn more about Ahmad Mathlaul Falah, a Backend Developer focusing on Laravel ecosystem, Clean Architecture, and ACID compliance.",
    images: ["/assets/imgs/falah.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Falah.",
    description: "Learn more about Ahmad Mathlaul Falah, a Backend Developer focusing on Laravel ecosystem, Clean Architecture, and ACID compliance.",
    images: ["/assets/imgs/falah.jpeg"],
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
