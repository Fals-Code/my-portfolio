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
  ExternalLink,
  Terminal,
  Code2,
  Database,
  Rocket,
  AlertCircle
} from "lucide-react";
import { GitHub } from "@/components/ui/Icons";
import TiltCard from "@/components/ui/TiltCard";

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
    case "terminal": return <Terminal {...iconProps} />;
    case "code": return <Code2 {...iconProps} />;
    case "database": return <Database {...iconProps} />;
    case "rocket": return <Rocket {...iconProps} />;
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

export default async function CaseStudyPage({ params }: { params: any }) {
  const p = await params;
  const cs = caseStudies.find((c) => c.slug === p.slug);

  if (!cs) notFound();

  return (
    <div className="flex flex-col w-full min-h-screen pb-32">
      {/* Navigation Top */}
      <div className="container mx-auto px-6 pt-4 mt-8 md:mt-8 flex justify-between items-center relative z-10">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group glass-panel px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>
        <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/50 italic px-4 py-2 glass-panel rounded-full hidden md:block">
          Case Study — {cs.slug}
        </div>
      </div>

      {/* Development Banner for Book Manager */}
      {cs.slug === "book-collection" && (
        <div className="container mx-auto px-6 mt-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-500 font-syne font-bold text-lg mb-1">Under Active Development</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Project "Book Manager" ini masih dalam tahap pengerjaan (Work In Progress). Beberapa fitur dan dokumentasi di halaman ini mungkin belum sepenuhnya rampung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Massive Hero Image Block */}
      {cs.heroImage && (
        <div className="container mx-auto px-6 mt-4 mb-16">
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-accent/5 group">
             <Image 
                src={cs.heroImage} 
                alt={cs.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[2s] unoptimized" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent opacity-90" />
             
             {/* Text over image */}
             <div className="absolute bottom-10 left-8 right-8 md:bottom-16 md:left-16 md:right-16 flex flex-col items-start gap-6">
               <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-black/50 backdrop-blur-md"
                  style={{ color: cs.badgeColor || "var(--accent)" }}
                >
                  <FeatureIcon name={cs.badgeIcon} color={cs.badgeColor} />
                  {cs.badge}
                </div>
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-syne font-extrabold leading-[0.9] text-[var(--text)] tracking-tight drop-shadow-xl">
                  {cs.title.split(' – ')[0]} <br className="hidden md:block" />
                  <GradientText>{cs.title.split(' – ')[1] || ""}</GradientText>
                </h1>
             </div>
          </div>
        </div>
      )}

      {/* Main Bento Detail Grid */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Subtitle & Meta Data (Large 3x1) */}
          <div className="md:col-span-3 space-y-8">
            <TiltCard className="p-1 glass-panel h-full">
               <div className="p-10 space-y-10 flex flex-col justify-between h-full">
                  <p className="text-2xl md:text-4xl text-text-muted leading-snug md:leading-relaxed max-w-4xl font-syne font-medium">
                    "{cs.subtitle}"
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {cs.meta.map((m, i) => (
                      <div key={i} className="px-5 py-2 glass-panel rounded-full text-[11px] font-bold uppercase tracking-widest text-text-muted bg-white/[0.02] border-white/5">
                        {m}
                      </div>
                    ))}
                  </div>
               </div>
            </TiltCard>
          </div>

          {/* Source Link (1x1) */}
          <div className="md:col-span-1">
             <TiltCard className="p-1 glass-panel">
                <div className="p-8 h-full flex flex-col justify-between items-center text-center">
                   <div className="p-4 bg-white/5 rounded-3xl border border-white/10 mb-6">
                      <GitHub className="w-12 h-12 text-[var(--text)]" />
                   </div>
                   <div className="space-y-4 w-full">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Source Code</h4>
                      <p className="text-[10px] text-text-muted">Repository & Architectue.</p>
                      <Button variant="outline" asChild className="w-full">
                        <a href={cs.github} target="_blank">View Repo <ExternalLink className="w-3 h-3 ml-2" /></a>
                      </Button>
                   </div>
                </div>
             </TiltCard>
          </div>

          {/* Challenge (2x1) */}
          <div className="md:col-span-2">
             <TiltCard className="p-1 glass-panel">
                <div className="p-8 md:p-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Terminal className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-syne font-bold text-[var(--text)] uppercase tracking-widest">The Problem</h3>
                   </div>
                   <p className="text-base md:text-lg lg:text-xl text-text-muted leading-relaxed md:leading-loose italic border-l-[3px] border-accent/40 pl-6 py-2">
                     "{cs.challenge}"
                   </p>
                </div>
             </TiltCard>
          </div>

          {/* Solution (2x1) */}
          <div className="md:col-span-2">
             <TiltCard className="p-1 glass-panel">
                <div className="p-8 md:p-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-syne font-bold text-[var(--text)] uppercase tracking-widest">The Solution</h3>
                   </div>
                   <p className="text-base md:text-lg lg:text-xl text-text-muted leading-relaxed md:leading-loose">
                     {cs.solution}
                   </p>
                </div>
             </TiltCard>
          </div>

          {/* High Impact KPIs (4x1 loop) */}
          {cs.kpis.map((kpi, i) => (
            <div key={i} className="md:col-span-1">
               <TiltCard className="p-1 glass-panel bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
                  <div className="p-8 h-full flex flex-col justify-center items-center text-center space-y-3">
                     <span className="text-4xl font-syne font-extrabold text-[var(--text)] leading-none">{kpi.split(' ')[0]}</span>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-accent leading-tight">{kpi.split(' ').slice(1).join(' ')}</p>
                  </div>
               </TiltCard>
            </div>
          ))}

          {/* Technical Schema (4x1 Wide) */}
          {cs.schema && (
            <div className="md:col-span-4 lg:col-span-4 mt-8">
               <TiltCard className="p-1 glass-panel overflow-hidden">
                  <div className="p-10 space-y-8">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-accent flex items-center gap-3">
                          <Database className="w-5 h-5" /> Base Schema
                        </h3>
                     </div>
                     <pre className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-x-auto text-xs md:text-sm leading-relaxed font-mono text-emerald-400 custom-scrollbar shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                       <code>{cs.schema.trim()}</code>
                     </pre>
                  </div>
               </TiltCard>
            </div>
          )}

          {/* Features Detail Grid (Auto-span) */}
          {cs.features.map((feature, i) => (
            <div key={i} className="md:col-span-2 lg:col-span-1 mt-8">
               <TiltCard className="p-1 glass-panel">
                  <div className="p-8 h-full flex flex-col justify-between space-y-8">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 shadow-xl border border-white/5"
                      style={{ color: feature.color }}
                    >
                      <FeatureIcon name={feature.icon} color={feature.color} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl md:text-2xl font-syne font-bold text-[var(--text)] leading-tight">{feature.title}</h4>
                      {feature.desc && <p className="text-sm md:text-base text-text-muted leading-relaxed opacity-90">{feature.desc}</p>}
                    </div>
                  </div>
               </TiltCard>
            </div>
          ))}

          {/* Powered By (4x1 Bottom) */}
          <div className="md:col-span-4 mt-12 mb-12">
             <TiltCard className="p-1 glass-panel bg-transparent border-dashed border-[var(--border)]">
                <div className="p-10 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
                   <div className="space-y-2">
                     <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-muted">Built With</h3>
                     <p className="text-2xl font-syne font-extrabold text-[var(--text)]">The Tech Stack</p>
                   </div>
                   <div className="h-10 w-px bg-white/10 hidden md:block" />
                   <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {cs.techStack.map((tech) => (
                      <div key={tech} className="relative group/tech">
                        <img 
                          src={`https://skillicons.dev/icons?i=${tech}&theme=dark`}
                          alt={tech}
                          className="w-12 h-12 md:w-16 md:h-16 grayscale opacity-40 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 group-hover/tech:-translate-y-2 transition-all duration-300 cursor-default"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tech:opacity-100 transition-opacity text-[9px] font-bold uppercase tracking-widest text-accent">{tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
             </TiltCard>
          </div>

        </div>
      </section>

      {/* Action Bottom */}
      <div className="container mx-auto px-6 pt-6 flex justify-center">
         <Button variant="outline" size="lg" asChild className="rounded-full px-12 py-8 bg-white/[0.01] hover:bg-accent hover:border-transparent transition-all">
            <Link href="/projects" className="group text-base">
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Explore More Work
            </Link>
         </Button>
      </div>
    </div>
  );
}
