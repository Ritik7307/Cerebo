export const dynamic = "force-dynamic";
import { Map, ChevronRight, BrainCircuit, Code, Database, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { getAllProgress } from "@/actions/roadmaps";
import { getAIRoadmaps } from "@/actions/ai-roadmap";
import { AIRoadmapBoard } from "@/components/features/AIRoadmapBoard";

export default async function RoadmapsPage() {
  const allProgress = await getAllProgress();
  const aiRoadmaps = await getAIRoadmaps();

  const getMastery = (domain: string, total: number) => {
    const completed = allProgress.filter((p: { domain: string; status: string; }) => p.domain === domain && p.status === "completed").length;
    return Math.round((completed / total) * 100) || 0;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Roadmaps</h1>
        <p className="text-zinc-400">Structured paths to master your career domains.</p>
      </header>

      <AIRoadmapBoard initialRoadmaps={aiRoadmaps} />

      <div className="pt-8 border-t border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-6">Standard Roadmaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoadmapCard
          title="Data Structures & Algorithms"
          description="Master problem solving, patterns, and logic for coding interviews."
          progress={getMastery("DSA", 6)}
          icon={<BrainCircuit className="w-6 h-6 text-emerald-400" />}
          href="/dsa"
          color="bg-emerald-500"
        />
        <RoadmapCard
          title="System Design"
          description="Learn scalability, microservices, databases, and distributed systems."
          progress={getMastery("System Design", 4)}
          icon={<Database className="w-6 h-6 text-blue-400" />}
          href="/system-design"
          color="bg-blue-500"
        />
        <RoadmapCard
          title="Full Stack Development"
          description="Build scalable web apps with React, Next.js, and Node."
          progress={getMastery("Full Stack", 4)}
          icon={<LayoutTemplate className="w-6 h-6 text-purple-400" />}
          href="/development"
          color="bg-purple-500"
        />
        <RoadmapCard
          title="AI / Machine Learning"
          description="Explore Neural Networks, Transformers, and LLMs."
          progress={getMastery("AI", 4)}
          icon={<Code className="w-6 h-6 text-orange-400" />}
          href="/ai"
          color="bg-orange-500"
        />
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ title, description, progress, icon, href, color }: any) {
  // Map color classes to hex for the soft glow effect
  const glowColors: Record<string, string> = {
    "bg-emerald-500": "rgba(16, 185, 129, 0.15)",
    "bg-blue-500": "rgba(59, 130, 246, 0.15)",
    "bg-purple-500": "rgba(168, 85, 247, 0.15)",
    "bg-orange-500": "rgba(249, 115, 22, 0.15)",
  };
  
  const glow = glowColors[color] || "rgba(255,255,255,0.1)";

  return (
    <Link 
      href={href} 
      className="group relative block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/50"
      style={{
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02)`
      }}
    >
      {/* Animated Hover Gradient Background */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${glow}, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800/80 group-hover:scale-110 transition-transform duration-500 shadow-inner">
            {icon}
          </div>
          <div className="p-2 bg-zinc-900/50 rounded-full border border-zinc-800 opacity-50 group-hover:opacity-100 group-hover:bg-zinc-800 transition-all duration-300">
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">{title}</h3>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">{description}</p>

        <div>
          <div className="flex justify-between text-xs mb-3 font-semibold tracking-wide uppercase">
            <span className="text-zinc-500">Progress</span>
            <span className="text-zinc-300">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-950/80 rounded-full h-2 border border-zinc-800/80 overflow-hidden">
            <div 
              className={`h-full rounded-full ${color} relative`} 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

