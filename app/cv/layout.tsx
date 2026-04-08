import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: "Curriculum Vitae of Ahmad Mathlaul Falah. View professional summary, mastery, and academic projects.",
  openGraph: {
    title: "CV | Falah.",
    description: "Curriculum Vitae of Ahmad Mathlaul Falah. View professional summary, mastery, and academic projects.",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV | Falah.",
    description: "Curriculum Vitae of Ahmad Mathlaul Falah. View professional summary, mastery, and academic projects.",
    images: ["/icon.png"],
  }
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
