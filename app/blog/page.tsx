"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassPanel, GradientText, SectionLabel } from "@/components/ui/Primitives";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

// Placeholder posts
const posts = [
  {
    slug: "clean-architecture-laravel",
    title: "Implementing Clean Architecture in Laravel",
    excerpt: "Bagaimana memisahkan business logic dari framework untuk aplikasi yang lebih maintainable.",
    date: "April 05, 2026",
    readTime: "8 min read",
    category: "Architecture"
  },
  {
    slug: "nextjs-16-performance-tips",
    title: "Next.js 16 Performance Optimization",
    excerpt: "Tips untuk mencapai skor 100/100 di Lighthouse dengan App Router.",
    date: "March 28, 2026",
    readTime: "5 min read",
    category: "Frontend"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-24 pb-32 px-6">
      <section className="container mx-auto max-w-4xl text-center mb-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
        >
          <SectionLabel>Thoughts & Articles</SectionLabel>
          <h1 className="text-4xl md:text-6xl font-syne font-extrabold text-[var(--text)]">
            Digital <GradientText>Notebook.</GradientText>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Berbagi wawasan seputar backend development, arsitektur sistem, dan eksplorasi teknologi terbaru.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto max-w-4xl grid grid-cols-1 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <GlassPanel className="p-8 group hover:border-accent/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-accent">
                    <span className="px-3 py-1 bg-accent/10 rounded-lg">{post.category}</span>
                    <div className="flex items-center gap-2 text-text-muted">
                        <Calendar className="w-3 h-3" /> {post.date}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-syne font-extrabold group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
                    <div className="flex items-center gap-1">
                       <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                   <ArrowRight className="w-6 h-6" />
                </div>
              </GlassPanel>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Empty State / Newsletter CTA */}
      <section className="container mx-auto max-w-2xl mt-32 text-center">
         <div className="p-12 rounded-[2.5rem] bg-accent/5 border border-accent/10">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-6" />
            <h3 className="text-2xl font-syne font-bold mb-4">Want more insights?</h3>
            <p className="text-text-muted mb-8 italic">Stay updated with my latest research and projects.</p>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 focus:outline-none focus:border-accent transition-all"
               />
               <button className="px-8 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-accent/20 hover:scale-105 transition-all outline-none">
                  Subscribe
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
