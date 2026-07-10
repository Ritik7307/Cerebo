"use client";

import { useState } from "react";
import { BrainCircuit, BookOpen, Trash2, ArrowRight, Building } from "lucide-react";
import { generateAIRoadmap, deleteAIRoadmap } from "@/actions/ai-roadmap";

export function AIRoadmapBoard({ initialRoadmaps }: { initialRoadmaps: any[] }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");

    const result = await generateAIRoadmap(topic.trim());
    if (!result.success) {
      setError(result.error || "Failed to generate AI roadmap.");
      setLoading(false);
      return;
    }

    // Refresh the page to load new data
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    await deleteAIRoadmap(id);
    window.location.reload();
  };

  return (
    <div className="space-y-12">
      {/* Generation Form */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8 animate-in fade-in">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-white">Generate AI Roadmap</h2>
        </div>
        <p className="text-zinc-400 mb-6">Tell us what you want to learn, and our AI will instantly build a structured, step-by-step curriculum with GeeksforGeeks reference materials.</p>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Advanced Dynamic Programming, System Design for Netflix..." 
            disabled={loading}
            className="flex-1 bg-zinc-950/50 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors" 
          />
          <button 
            type="submit" 
            disabled={loading || !topic.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 animate-spin" /> Generating...
              </span>
            ) : (
              <>Generate <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Generated Roadmaps */}
      {roadmaps.length > 0 && (
        <div className="space-y-12">
          <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Your AI Roadmaps</h2>
          
          {roadmaps.map((rm) => (
            <div key={rm.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="bg-zinc-900 p-6 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{rm.parsedContent.title || rm.topic}</h3>
                  <p className="text-sm text-zinc-400">AI Generated Curriculum for {rm.topic}</p>
                </div>
                <button 
                  onClick={() => handleDelete(rm.id)}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded text-zinc-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[39px] md:left-[47px] top-8 bottom-8 w-px bg-zinc-800"></div>

                <div className="space-y-8 relative">
                  {rm.parsedContent.modules.map((module: any, idx: number) => (
                    <div key={idx} className="flex gap-6">
                      <div className="relative shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/50 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-sm font-bold z-10 relative">
                          {idx + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-4">{module.week}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {module.topics.map((t: any, tIdx: number) => (
                            <a 
                              key={tIdx} 
                              href={t.gfgUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="group block bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors"
                            >
                              <h5 className="font-semibold text-zinc-200 mb-2 group-hover:text-emerald-400 transition-colors">{t.name}</h5>
                              <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{t.description}</p>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500/80 group-hover:text-emerald-400 mb-3">
                                <BookOpen className="w-3 h-3" />
                                Read on GFG
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dedicated Company Interview Guide Section */}
                {rm.parsedContent.companyInterviewGuide && rm.parsedContent.companyInterviewGuide.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-zinc-800 relative z-10 bg-zinc-900/40">
                    <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <Building className="w-5 h-5" />
                      </span>
                      Company-Wise Interview Guide
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {rm.parsedContent.companyInterviewGuide.map((cg: any, cgIdx: number) => (
                        <div key={cgIdx} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                          <h5 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3">
                            {cg.company}
                          </h5>
                          
                          <div className="space-y-4">
                            {cg.questions.map((q: any, qIdx: number) => (
                              <div key={qIdx} className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-lg hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                  <span className="font-semibold text-sm text-zinc-300">{q.question}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${q.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500/20 text-red-400' : q.difficulty?.toLowerCase() === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    {q.difficulty}
                                  </span>
                                </div>
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    {q.type}
                                  </div>
                                  
                                  {q.leetcodeUrl && (
                                    <a 
                                      href={q.leetcodeUrl} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="px-3 py-1.5 bg-[#FFA116]/10 hover:bg-[#FFA116]/20 text-[#FFA116] border border-[#FFA116]/20 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                    >
                                      Solve <ArrowRight className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
