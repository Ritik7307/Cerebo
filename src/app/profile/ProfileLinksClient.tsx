"use client";

import { useState } from "react";
import { Link as LinkIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import { UserLink, saveUserLinks } from "@/actions/profile";

export function ProfileLinksClient({ initialLinks }: { initialLinks: UserLink[] }) {
  const [links, setLinks] = useState<UserLink[]>(initialLinks);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    setLoading(true);
    setError("");

    const updatedLinks = [...links, { name: newName.trim(), url: newUrl.trim() }];
    
    const res = await saveUserLinks(updatedLinks);
    if (res.success) {
      setLinks(updatedLinks);
      setNewName("");
      setNewUrl("");
    } else {
      setError(res.error || "Failed to save link.");
    }
    setLoading(false);
  };

  const handleDelete = async (index: number) => {
    setLoading(true);
    const updatedLinks = links.filter((_, i) => i !== index);
    const res = await saveUserLinks(updatedLinks);
    if (res.success) {
      setLinks(updatedLinks);
    } else {
      setError(res.error || "Failed to delete link.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <LinkIcon className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-white">Social & Professional Links</h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-xs text-zinc-400">Platform Name</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. LinkedIn, LeetCode"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div className="flex-[2] min-w-[200px] space-y-1">
          <label className="text-xs text-zinc-400">URL</label>
          <input 
            type="url" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 h-[38px] disabled:opacity-50 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {links.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {links.map((link, idx) => (
            <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3 group">
              <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 overflow-hidden text-zinc-300 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium">{link.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>
              </a>
              <button 
                onClick={() => handleDelete(idx)}
                disabled={loading}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500">
          <p className="text-sm">No links added yet. Add your LinkedIn, GitHub, or Portfolio above.</p>
        </div>
      )}
    </div>
  );
}
