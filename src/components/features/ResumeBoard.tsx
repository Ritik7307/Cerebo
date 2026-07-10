"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Download, Upload, AlertTriangle, Trash2 } from "lucide-react";
import { addResume, deleteResume } from "@/actions/resume";
import type { ResumeVersion } from "@prisma/client";

export function ResumeBoard({ initialResumes }: { initialResumes: ResumeVersion[] }) {
  const [resumes, setResumes] = useState<ResumeVersion[]>(initialResumes);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setResumes(initialResumes);
  }, [initialResumes]);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload New Version
        </button>
      </div>

      {isAdding && (
        <form 
          action={async (formData) => {
            await addResume(formData);
            setIsAdding(false);
          }} 
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4 max-w-md animate-in fade-in"
        >
          <h3 className="text-white font-semibold">Log Resume Version</h3>
          <input name="title" placeholder="Version Title (e.g. Data Science Focus)" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <input type="number" name="atsScore" placeholder="ATS Score (0-100)" min="0" max="100" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <label className="flex items-center gap-2 text-zinc-300 text-sm">
            <input type="checkbox" name="isMain" className="rounded bg-zinc-950 border-zinc-800 text-blue-500" />
            Set as Primary Resume
          </label>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            No resume versions found.
          </div>
        )}
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    </div>
  );
}

function ResumeCard({ resume }: { resume: ResumeVersion }) {
  const { id, title, atsScore, updatedAt, isMain } = resume;
  const needsImprovement = atsScore < 70;

  return (
    <div className={`bg-zinc-900/50 border ${isMain ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-zinc-800'} rounded-xl p-6 flex flex-col group`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-lg text-blue-400">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          {isMain && <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md">Primary</span>}
          <form action={async () => await deleteResume(id)}>
            <button type="submit" className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded text-zinc-500 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 mb-6">Updated {new Date(updatedAt).toLocaleDateString()}</p>
      
      <div className="mt-auto space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 font-medium">
            <span className="text-zinc-300">ATS Score</span>
            <span className={atsScore >= 80 ? "text-emerald-400" : "text-orange-400"}>{atsScore}/100</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${atsScore >= 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} 
              style={{ width: `${atsScore}%` }} 
            />
          </div>
        </div>

        {needsImprovement && (
          <div className="flex items-start gap-2 text-xs text-orange-400 bg-orange-500/10 p-2 rounded-md">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>Score is below 70. Consider tailoring keywords for target roles.</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/resume/${id}`} className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium py-2 rounded-md transition-colors text-white">
            <FileText className="w-4 h-4" /> Edit / Download
          </Link>
        </div>
      </div>
    </div>
  );
}
