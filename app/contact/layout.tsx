import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact",
  description: "Hubungi Ahmad Mathlaul Falah untuk kolaborasi proyek, peluang kerja, atau sekadar berdiskusi tentang backend architecture.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
