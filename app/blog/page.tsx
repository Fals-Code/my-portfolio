"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassPanel, EditorialHeading, InteractiveContainer, Button } from "@/components/ui/Primitives";
import { Calendar, Clock, ArrowRight, BookOpen, Send, Sparkles } from "lucide-react";
import { fadeReveal } from "@/lib/motion-tokens";

// Placeholder posts
const posts = [
  {
    slug: "clean-architecture-laravel",
    title: "Implementing Clean Architecture in Laravel",
    excerpt: "A deep dive into decoupling business logic from the framework for maintenance-free apps.",
    date: "April 05, 2026",
    readTime: "8 min read",
    category: "Architecture"
  },
  {
    slug: "nextjs-16-performance-tips",
    title: "Next.js 16 Performance Optimization",
    excerpt: "Advanced tactics for achieving a perfect 100/100 Lighthouse score with App Router.",
    date: "March 28, 2026",
    readTime: "5 min read",
    category: "Frontend"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-32 pb-40 px-6">
      
      {/* Header */}
      <section className="container mx-auto max-w-6xl mb-24">
        <EditorialHeading 
          sub="Thoughts & Artifacts"
        >
          The Digital <br />
          <span className="text-white/40 italic">Journal of Intent.</span>
        </EditorialHeading>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeReveal}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 leading-relaxed mt-10 max-w-2xl font-medium"
        >
          Sharing research on backend systems, architectural patterns, and the philosophy of building resilient software.
        </motion.p>
      </section>

      {/* Blog List - Magazine Style */}
      <section className="container mx-auto max-w-6xl grid grid-cols-1 gap-12">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            variants={fadeReveal}
          >
            <Link href={`/blog/${post.slug}`}>
              <InteractiveContainer>
                 <GlassPanel className="p-10 md:p-14 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent px-4 py-1.5 rounded-full border border-accent/20 bg-accent/10">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/20">
                            <Calendar className="w-3.5 h-3.5" /> {post.date}
                          </div>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-syne font-bold text-white group-hover:text-accent transition-colors duration-500">
                          {post.title}
                        </h2>
                        
                        <p className="text-base md:text-lg text-white/40 leading-relaxed font-medium line-clamp-2 max-w-3xl">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20 pt-2">
                           <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-6">
                         <div className="w-16 h-16 rounded-full border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-700">
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                   </div>
                 </GlassPanel>
              </InteractiveContainer>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Newsletter - Premium CTA */}
      <section className="container mx-auto max-w-5xl mt-40">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeReveal}
        >
          <GlassPanel className="p-16 md:p-24 border-accent/20 bg-accent/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/20 blur-[120px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                 <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-4xl font-syne font-extrabold text-white">Subscribe to the <br /><span className="text-white/40 italic font-serif">Journal.</span></h3>
              <p className="text-white/40 font-medium text-lg italic">Get occasional deep dives into specialized backend architecture and technical research.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
                <input 
                  type="email" 
                  placeholder="falah@architecture.dev" 
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all font-medium"
                />
                <Button variant="secondary" className="px-10 h-16">
                   Join List <Send className="w-4 h-4 ml-3" />
                </Button>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Zero spam. Pure technical value.</p>
            </div>
          </GlassPanel>
        </motion.div>
      </section>
      
    </div>
  );
}
