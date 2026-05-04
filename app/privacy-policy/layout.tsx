import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kebijakan Privasi Ahmad Mathlaul Falah (falah.dev). Informasi tentang bagaimana data Anda dikelola dan dilindungi.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
