"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Terminal from "@/components/ui/Terminal";
import HttpBadge from "@/components/ui/HttpBadge";
import { Send, Mail, AlertCircle, CheckCircle2, Terminal as TerminalIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FORMSPREE_ENDPOINT } from "@/lib/constants";

type FormStatus = "idle" | "sending" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
  priority: "LOW" | "NORMAL" | "CRITICAL";
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  priority: string;
  timestamp: string;
}

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ticketId, setTicketId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    priority: "NORMAL"
  });
  const [guestbookLogs, setGuestbookLogs] = useState<GuestbookEntry[]>([]);
  const [sqlAnimation, setSqlAnimation] = useState<{ query: string; status: string } | null>(null);

  // Load guestbook logs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("falah_guestbook");
    if (saved) {
      try {
        setGuestbookLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guestbook logs");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Client-side validation (guards against whitespace-only input) ---
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Name must be at least 2 characters.");
      setFormStatus("error");
      setTimeout(() => { setFormStatus("idle"); setErrorMessage(""); }, 4000);
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setFormStatus("error");
      setTimeout(() => { setFormStatus("idle"); setErrorMessage(""); }, 4000);
      return;
    }
    if (!trimmedMessage || trimmedMessage.length < 10) {
      setErrorMessage("Message must be at least 10 characters.");
      setFormStatus("error");
      setTimeout(() => { setFormStatus("idle"); setErrorMessage(""); }, 4000);
      return;
    }
    // --- End validation ---

    setFormStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          priority: formData.priority,
          _subject: `New Ticket: [${formData.priority}] from ${formData.name}`
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.errors?.map((e: { message: string }) => e.message).join(", ") ||
          "Ticket generation failed. Check your connection.";
        throw new Error(msg);
      }

      const newId = `TIC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // SQL Animation Sequence
      const escapedName = formData.name.replace(/'/g, "''");
      const escapedMessage = formData.message.replace(/'/g, "''");
      const mockQuery = `INSERT INTO guestbook (id, name, message, priority, created_at)\nVALUES ('${newId}', '${escapedName}', '${escapedMessage}', '${formData.priority}', NOW());`;
      
      setSqlAnimation({ query: mockQuery, status: "Executing query..." });
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSqlAnimation(prev => ({ ...prev!, status: "Query OK, 1 row affected (0.01 sec)" }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newEntry: GuestbookEntry = {
        id: newId,
        name: formData.name,
        message: formData.message,
        priority: formData.priority,
        timestamp: new Date().toISOString()
      };

      const updatedLogs = [newEntry, ...guestbookLogs];
      setGuestbookLogs(updatedLogs);
      localStorage.setItem("falah_guestbook", JSON.stringify(updatedLogs));

      setTicketId(newId);
      setFormStatus("success");
      setSqlAnimation(null);
      setFormData({ name: "", email: "", message: "", priority: "NORMAL" });

      // Reset ke idle setelah 10 detik agar user sempat mencatat ticketId
      setTimeout(() => {
        setFormStatus("idle");
        setTicketId("");
      }, 10000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
      setFormStatus("error");

      // Reset ke idle setelah 5 detik
      setTimeout(() => {
        setFormStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Reset error state saat user mulai mengetik lagi
      if (formStatus === "error") {
        setFormStatus("idle");
        setErrorMessage("");
      }
    };

  // Preview payload untuk terminal
  const payloadPreview = `{
  "endpoint": "/api/v1/tickets",
  "method": "POST",
  "headers": {
    "X-Priority": "${formData.priority}"
  },
  "payload": {
    "reporter": "${formData.name || "..."}",
    "callback": "${formData.email || "..."}",
    "issue": "${formData.message || "..."}"
  }
}`;

  const isDisabled = formStatus === "sending" || formStatus === "success" || sqlAnimation !== null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[80vh] relative">
      
      {/* SQL Execution Overlay */}
      <AnimatePresence>
        {sqlAnimation && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0c0c0f] border border-[var(--get)]/50 rounded-xl p-6 shadow-[0_0_50px_rgba(0,229,160,0.1)] max-w-2xl w-full font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <span className="w-3 h-3 rounded-full bg-[var(--get)] animate-pulse" />
                <span className="text-[var(--muted)]">MySQL Connection: Established</span>
              </div>
              <div className="text-[var(--get)] whitespace-pre-wrap mb-6 break-words">
                mysql&gt; {sqlAnimation.query}
              </div>
              <div className="text-[var(--muted)] border-t border-white/5 pt-4">
                {sqlAnimation.status}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12 md:mb-16 scroll-reveal">
        <h1 className="text-3xl md:text-5xl font-syne">/ticketing</h1>
        <HttpBadge
          method="POST"
          endpoint="priority: critical"
          className="cursor-default pointer-events-none w-fit"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 scroll-reveal">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
            {/* Header card */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-card2)]">
              <div className="font-mono text-sm text-[var(--text)]">
                Issue Reporting System
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[var(--get)] font-bold text-[10px] animate-pulse">● SYSTEM LIVE</span>
                <span className="text-[var(--post)] font-bold text-sm">[POST]</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs text-[var(--muted)] uppercase tracking-widest">
                    Reporter Identity
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isDisabled}
                    value={formData.name}
                    onChange={handleChange("name")}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter Name..."
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs text-[var(--muted)] uppercase tracking-widest">
                    Callback Endpoint
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isDisabled}
                    value={formData.email}
                    onChange={handleChange("email")}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter Email..."
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs text-[var(--muted)] uppercase tracking-widest">
                  Ticket Priority
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
                  {(["LOW", "NORMAL", "CRITICAL"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                      className={`py-2 rounded border font-mono text-[10px] font-bold transition-all ${
                        formData.priority === p 
                          ? p === "CRITICAL" ? "bg-[var(--delete)]/20 border-[var(--delete)] text-[var(--delete)] shadow-[0_0_10px_rgba(255,92,106,0.2)]" :
                            p === "LOW" ? "bg-[var(--get)]/20 border-[var(--get)] text-[var(--get)]" :
                            "bg-[var(--post)]/20 border-[var(--post)] text-[var(--post)]"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs text-[var(--muted)] uppercase tracking-widest">
                  Issue Payload (Message)
                </label>
                <textarea
                  required
                  rows={5}
                  disabled={isDisabled}
                  value={formData.message}
                  onChange={handleChange("message")}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--post)] focus:ring-1 focus:ring-[var(--post)] transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Describe your request or bug..."
                />
              </div>

              {/* Error Message */}
              {formStatus === "error" && errorMessage && (
                <div className="flex items-start gap-3 p-4 rounded-md bg-[rgba(255,92,106,0.08)] border border-[var(--delete)] text-[var(--delete)] font-mono text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-bold">[ERROR]</span> {errorMessage}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full flex items-center justify-center gap-3 font-mono font-bold py-4 rounded-md transition-all disabled:cursor-not-allowed group
                  ${
                    formStatus === "success"
                      ? "bg-[rgba(0,229,160,0.1)] border border-[var(--get)] text-[var(--get)]"
                      : formStatus === "error"
                      ? "bg-[rgba(255,92,106,0.1)] border border-[var(--delete)] text-[var(--delete)]"
                      : "bg-[rgba(77,156,255,0.1)] border border-[var(--post)] text-[var(--post)] hover:bg-[var(--post)] hover:text-[#000]"
                  }`}
              >
                {formStatus === "idle" && (
                  <>
                    <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    DISPATCH REQUEST
                  </>
                )}
                {formStatus === "sending" && (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    AWAITING RESPONSE...
                  </>
                )}
                {formStatus === "success" && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {ticketId ? `TICKET CREATED: ${ticketId}` : "201 CREATED ✓"}
                  </>
                )}
                {formStatus === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    RETRY REQUEST
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Terminal + Socials */}
        <div
          className="lg:col-span-5 flex flex-col gap-8 scroll-reveal"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Real-time Payload Preview */}
          <Terminal
            title="json - payload_preview.json"
            content={payloadPreview}
            className="w-full shadow-xl shadow-[var(--post)]/5 hidden md:flex"
          />

          {/* Social Endpoints */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-6">
              Social Endpoints
            </h3>
            <div className="space-y-4">
              {/* GitHub */}
              <a
                href="https://github.com/Fals-code"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg)] transition-all group"
              >
                <FaGithub className="w-5 h-5 text-[var(--text)] group-hover:text-[var(--get)] transition-colors" />
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-[var(--text)] group-hover:text-[var(--get)] transition-colors">
                    GitHub
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)]">
                    github.com/Fals-code
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:ahmadmathlaulfalah14@gmail.com"
                className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg)] transition-all group"
              >
                <Mail className="w-5 h-5 text-[var(--text)] group-hover:text-[var(--patch)] transition-colors" />
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-[var(--text)] group-hover:text-[var(--patch)] transition-colors">
                    Email
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)] truncate max-w-[200px] xs:max-w-none">
                    ahmadmathlaulfalah14@gmail.com
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Response Status Info */}
          <div className="bg-[var(--bg-card2)] border border-[var(--border)] rounded-xl p-5 font-mono text-xs space-y-2">
            <div className="text-[var(--muted)] uppercase tracking-widest mb-3">
              Response Codes
            </div>
            {[
              { code: "201 Created", desc: "Message sent successfully", color: "var(--get)" },
              { code: "422 Unprocessable", desc: "Validation failed", color: "var(--patch)" },
              { code: "500 Server Error", desc: "Try again later", color: "var(--delete)" },
            ].map(({ code, desc, color }) => (
              <div key={code} className="flex items-center gap-3">
                <span className="font-bold" style={{ color }}>
                  {code}
                </span>
                <span className="text-[var(--muted)]">→ {desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MySQL Guestbook Table */}
      {guestbookLogs.length > 0 && (
        <div className="mt-16 scroll-reveal bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#0c0c0f]">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-[var(--get)]" />
              <span className="font-mono text-xs text-[var(--muted)]">mysql&gt; SELECT * FROM guestbook;</span>
            </div>
            <div className="md:hidden flex items-center gap-1 text-[var(--get)] animate-pulse">
              <span className="font-mono text-[9px] uppercase tracking-tighter">Swipe table</span>
            </div>
          </div>
          <div className="p-6 font-mono text-[10px] md:text-xs whitespace-pre">
            <div className="text-[var(--text)]">
{`+----------------+----------------------+----------------------+------------+----------------------+
| id             | name                 | message              | priority   | created_at           |
+----------------+----------------------+----------------------+------------+----------------------+`}
              {guestbookLogs.map(log => {
                const id = log.id.padEnd(14);
                const name = log.name.length > 20 ? log.name.substring(0, 17) + '...' : log.name.padEnd(20);
                const msg = log.message.replace(/\n/g, ' ').length > 20 ? log.message.replace(/\n/g, ' ').substring(0, 17) + '...' : log.message.replace(/\n/g, ' ').padEnd(20);
                const prio = log.priority.padEnd(10);
                const date = new Date(log.timestamp).toISOString().substring(0, 19).replace('T', ' ').padEnd(20);
                
                return `\n| ${id} | ${name} | ${msg} | ${prio} | ${date} |`;
              })}
{`\n+----------------+----------------------+----------------------+------------+----------------------+
${guestbookLogs.length} rows in set (0.00 sec)`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
