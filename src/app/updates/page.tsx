import { fetchLiveJobUpdates } from "@/actions/ai-updates";
import { Megaphone, ExternalLink, RefreshCw, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Make the page revalidate occasionally or be dynamic
export const revalidate = 0; // Or 3600 if we want to cache the page

export default async function UpdatesPage() {
  const result = await fetchLiveJobUpdates();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-500" />
            Job & Internship Updates
          </h1>
          <p className="text-zinc-400 mt-2">Discover the latest tech opportunities tailored for you.</p>
        </div>
      </header>

      {result.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
          Failed to fetch updates: {result.error}
        </div>
      )}

      {result.updates && result.updates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.updates.map((job) => (
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
        !result.error && (
          <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
            <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No active updates right now</h3>
            <p className="text-zinc-400">Check back later for new opportunities.</p>
          </div>
        )
      )}
    </div>
  );
}
