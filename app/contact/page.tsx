"use client";

import React, { useState } from "react";
import Terminal from "@/components/ui/Terminal";
import HttpBadge from "@/components/ui/HttpBadge";
import { Send, Mail } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  // HAPUS backslash (\) di awal, akhir, dan di depan tanda dollar ($)
  const payloadPreview = `{
  "endpoint": "/api/contact/message",
  "method": "POST",
  "payload": {
    "name": "${formData.name || '...'}",
    "email": "${formData.email || '...'}",
    "message": "${formData.message || '...'}"
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[80vh]">
      
      <div className="flex items-center gap-4 mb-16 scroll-reveal">
        <h1 className="text-4xl md:text-5xl font-syne">/contact</h1>
        <HttpBadge method="DELETE" endpoint="boredom" className="cursor-default pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 scroll-reveal">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-card2)]">
              <div className="font-mono text-sm text-[var(--text)]">Execute Payload</div>
              <span className="text-[var(--post)] font-bold text-sm">[POST]</span>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all resize-none"
                  placeholder="Let's build something..."
                />
              </div>

              <button 
                type="submit" 
                disabled={formStatus === "sending" || formStatus === "success"}
                className="w-full flex items-center justify-center gap-3 bg-[rgba(77,156,255,0.1)] border border-[var(--post)] text-[var(--post)] font-mono font-bold py-4 rounded-md hover:bg-[var(--post)] hover:text-[#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {formStatus === "idle" && (
                  <>
                    <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    DISPATCH REQUEST
                  </>
                )}
                {formStatus === "sending" && "AWAITING RESPONSE..."}
                {formStatus === "success" && "201 CREATED ✓"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Socials & Terminal Preview */}
        <div className="lg:col-span-5 flex flex-col gap-8 scroll-reveal" style={{ animationDelay: "0.2s" }}>
          
          {/* Real-time Payload Preview */}
          <Terminal 
            title="json - payload_preview.json"
            content={payloadPreview}
            className="w-full shadow-xl shadow-[var(--post)]/5 hidden md:flex"
          />

          {/* Social Endpoints */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-6">Social Endpoints</h3>
            <div className="space-y-4">
              <a href="https://github.com/Fals-code" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg)] transition-all group">
                <FaGithub className="w-5 h-5 text-[var(--text)] group-hover:text-[var(--get)] transition-colors" />
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-[var(--text)] group-hover:text-[var(--get)] transition-colors">GitHub</span>
                  <span className="font-mono text-xs text-[var(--muted)]">github.com/Fals-code</span>
                </div>
              </a>
              

              <a href="mailto: ahmadmathlaulfalah14@gmail.com" className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg)] transition-all group">
                <Mail className="w-5 h-5 text-[var(--text)] group-hover:text-[var(--patch)] transition-colors" />
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-[var(--text)] group-hover:text-[var(--patch)] transition-colors">Email</span>
                  <span className="font-mono text-xs text-[var(--muted)]">ahmadmathlaulfalah14@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}