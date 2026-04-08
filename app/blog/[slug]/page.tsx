"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/Primitives";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  // Placeholder content
  const post = {
    title: slug?.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Blog Post",
    date: "April 05, 2026",
    readTime: "8 min read",
    author: "Ahmad Mathlaul Falah",
    content: `
      <p className="mb-6">This is a placeholder for your blog content. You can integrate MDX or a CMS later to populate this area dynamically.</p>
      
      <h2 className="text-2xl font-bold font-syne mt-10 mb-6 text-accent">Why Architecture Matters</h2>
      <p className="mb-6">Clean architecture ensures your application remains maintainable as it grows. By separating concerns, you make testing easier and swaps of external dependencies (like databases or APIs) less painful.</p>
      
      <blockquote className="border-l-4 border-accent pl-6 italic my-10 text-xl text-text-muted">
        "Software architecture is the high-level structure of a software system and the discipline of creating such structures."
      </blockquote>
      
      <h2 className="text-2xl font-bold font-syne mt-10 mb-6 text-accent">Key Principles</h2>
      <ul className="list-disc ml-6 space-y-3 mb-10 text-text-muted">
         <li><strong>Separation of Concerns:</strong> Divide your code into distinct sections.</li>
         <li><strong>Dependency Rule:</strong> Source code dependencies only point inwards.</li>
         <li><strong>ACID Compliance:</strong> Ensure database transactions are Atomic, Consistent, Isolated, and Durable.</li>
      </ul>
      
      <p>Happy coding!</p>
    `
  };

  return (
    <article className="min-h-screen pt-32 pb-40 px-6">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-all font-bold uppercase tracking-widest text-[10px] mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notebook
        </Link>

        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-16"
        >
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-accent">
             <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
             <div className="flex items-center gap-1.5 text-text-muted"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-syne font-extrabold leading-tight tracking-tighter text-[var(--text)]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-8 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">F</div>
               <div className="text-sm">
                  <p className="font-bold">{post.author}</p>
                  <p className="text-xs text-text-muted">Backend Developer</p>
               </div>
            </div>
            <button className="p-3 rounded-full hover:bg-accent/10 text-text-muted hover:text-accent transition-all">
               <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none text-text-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-40">
           <GlassPanel className="p-12 text-center bg-accent/5 border-accent/10">
              <h3 className="text-2xl font-syne font-bold mb-4">Did you find this useful?</h3>
              <p className="text-text-muted mb-8">Feel free to share or check out other articles.</p>
              <div className="flex justify-center gap-4">
                 <Link href="/blog" className="px-8 py-3 glass-panel hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">
                    More Posts
                 </Link>
                 <button className="px-8 py-3 bg-accent text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-accent/20 hover:scale-105 transition-all">
                    Subscribe
                 </button>
              </div>
           </GlassPanel>
        </div>
      </div>
    </article>
  );
}
