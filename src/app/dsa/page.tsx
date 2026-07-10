export const dynamic = "force-dynamic";
import { CheckCircle2, ChevronRight, BrainCircuit, Play, Network, Box, Braces, Clock, Target, Zap } from "lucide-react";
import { getDomainProgress } from "@/actions/roadmaps";
import { TopicCard } from "@/components/features/TopicCard";

export default async function DSAPage() {
  const progress = await getDomainProgress("DSA");
  const completedTopics = progress.filter((p: { status: string; }) => p.status === "completed").map((p: { topic: any; }) => p.topic);
  const mastery = Math.round((completedTopics.length / 6) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Data Structures & Algorithms</h1>
          <p className="text-zinc-400">Master logic, recognize patterns, crush the interview.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
            <p className="text-2xl font-bold text-emerald-400">{mastery}%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Solved</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
            <p className="text-2xl font-bold text-orange-400">14</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Streak</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopicCard title="Arrays & Hashing" domain="DSA" isCompleted={completedTopics.includes("Arrays & Hashing")} icon={<Box />} />
          <TopicCard title="Two Pointers" domain="DSA" isCompleted={completedTopics.includes("Two Pointers")} icon={<Braces />} isLocked={!completedTopics.includes("Arrays & Hashing")} />
          <TopicCard title="Sliding Window" domain="DSA" isCompleted={completedTopics.includes("Sliding Window")} icon={<Braces />} isLocked={!completedTopics.includes("Two Pointers")} />
          <TopicCard title="Stack" domain="DSA" isCompleted={completedTopics.includes("Stack")} icon={<DatabaseIcon />} isLocked={!completedTopics.includes("Sliding Window")} />
          <TopicCard title="Binary Search" domain="DSA" isCompleted={completedTopics.includes("Binary Search")} icon={<BrainCircuit />} isLocked={!completedTopics.includes("Stack")} />
          <TopicCard title="Linked List" domain="DSA" isCompleted={completedTopics.includes("Linked List")} icon={<Network />} isLocked={!completedTopics.includes("Binary Search")} />
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Revision Queue
            </h2>
            <div className="space-y-3">
              <RevisionItem title="3Sum" difficulty="Medium" due="Today" />
              <RevisionItem title="Container With Most Water" difficulty="Medium" due="Tomorrow" />
              <RevisionItem title="Valid Anagram" difficulty="Easy" due="In 2 Days" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
            <h2 className="font-semibold mb-2 flex items-center gap-2 text-orange-400">
              <Zap className="w-5 h-5" />
              Daily Challenge
            </h2>
            <p className="text-sm text-zinc-300 mb-4">Complete 1 Medium problem from Binary Search to maintain your 14-day streak.</p>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-md transition-colors">
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
  );
}

function RevisionItem({ title, difficulty, due }: { title: string, difficulty: string, due: string }) {
  const diffColor = difficulty === "Easy" ? "text-emerald-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{title}</p>
        <span className={`text-[10px] uppercase font-bold tracking-wider ${diffColor}`}>{difficulty}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Clock className="w-3.5 h-3.5" />
        {due}
      </div>
    </div>
  );
}

