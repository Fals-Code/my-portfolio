"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "27 April 2026";

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="space-y-4 border-b border-[var(--border)] pb-10">
          <h1 className="text-3xl md:text-5xl font-syne font-bold">Privacy Policy</h1>
          <p className="text-[var(--muted)] font-mono text-sm uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[var(--text)]/80 leading-relaxed">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--get)]">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider font-syne">1. Pendahuluan</h2>
            </div>
            <p>
              Selamat datang di portofolio digital Ahmad Mathlaul Falah (**falah.dev**). Privasi Anda adalah prioritas utama saya. Kebijakan ini menjelaskan bagaimana informasi Anda dikumpulkan, digunakan, dan dilindungi saat menggunakan situs ini.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--post)]">
              <Eye className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider font-syne">2. Informasi yang Dikumpulkan</h2>
            </div>
            <div className="space-y-3 pl-8 border-l border-[var(--border)]">
              <p><strong>Data Formulir Kontak:</strong> Saat Anda mengirimkan pesan melalui halaman kontak, saya mengumpulkan Nama, Email, dan isi pesan untuk keperluan korespondensi.</p>
              <p><strong>Google Analytics:</strong> Saya menggunakan layanan pihak ketiga untuk menganalisis lalu lintas situs (seperti durasi kunjungan dan jenis browser) guna meningkatkan pengalaman pengguna.</p>
              <p><strong>LocalStorage:</strong> Situs ini menggunakan penyimpanan lokal browser untuk menyimpan preferensi tema (dark/light mode) dan cache data API sementara.</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--patch)]">
              <Lock className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider font-syne">3. Perlindungan Data</h2>
            </div>
            <p>
              Data yang Anda kirimkan tidak akan pernah dijual atau disebarkan kepada pihak ketiga untuk tujuan pemasaran. Seluruh komunikasi melalui formulir diamankan menggunakan enkripsi HTTPS.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--get)]">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-bold uppercase tracking-wider font-syne">4. Hak Pengguna</h2>
            </div>
            <p>
              Anda memiliki hak untuk meminta penghapusan data korespondensi yang pernah Anda kirimkan. Silakan hubungi saya melalui email di **ahmadmathlaulfalah14@gmail.com** untuk permintaan tersebut.
            </p>
          </section>

          <div className="pt-10 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)] italic">
              Dengan menggunakan situs ini, Anda dianggap menyetujui kebijakan privasi yang berlaku.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
