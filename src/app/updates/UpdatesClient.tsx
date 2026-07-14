"use client";

import { useState } from "react";
import { JobUpdate } from "@/actions/ai-updates";
import { Megaphone, ExternalLink, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function UpdatesClient({ updates }: { updates: JobUpdate[] }) {
  const [filter, setFilter] = useState<"All" | "Internship" | "Full-time">("All");

  const filteredUpdates = updates.filter(job => {
    if (filter === "All") return true;
    return job.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["All", "Internship", "Full-time"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filter === type 
                ? "bg-blue-600 text-white" 
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {filteredUpdates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((job) => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {job.company}
                  </h3>
                  <p className="text-zinc-400 text-sm font-medium">{job.role}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
                  job.status === "Open" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                )}>
                  {job.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span>Deadline: <span className="font-medium text-white">{job.deadline}</span></span>
                </div>
                <p className="text-sm text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 mt-2">
                  {job.notes}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Posted {job.postedAt}</span>
                <a 
                  href={job.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
          <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No {filter !== "All" ? filter : "active"} updates found</h3>
          <p className="text-zinc-400">Check back later or change your filters.</p>
        </div>
      )}
    </div>
  );
}
