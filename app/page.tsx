import Script from "next/script";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ahmad Mathlaul Falah",
    "jobTitle": "Backend Developer",
    "url": "https://falah.dev",
    "sameAs": [
      "https://github.com/Fals-code",
      "https://linkedin.com/in/falah-dev" // Asumsi link LinkedIn
    ],
    "description": "Backend Architect specializing in Laravel and API architectures.",
    "knowsAbout": ["Laravel", "MySQL", "PHP", "Clean Architecture", "API Design"]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HeroSection />
      <ProjectsSection />
    </>
  );
}
