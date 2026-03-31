import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/caseStudies";
import { GlassPanel, GradientText, Button } from "@/components/ui/Primitives";
import { 
  ArrowLeft, 
  Hospital, 
  Boxes, 
  CalendarCheck, 
  RefreshCw, 
  Shield, 
  BarChart, 
  History, 
  Layers, 
  Lock,
  ExternalLink
} from "lucide-react";
import { GitHub } from "@/components/ui/Icons";

/**
 * Maps icon names to Lucide components for features.
 */
function FeatureIcon({ name, color }: { name: string; color?: string }) {
  const iconProps = { className: "w-6 h-6", style: { color: color || "var(--accent)" } };
  switch (name) {
    case "hospital": return <Hospital {...iconProps} />;
    case "boxes": return <Boxes {...iconProps} />;
    case "calendar-check": return <CalendarCheck {...iconProps} />;
    case "refresh-cw": return <RefreshCw {...iconProps} />;
    case "shield": return <Shield {...iconProps} />;
    case "bar-chart": return <BarChart {...iconProps} />;
    case "history": return <History {...iconProps} />;
    case "layers": return <Layers {...iconProps} />;
    case "lock": return <Lock {...iconProps} />;
    default: return <ExternalLink {...iconProps} />;
  }
}

/**
 * Generate static segments for all case studies.
 */
export async function generateStaticParams() {
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

/**
 * Metadata Generation
 */
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const cs = caseStudies.find((c) => c.slug === p.slug);
  if (!cs) return { title: "Project Not Found" };

  return {
    title: `Case Study: ${cs.title} | Falah.`,
    description: cs.subtitle,
  };
}

/**
 * Case Study Detail Page
 */
export default async function CaseStudyPage({ params }: { params: any }) {
  const p = await params;
  const cs = caseStudies.find((c) => c.slug === p.slug);

  if (!cs) notFound();

  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* 1. Header & Navigation */}
      <section className="container mx-auto px-6 py-12">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="max-w-4xl space-y-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border bg-bg/50"
            style={{ color: cs.badgeColor || "var(--accent)" }}
          >
            <FeatureIcon name={cs.badgeIcon} color={cs.badgeColor} />
            {cs.badge}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-white">
              {cs.title}
            </h1>
            <p className="text-lg md:text-2xl text-text-muted leading-relaxed max-w-3xl">
              {cs.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {cs.meta.map((m, i) => (
              <div key={i} className="px-4 py-2 glass-panel rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {m}
              </div>
            ))}
            <a 
              href={cs.github} 
              target="_blank" 
              className="px-6 py-2 bg-white/5 border border-border hover:border-accent hover:text-white transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <GitHub className="w-4 h-4" /> View Source
            </a>
          </div>
        </div>
      </section>

      {/* 2. KPI Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {cs.kpis.map((kpi, i) => (
            <GlassPanel key={i} className="p-8 text-center bg-accent/5 border-none">
              <span className="text-xl md:text-2xl font-syne font-extrabold text-white">{kpi.split(' ')[0]}</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-2">{kpi.split(' ').slice(1).join(' ')}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* 3. Narrative: Challenge & Solution */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <GlassPanel className="p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold text-lg">01</span>
              <h2 className="text-2xl font-syne font-bold text-white uppercase tracking-widest">The Challenge</h2>
            </div>
            <p className="text-text-muted leading-relaxed italic border-l-2 border-accent/20 pl-6">
              "{cs.challenge}"
            </p>
          </GlassPanel>

          <GlassPanel className="p-8 md:p-12 space-y-6 border-none bg-accent/5">
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold text-lg">02</span>
              <h2 className="text-2xl font-syne font-bold text-white uppercase tracking-widest">The Solution</h2>
            </div>
            <p className="text-text-muted leading-relaxed">
              {cs.solution}
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* 4. Tech Stack Visual */}
      <section className="container mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted italic">Powered By</h3>
            <div className="h-px bg-border flex-1" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {cs.techStack.map((tech) => (
              <Image 
                key={tech}
                src={`https://skillicons.dev/icons?i=${tech}`}
                alt={tech}
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform cursor-default"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-syne font-extrabold text-white mb-12">Key <GradientText>Capabilities</GradientText></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cs.features.map((feature, i) => (
            <GlassPanel key={i} className="p-8 space-y-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5"
                style={{ color: feature.color }}
              >
                <FeatureIcon name={feature.icon} color={feature.color} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-syne font-bold text-white">{feature.title}</h4>
                {feature.desc && <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>}
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {cs.schema && (
        <section className="container mx-auto px-6 py-12">
           <GlassPanel className="p-8 md:p-12 space-y-6 overflow-hidden">
            <h3 className="text-xl font-bold uppercase tracking-widest text-accent">Technical Architecture</h3>
             <pre className="p-6 bg-black/50 rounded-2xl border border-border overflow-x-auto text-[13px] leading-relaxed font-mono text-green-400 custom-scrollbar">
               <code>{cs.schema.trim()}</code>
             </pre>
           </GlassPanel>
        </section>
      )}

      {/* Footer Nav */}
      <div className="container mx-auto px-6 pt-12 flex justify-center">
         <Button variant="outline" size="sm" asChild>
            <Link href="/projects" className="group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to All Work
            </Link>
         </Button>
      </div>
    </div>
  );
}
