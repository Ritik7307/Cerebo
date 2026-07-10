export const dynamic = "force-dynamic";
import { Target, Database, Server, Network } from "lucide-react";
import { getDomainProgress } from "@/actions/roadmaps";
import { TopicCard } from "@/components/features/TopicCard";

export default async function SystemDesignPage() {
  const progress = await getDomainProgress("System Design");
  const completedTopics = progress.filter(p => p.status === "completed").map(p => p.topic);
  const mastery = Math.round((completedTopics.length / 4) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">System Design</h1>
          <p className="text-zinc-400">Master scalability, databases, and distributed systems.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
            <p className="text-2xl font-bold text-blue-400">{mastery}%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Mastery</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TopicCard title="Networking Basics" domain="System Design" isCompleted={completedTopics.includes("Networking Basics")} icon={<Network />} />
          <TopicCard title="Load Balancing & Caching" domain="System Design" isCompleted={completedTopics.includes("Load Balancing & Caching")} icon={<Server />} isLocked={!completedTopics.includes("Networking Basics")} />
          <TopicCard title="Database Sharding" domain="System Design" isCompleted={completedTopics.includes("Database Sharding")} icon={<Database />} isLocked={!completedTopics.includes("Load Balancing & Caching")} />
          <TopicCard title="Message Queues (Kafka, RabbitMQ)" domain="System Design" isCompleted={completedTopics.includes("Message Queues (Kafka, RabbitMQ)")} icon={<Server />} isLocked={!completedTopics.includes("Database Sharding")} />
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Next Up
            </h2>
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-white mb-2">Design a URL Shortener</h3>
              <p className="text-sm text-zinc-400">Learn how to generate unique IDs at scale and handle heavy read traffic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

