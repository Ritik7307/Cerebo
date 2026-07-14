"use client";

import { useState, useEffect, Key } from "react";
import { FolderGit2, GitBranch, Globe, Clock, Plus } from "lucide-react";
import { addProject, updateProjectStatus } from "@/actions/projects";
import type { Project } from "@prisma/client";

export function ProjectBoard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
    await updateProjectStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {isAdding && (
        <form
          action={async (formData) => {
            await addProject(formData);
            setIsAdding(false);
          }}
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4 max-w-md animate-in fade-in"
        >
          <h3 className="text-white font-semibold">Add New Project</h3>
          <input name="title" placeholder="Project Title" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <input name="techStack" placeholder="Tech Stack (comma separated)" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <select name="status" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500">
            <option value="Planning">Planning</option>
            <option value="Building">Building</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onStatusChange }: { project: Project, onStatusChange: (id: string, status: string) => void }) {
  const { id, title, status, techStack, timeInvested } = project;
  const tech = techStack ? techStack.split(",").map((t: string) => t.trim()) : [];

  const statusColor = status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : status === "Building" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-zinc-800 text-zinc-300 border-zinc-700";

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <select
          value={status}
          onChange={(e) => onStatusChange(id, e.target.value)}
          className={`px-2 py-1 rounded-md border text-xs font-medium outline-none appearance-none cursor-pointer ${statusColor}`}
        >
          <option value="Planning" className="bg-zinc-900 text-zinc-300">Planning</option>
          <option value="Building" className="bg-zinc-900 text-blue-400">Building</option>
          <option value="Completed" className="bg-zinc-900 text-emerald-400">Completed</option>
        </select>
        <FolderGit2 className="w-5 h-5 text-zinc-500" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {tech.map((t: Key | null | undefined, index: any) => (
          <span key={t} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
            {String(t)}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-4">
          <GitBranch className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          {timeInvested}h
        </div>
      </div>
    </div>
  );
}
