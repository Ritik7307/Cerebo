export const dynamic = "force-dynamic";
import { Target, Code, Layout, Globe } from "lucide-react";
import { getDomainProgress } from "@/actions/roadmaps";
import { TopicCard } from "@/components/features/TopicCard";

export default async function DevelopmentPage() {
  const progress = await getDomainProgress("Full Stack");
  const completedTopics = progress.filter(p => p.status === "completed").map(p => p.topic);
  const mastery = Math.round((completedTopics.length / 4) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Full Stack Development</h1>
          <p className="text-zinc-400">Build scalable web apps from front to back.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
            <p className="text-2xl font-bold text-purple-400">{mastery}%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Mastery</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TopicCard title="HTML, CSS & JavaScript" domain="Full Stack" isCompleted={completedTopics.includes("HTML, CSS & JavaScript")} icon={<Globe />} />
          <TopicCard title="React & Next.js" domain="Full Stack" isCompleted={completedTopics.includes("React & Next.js")} icon={<Layout />} isLocked={!completedTopics.includes("HTML, CSS & JavaScript")} />
          <TopicCard title="Node.js & Express" domain="Full Stack" isCompleted={completedTopics.includes("Node.js & Express")} icon={<Code />} isLocked={!completedTopics.includes("React & Next.js")} />
          <TopicCard title="Docker & CI/CD" domain="Full Stack" isCompleted={completedTopics.includes("Docker & CI/CD")} icon={<Code />} isLocked={!completedTopics.includes("Node.js & Express")} />
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Current Project
            </h2>
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <h3 className="font-medium text-white mb-2">Build a Kanban Board</h3>
              <p className="text-sm text-zinc-400">Practice React state management and drag-and-drop mechanics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

