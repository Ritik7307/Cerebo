"use client";

import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { markTopicCompleted } from "@/actions/roadmaps";
import { useState, useTransition } from "react";

export function TopicCard({ title, icon, domain, isCompleted, isLocked, questions }: any) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleComplete = () => {
    if (optimisticCompleted || isLocked) return;
    setOptimisticCompleted(true);
    startTransition(async () => {
      await markTopicCompleted(domain, title);
    });
  };

  const status = optimisticCompleted ? "completed" : (isLocked ? "locked" : "in-progress");
  const color = domain === "DSA" ? "emerald" : domain === "System Design" ? "blue" : domain === "Full Stack" ? "purple" : "orange";
  
  // Dynamic color classes based on domain
  const getThemeColors = () => {
    switch(domain) {
      case "DSA": return { bg: "bg-emerald-500", text: "text-emerald-400" };
      case "System Design": return { bg: "bg-blue-500", text: "text-blue-400" };
      case "Full Stack": return { bg: "bg-purple-500", text: "text-purple-400" };
      case "AI": return { bg: "bg-orange-500", text: "text-orange-400" };
      default: return { bg: "bg-blue-500", text: "text-blue-400" };
    }
  };

  const theme = getThemeColors();

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 ${status === 'locked' ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {status === "completed" ? (
          <span className={`flex items-center gap-1.5 text-sm font-medium ${theme.text} bg-zinc-800/50 px-3 py-1 rounded-full`}>
            <CheckCircle2 className="w-4 h-4" /> Done
          </span>
        ) : (
          <button 
            disabled={isLocked || isPending}
            onClick={handleComplete}
            className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : (isLocked ? "Locked" : "Mark Complete")}
          </button>
        )}
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2 mt-4">
        <div className={`h-2 rounded-full ${status === 'completed' ? theme.bg : 'bg-zinc-600'}`} style={{ width: status === 'completed' ? '100%' : '10%' }} />
      </div>

      {questions && questions.length > 0 && !isLocked && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-full justify-between"
          >
            <span className="font-medium">{questions.length} Practice Questions</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-2">
              {questions.map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-sm font-medium text-zinc-200">{q.name}</span>
                  </div>
                  <a 
                    href={q.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#FFA116] hover:text-[#FFA116]/80 text-xs font-bold uppercase flex items-center gap-1"
                  >
                    Solve <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
