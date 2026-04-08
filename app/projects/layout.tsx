import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore the academic and professional projects by Ahmad Mathlaul Falah. Specialized in Laravel, React, and real-time architectures.",
  openGraph: {
    title: "Projects | Falah.",
    description: "Explore the academic and professional projects by Ahmad Mathlaul Falah. Specialized in Laravel, React, and real-time architectures.",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Falah.",
    description: "Explore the academic and professional projects by Ahmad Mathlaul Falah. Specialized in Laravel, React, and real-time architectures.",
    images: ["/icon.png"],
  }
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
