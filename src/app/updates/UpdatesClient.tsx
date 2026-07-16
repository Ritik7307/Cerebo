"use client";

import { useState, useMemo } from "react";
import { JobUpdate } from "@/actions/ai-updates";
import { Megaphone, ExternalLink, Briefcase, Calendar, Search, FilterX, BookmarkPlus, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { addInternship } from "@/actions/internships";
import type { Internship } from "@prisma/client";

export function UpdatesClient({ updates, existingInternships = [] }: { updates: JobUpdate[], existingInternships?: Internship[] }) {
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"All" | JobUpdate["type"]>("All");
  const [timeFilter, setTimeFilter] = useState<"Any time" | "Today" | "Yesterday" | "Past Week">("Any time");

  const initialSavingState = useMemo(() => {
    const state: Record<string, "saving" | string> = {};
    updates.forEach(job => {
      const match = existingInternships.find(i => 
        i.company.toLowerCase() === job.company.toLowerCase() && 
        i.role.toLowerCase() === job.role.toLowerCase()
      );
      if (match) {
        state[job.id] = match.status;
      }
    });
    return state;
  }, [updates, existingInternships]);

  const [savingState, setSavingState] = useState<Record<string, "saving" | string>>(initialSavingState);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleSaveToKanban = async (job: JobUpdate, status: "Wishlist" | "Applied") => {
    setSavingState(prev => ({ ...prev, [job.id]: "saving" }));
    setOpenDropdownId(null);
    try {
      const fd = new FormData();
      fd.append("company", job.company);
      fd.append("role", job.role);
      fd.append("status", status);
      await addInternship(fd);
      setSavingState(prev => ({ ...prev, [job.id]: status }));
    } catch (e) {
      setSavingState(prev => {
        const next = { ...prev };
        delete next[job.id];
        return next;
      });
      alert("Failed to save to tracker. Please try again.");
    }
  };

  const filteredUpdates = useMemo(() => {
    return updates.filter(job => {
      // 1. Search Filter
      if (search) {
        const query = search.toLowerCase();
        const matchTitle = job.role.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany) return false;
      }
      
      // 2. Location Search
      if (locationSearch) {
        const query = locationSearch.toLowerCase();
        if (!job.location.toLowerCase().includes(query)) return false;
      }

      // 3. Remote Only
      if (isRemoteOnly && !job.isRemote) return false;

      // 4. Type Filter
      if (typeFilter !== "All" && job.type !== typeFilter) return false;

      // 5. Time Filter
      if (timeFilter !== "Any time") {
        if (timeFilter === "Today" && job.postedAt !== "Today") return false;
        if (timeFilter === "Yesterday" && job.postedAt !== "Today" && job.postedAt !== "Yesterday") return false;
        if (timeFilter === "Past Week") {
          const daysAgoStr = job.postedAt.split(" ")[0];
          const daysAgo = parseInt(daysAgoStr);
          if (!isNaN(daysAgo) && daysAgo > 7) return false;
        }
      }

      return true;
    });
  }, [updates, search, locationSearch, isRemoteOnly, typeFilter, timeFilter]);

  const allTypes = ["All", "Full-time", "Internship", "Contract", "Part-time", "Freelance", "Hackathon", "Other"];

  const hasActiveFilters = search !== "" || locationSearch !== "" || isRemoteOnly || typeFilter !== "All" || timeFilter !== "Any time";

  const clearFilters = () => {
    setSearch("");
    setLocationSearch("");
    setIsRemoteOnly(false);
    setTypeFilter("All");
    setTimeFilter("Any time");
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search roles or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Location Filter */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Country or location (e.g. US, India)"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Remote Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5">
            <input 
              type="checkbox" 
              checked={isRemoteOnly}
              onChange={(e) => setIsRemoteOnly(e.target.checked)}
              className="rounded border-zinc-700 text-blue-500 focus:ring-blue-500/20 bg-zinc-900"
            />
            <span className="text-sm text-zinc-300">Remote Only</span>
          </label>

          {/* Type Filter */}
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            {allTypes.map(type => (
              <option key={type} value={type}>{type === "All" ? "All Job Types" : type}</option>
            ))}
          </select>

          {/* Time Filter */}
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="Any time">Any time</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Since Yesterday</option>
            <option value="Past Week">Past Week</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors whitespace-nowrap"
            >
              <FilterX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-zinc-400">
          Showing <span className="font-semibold text-white">{filteredUpdates.length}</span> opportunities
        </p>
      </div>

      {filteredUpdates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((job) => {
            const isSaved = savingState[job.id] && savingState[job.id] !== "saving";
            return (
            <div key={job.id} className={cn("bg-zinc-900 border rounded-xl p-6 transition-colors flex flex-col group", isSaved ? "border-emerald-500/30" : "border-zinc-800 hover:border-zinc-700")}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={job.company}>
                    {job.company}
                  </h3>
                  <p className="text-zinc-400 text-sm font-medium line-clamp-1" title={job.role}>{job.role}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 ml-2",
                  job.status === "Open" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                )}>
                  {job.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>Deadline: <span className="font-medium text-white">{job.deadline}</span></span>
                </div>
                <p className="text-sm text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 mt-2 line-clamp-2" title={job.notes}>
                  {job.notes}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Posted {job.postedAt}</span>
                <div className="flex items-center gap-2">
                  
                  {/* Save to Tracker Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === job.id ? null : job.id)}
                      disabled={Boolean(isSaved) || savingState[job.id] === "saving"}
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors border",
                        isSaved
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default"
                          : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                      )}
                    >
                      {savingState[job.id] === "saving" ? (
                        <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      ) : isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          In {savingState[job.id]}
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          Save
                          <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                        </>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdownId === job.id && !savingState[job.id] && (
                      <div className="absolute right-0 bottom-full mb-1 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2">
                        <button
                          onClick={() => handleSaveToKanban(job, "Wishlist")}
                          className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        >
                          To Wishlist
                        </button>
                        <button
                          onClick={() => handleSaveToKanban(job, "Applied")}
                          className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        >
                          To Applied
                        </button>
                      </div>
                    )}
                  </div>

                  <a 
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Apply <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
          <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No matching updates found</h3>
          <p className="text-zinc-400">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
