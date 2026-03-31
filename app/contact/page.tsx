import React from "react";
import { Metadata } from "next";
import ContactHeroSection from "@/components/sections/ContactHeroSection";
import ContactLayout from "@/components/sections/ContactLayout";

export const metadata: Metadata = {
  title: "Contact | Falah.",
  description: "Get in touch with Ahmad Mathlaul Falah for collaborations, freelance work, or just to say hello.",
};

/**
 * Contact Page
 * Networking hub and headless contact form.
 */
export default function ContactPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero: Greeting & Invitation */}
      <ContactHeroSection />

      {/* 2. Content: Layout with Sidebar & Form */}
      <ContactLayout />
    </div>
  );
}
