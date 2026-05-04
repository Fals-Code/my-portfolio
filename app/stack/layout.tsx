import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tech Stack & Skills",
  description: "Daftar teknologi, framework, dan tools yang digunakan Ahmad Mathlaul Falah untuk membangun sistem backend yang robust, termasuk Laravel, MySQL, dan Docker.",
};

export default function StackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
