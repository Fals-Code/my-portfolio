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
  Rocket
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
      <div className="container mx-auto px-6 pt-12 flex justify-between items-center">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
        <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/50 italic">
          Case Study — {cs.slug}
        </div>
      </div>

      {/* Main Bento Detail Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Hero Block (Large 4x1 or 3x1) */}
          <div className="md:col-span-3 space-y-8">
            <TiltCard className="p-1 glass-panel">
               <div className="p-12 space-y-10">
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border bg-bg/50"
                    style={{ color: cs.badgeColor || "var(--accent)" }}
                  >
                    <FeatureIcon name={cs.badgeIcon} color={cs.badgeColor} />
                    {cs.badge}
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-8xl font-syne font-extrabold leading-[0.9] text-white">
                      {cs.title.split(' – ')[0]}<br />
                      <GradientText>{cs.title.split(' – ')[1] || ""}</GradientText>
                    </h1>
                    <p className="text-xl md:text-3xl text-text-muted leading-relaxed max-w-3xl font-syne opacity-80">
                      {cs.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {cs.meta.map((m, i) => (
                      <div key={i} className="px-4 py-2 glass-panel rounded-full text-[10px] font-bold uppercase tracking-widest text-text-muted">
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
                      <GitHub className="w-12 h-12 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white">Open Source</h4>
                      <p className="text-xs text-text-muted">Check out the code and architectue on GitHub.</p>
                      <Button variant="outline" asChild className="w-full">
                        <a href={cs.github} target="_blank">Repository <ExternalLink className="w-3 h-3 ml-2" /></a>
                      </Button>
                   </div>
                </div>
             </TiltCard>
          </div>

          {/* Challenge (2x1) */}
          <div className="md:col-span-2">
             <TiltCard className="p-1 glass-panel">
                <div className="p-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Terminal className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-syne font-bold text-white uppercase tracking-widest">The Challenge</h3>
                   </div>
                   <p className="text-lg text-text-muted leading-relaxed italic border-l-4 border-accent/20 pl-8 py-2">
                     "{cs.challenge}"
                   </p>
                </div>
             </TiltCard>
          </div>

          {/* Solution (2x1) */}
          <div className="md:col-span-2">
             <TiltCard className="p-1 glass-panel">
                <div className="p-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-syne font-bold text-white uppercase tracking-widest">The Solution</h3>
                   </div>
                   <p className="text-lg text-text-muted leading-relaxed">
                     {cs.solution}
                   </p>
                </div>
             </TiltCard>
          </div>

          {/* High Impact KPIs (4x1 loop) */}
          {cs.kpis.map((kpi, i) => (
            <div key={i} className="md:col-span-1">
               <TiltCard className="p-1 glass-panel bg-accent/5 border-none">
                  <div className="p-8 h-full flex flex-col justify-center items-center text-center space-y-2">
                     <span className="text-3xl font-syne font-extrabold text-white">{kpi.split(' ')[0]}</span>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted leading-tight">{kpi.split(' ').slice(1).join(' ')}</p>
                  </div>
               </TiltCard>
            </div>
          ))}

          {/* Technical Schema (4x1 Wide) */}
          {cs.schema && (
            <div className="md:col-span-4 lg:col-span-4">
               <TiltCard className="p-1 glass-panel overflow-hidden">
                  <div className="p-10 space-y-8">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-accent">Technical Architecture</h3>
                        <Database className="w-5 h-5 text-text-muted" />
                     </div>
                     <pre className="p-8 bg-black/50 rounded-3xl border border-white/5 overflow-x-auto text-[14px] leading-relaxed font-mono text-green-400 custom-scrollbar shadow-inner">
                       <code>{cs.schema.trim()}</code>
                     </pre>
                  </div>
               </TiltCard>
            </div>
          )}

          {/* Features Detail Grid (Auto-span) */}
          {cs.features.map((feature, i) => (
            <div key={i} className="md:col-span-2 lg:col-span-1">
               <TiltCard className="p-1 glass-panel">
                  <div className="p-10 h-full flex flex-col justify-between space-y-8">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 shadow-xl"
                      style={{ color: feature.color }}
                    >
                      <FeatureIcon name={feature.icon} color={feature.color} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-syne font-bold text-white leading-tight">{feature.title}</h4>
                      {feature.desc && <p className="text-sm text-text-muted leading-relaxed opacity-80">{feature.desc}</p>}
                    </div>
                  </div>
               </TiltCard>
            </div>
          ))}

          {/* Powered By (4x1 Bottom) */}
          <div className="md:col-span-4 mt-8">
             <TiltCard className="p-1 glass-panel bg-white/[0.01] border-dashed border-white/10">
                <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-12">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-muted">Tech Stack</h3>
                   <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {cs.techStack.map((tech) => (
                      <div key={tech} className="relative group/tech">
                        <Image 
                          src={`https://skillicons.dev/icons?i=${tech}&theme=dark`}
                          alt={tech}
                          width={48}
                          height={48}
                          className="w-10 h-10 md:w-12 md:h-12 grayscale opacity-50 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-500 cursor-default unoptimized"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tech:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest text-accent">{tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
             </TiltCard>
          </div>

        </div>
      </section>

      {/* Action Bottom */}
      <div className="container mx-auto px-6 pt-12 flex justify-center">
         <Button variant="outline" size="sm" asChild className="rounded-full px-12 py-6 border-accent/20 hover:border-accent">
            <Link href="/projects" className="group text-base">
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Explore More Projects
            </Link>
         </Button>
      </div>
    </div>
  );
}
