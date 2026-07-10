export const dynamic = "force-dynamic";
import { Target, BrainCircuit, Bot, Network } from "lucide-react";
import { getDomainProgress } from "@/actions/roadmaps";
import { TopicCard } from "@/components/features/TopicCard";

export default async function AIPage() {
  const progress = await getDomainProgress("AI");
  const completedTopics = progress.filter(p => p.status === "completed").map(p => p.topic);
  const mastery = Math.round((completedTopics.length / 4) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">AI / Machine Learning</h1>
          <p className="text-zinc-400">From linear regression to Transformers.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
            <p className="text-2xl font-bold text-orange-400">{mastery}%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Mastery</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TopicCard title="Python Data Stack" domain="AI" isCompleted={completedTopics.includes("Python Data Stack")} icon={<DatabaseIcon />} />
          <TopicCard title="Classical ML (Scikit-Learn)" domain="AI" isCompleted={completedTopics.includes("Classical ML (Scikit-Learn)")} icon={<BrainCircuit />} isLocked={!completedTopics.includes("Python Data Stack")} />
          <TopicCard title="Deep Learning (PyTorch)" domain="AI" isCompleted={completedTopics.includes("Deep Learning (PyTorch)")} icon={<Network />} isLocked={!completedTopics.includes("Classical ML (Scikit-Learn)")} />
          <TopicCard title="Transformers & LLMs" domain="AI" isCompleted={completedTopics.includes("Transformers & LLMs")} icon={<Bot />} isLocked={!completedTopics.includes("Deep Learning (PyTorch)")} />
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Focus Module
            </h2>
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <h3 className="font-medium text-white mb-2">Linear Regression</h3>
              <p className="text-sm text-zinc-400">Build your first predictive model using Scikit-Learn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon() {
  return <BrainCircuit />;
}

