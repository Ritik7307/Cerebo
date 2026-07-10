"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Calendar, Briefcase, Building } from "lucide-react";
import { addInternship, updateInternshipStatus } from "@/actions/internships";
import type { Internship } from "@prisma/client";

const COLUMNS = ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"];

function getColor(status: string) {
  switch (status) {
    case "Interview": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "OA": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "Applied": return "bg-zinc-100/10 text-zinc-100 border-zinc-100/20";
    case "Wishlist": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    case "Offer": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-zinc-800 text-zinc-300 border-zinc-700";
  }
}

export function KanbanBoard({ initialInternships }: { initialInternships: Internship[] }) {
  const [apps, setApps] = useState<Internship[]>(initialInternships);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setApps(apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    await updateInternshipStatus(id, newStatus);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Internships</h1>
          <p className="text-zinc-400">Track your applications, interviews, and offers.</p>
        </div>
        <button 
          onClick={() => setIsAdding("Wishlist")}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = apps.filter((app) => app.status === col);
          return (
            <div key={col} className="w-[320px] flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-300">{col}</h3>
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                    {colApps.length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsAdding(col)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-3 min-h-[500px]">
                
                {isAdding === col && (
                  <form 
                    action={async (formData) => {
                      await addInternship(formData);
                      setIsAdding(null);
                      // In a real app we'd fetch the newly added ID, for now we rely on Next.js revalidation
                    }} 
                    className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 space-y-3"
                  >
                    <input type="hidden" name="status" value={col} />
                    <input name="company" placeholder="Company Name" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm outline-none text-white focus:border-blue-500" />
                    <input name="role" placeholder="Role (e.g. SWE)" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm outline-none text-white focus:border-blue-500" />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors">Save</button>
                      <button type="button" onClick={() => setIsAdding(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1.5 rounded transition-colors">Cancel</button>
                    </div>
                  </form>
                )}

                {colApps.map((app) => (
                  <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-700 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`px-2.5 py-1 rounded-md border text-xs font-medium ${getColor(app.status)}`}>
                        {app.company}
                      </div>
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 text-xs text-white rounded outline-none p-1"
                      >
                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    
                    <h4 className="font-medium text-zinc-200 mb-4">{app.role}</h4>
                    
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <Building className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {!isAdding && colApps.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-600">No applications</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
