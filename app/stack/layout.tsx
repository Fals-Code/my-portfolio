import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Tools, software, and hardware Ahmad Mathlaul Falah uses daily for development.",
};

export default function StackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
