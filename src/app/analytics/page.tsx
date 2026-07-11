import { BarChart3, TrendingUp, Calendar, Zap, BookOpen, Clock as ClockIcon } from "lucide-react";
import { LearningHoursChart } from "@/components/features/LearningHoursChart";
import { getAnalyticsData } from "@/actions/analytics";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  
  if (!data) {
    return <div className="p-8 text-center text-zinc-500">Please sign in to view analytics.</div>;
  }
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-zinc-400">Deep dive into your performance and consistency.</p>
      </header>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <ClockIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Study Time</p>
            <h3 className="text-2xl font-bold text-white">{data.totalStudyHours} <span className="text-lg font-medium text-zinc-500">hrs</span></h3>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Topics Covered</p>
            <h3 className="text-2xl font-bold text-white">{data.totalTopicsCovered}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-[400px] flex flex-col">
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Learning Hours (This Month)
            </h2>
            <div className="flex-1 mt-4">
              <LearningHoursChart chartData={data.chartData} />
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
              {data.skillDistribution.map((skill: any, idx: number) => (
                <SkillBar key={idx} name={skill.name} percentage={skill.percentage} color={skill.color} />
              ))}
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
