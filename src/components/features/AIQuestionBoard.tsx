"use client";

import { useState } from "react";
import { Building2, Trash2, ArrowRight, BarChart, Clock, ExternalLink } from "lucide-react";
import { generateAICompanyGuide, deleteAICompanyGuide } from "@/actions/ai-questions";

export function AIQuestionBoard({ initialGuides }: { initialGuides: any[] }) {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guides, setGuides] = useState(initialGuides);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    setLoading(true);
    setError("");

    const result = await generateAICompanyGuide(company.trim());
    if (!result.success) {
      setError(result.error || "Failed to generate company guide.");
      setLoading(false);
      return;
    }

    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    await deleteAICompanyGuide(id);
    window.location.reload();
  };

  return (
    <div className="space-y-12">
      {/* Generation Form */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8 animate-in fade-in">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-white">Generate Interview Guide</h2>
        </div>
        <p className="text-zinc-400 mb-6">Type any company (e.g., "Google", "Amazon") or topic (e.g., "System Design", "Operating Systems") and our AI will build a master list of real interview questions and references for you.</p>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google, Meta, or System Design, Computer Networks..."
            disabled={loading}
            className="flex-1 bg-zinc-950/50 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors" 
          />
          <button 
            type="submit" 
            disabled={loading || !company.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2">
                <Building2 className="w-5 h-5 animate-spin" /> Mining Data...
              </span>
            ) : (
              <>Generate <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Generated Guides */}
      {guides.length > 0 && (
        <div className="space-y-12">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              <div className="bg-zinc-900 p-6 md:p-8 border-b border-zinc-800 flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-blue-500" />
                    {guide.parsedContent.company} Interview Guide
                  </h3>
                  <p className="text-zinc-400 max-w-3xl leading-relaxed">{guide.parsedContent.overview}</p>
                </div>
                <button 
                  onClick={() => handleDelete(guide.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors shrink-0"
                  title="Delete Guide"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-10">
                {guide.parsedContent.categories.map((cat: any, catIdx: number) => (
                  <div key={catIdx} className="space-y-4">
                    <h4 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">{cat.name}</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {cat.questions.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="bg-zinc-950/50 border border-zinc-800/80 p-5 rounded-xl hover:border-blue-500/50 transition-colors group">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h5 className="font-semibold text-zinc-200 text-lg group-hover:text-blue-400 transition-colors">{q.title}</h5>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider ${
                              q.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                              q.difficulty?.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <BarChart className="w-4 h-4 text-blue-500" />
                                Frequency: <span className="text-zinc-200">{q.frequency}</span>
                              </div>
                              
                              {q.topics && q.topics.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {q.topics.map((t: string, i: number) => (
                                    <span key={i} className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-zinc-800">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {q.referenceUrl && (
                              <a 
                                href={q.referenceUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="mt-3 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Practice/Read <ExternalLink className="w-3 h-3" />
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
          ))}
        </div>
      )}
    </div>
  );
}
