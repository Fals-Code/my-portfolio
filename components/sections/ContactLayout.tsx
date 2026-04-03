"use client";

import React, { useState } from "react";
import { GlassPanel, Button } from "@/components/ui/Primitives";
import { Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { GitHub, Instagram } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Headless Contact Form using fetch to Formspree
 */
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    try {
      const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
      if (!FORMSPREE_ID) {
        console.error("NEXT_PUBLIC_FORMSPREE_ID not set in .env.local");
        setStatus("error");
        return;
      }
      const response = await fetch(`https://formspree.io/f/xbdaeavv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <GlassPanel className="p-6 md:p-12 space-y-8">
      <h3 className="text-2xl font-syne font-bold text-[var(--text)]">Send a Message</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-2">Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all text-[var(--text)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-2">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all text-[var(--text)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-2">Subject</label>
        <input 
          type="text" 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all text-[var(--text)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-2">Message</label>
        <textarea 
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me more..."
          className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all text-[var(--text)] min-h-[120px] resize-none"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !formData.email}
          className="w-full md:w-auto bg-accent text-white px-10 py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Send Message
        </button>

        <AnimatePresence>
          {status === "success" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-500 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" /> Message sent successfully!
            </motion.div>
          )}
          {status === "error" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-500 text-sm font-bold">
              <AlertCircle className="w-5 h-5" /> Something went wrong. Try again.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

/**
 * Sidebar for Contact Info
 */
function ContactSidebar() {
  const items = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "ahmadmathlaulfalah14@gmail.com", href: "mailto:ahmadmathlaulfalah14@gmail.com" },
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", value: "@falahh.am", href: "https://instagram.com/falahh.am" },
    { icon: <GitHub className="w-5 h-5" />, label: "GitHub", value: "github.com/Fals-Code", href: "https://github.com/Fals-Code" },
    { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Gresik — Surabaya, ID", href: "https://maps.google.com/?q=Surabaya" },
  ];

  return (
    <div className="space-y-8">
      <GlassPanel className="p-8 space-y-8">
        <h3 className="text-xl font-syne font-bold text-[var(--text)]">Contact Info</h3>
        <div className="space-y-6">
          {items.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              target="_blank" 
              className="flex items-start gap-4 group"
            >
              <div className="p-3 glass-panel rounded-xl group-hover:bg-accent group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</p>
                <p className="text-sm font-medium text-[var(--text)] group-hover:text-accent transition-colors">{item.value}</p>
              </div>
            </a>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-8 border-accent/20 bg-accent/[0.03]">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--text)]">Currently Available</h4>
            <p className="text-xs text-text-muted">Open to freelance & collaborations.</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

/**
 * Main Contact Layout
 */
export default function ContactLayout() {
  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="grid grid-cols-1 lg:grid-cols-12 grid-airy items-start">
        <div className="lg:col-span-4">
          <ContactSidebar />
        </div>
        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
