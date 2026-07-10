import { BarChart3, TrendingUp, Calendar, Zap } from "lucide-react";
import { LearningHoursChart } from "@/components/features/LearningHoursChart";

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-zinc-400">Deep dive into your performance and consistency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-[400px] flex flex-col">
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Learning Hours (This Month)
            </h2>
            <div className="flex-1 mt-4">
              <LearningHoursChart />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Activity Heatmap
            </h2>
            <div className="grid grid-cols-7 gap-1.5">
               {/* Mock Heatmap Grid */}
               {Array.from({ length: 49 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="w-full aspect-square rounded-sm bg-zinc-800"
                 />
               ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Skill Distribution
            </h2>
            <div className="space-y-4">
              <SkillBar name="Frontend" percentage={80} color="bg-blue-500" />
              <SkillBar name="Backend" percentage={65} color="bg-emerald-500" />
              <SkillBar name="Algorithms" percentage={45} color="bg-purple-500" />
              <SkillBar name="System Design" percentage={20} color="bg-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillBar({ name, percentage, color }: { name: string, percentage: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-300 font-medium">{name}</span>
        <span className="text-zinc-500">{percentage}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
