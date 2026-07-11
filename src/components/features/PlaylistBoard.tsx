"use client";

import { useState } from "react";
import { PlaySquare, Plus, Trash2, ListVideo, Folder, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { addPlaylist, deletePlaylist } from "@/actions/playlists";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export function PlaylistBoard({ initialPlaylists }: { initialPlaylists: any[] }) {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subtopicOrder, setSubtopicOrder] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('cerebo_subtopic_order');
    if (saved) {
      try { setSubtopicOrder(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const moveSubtopic = (domain: string, subTopic: string, direction: 'left' | 'right') => {
    setSubtopicOrder(prev => {
      const currentDomainPlaylists = playlists.filter(p => (p.category || "Uncategorized/General").startsWith(domain));
      const allSubtopics = Array.from(new Set(currentDomainPlaylists.map(p => {
        const cat = p.category || "Uncategorized/General";
        return cat.includes('/') ? cat.split('/').slice(1).join('/').trim() : 
               cat.includes('-') ? cat.split('-').slice(1).join('-').trim() : "General";
      })));
      
      const currentOrder = prev[domain] || allSubtopics;
      const order = [...new Set([...currentOrder, ...allSubtopics])].filter(st => allSubtopics.includes(st));
      
      const idx = order.indexOf(subTopic);
      if (idx === -1) return prev;
      
      if (direction === 'left' && idx > 0) {
        [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      } else if (direction === 'right' && idx < order.length - 1) {
        [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      }
      
      const newOrder = { ...prev, [domain]: order };
      localStorage.setItem('cerebo_subtopic_order', JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");

    const result = await addPlaylist(url, category.trim());
    if (!result.success) {
      setError(result.error || "Failed to import playlist.");
      setLoading(false);
      return;
    }

    setUrl("");
    setCategory("");
    setIsAdding(false);
    setLoading(false);
  };

  // Group by Domain -> Subtopic
  const groupedPlaylists = playlists.reduce((acc, playlist) => {
    const catString = playlist.category || "Uncategorized/General";
    
    let domain = catString;
    let subTopic = "General";
    
    // Parse formats like "DSA/Linked List" or "DSA - Linked List"
    if (catString.includes("/")) {
      const parts = catString.split("/");
      domain = parts[0].trim();
      subTopic = parts.slice(1).join("/").trim();
    } else if (catString.includes("-")) {
      const parts = catString.split("-");
      domain = parts[0].trim();
      subTopic = parts.slice(1).join("-").trim();
    }

    if (!acc[domain]) acc[domain] = {};
    if (!acc[domain][subTopic]) acc[domain][subTopic] = [];
    
    acc[domain][subTopic].push(playlist);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Your Courses</h2>
          <p className="text-sm text-zinc-400">Import courses, YouTube videos, and playlists to track your progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Import Course
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4 max-w-xl animate-in fade-in">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-blue-500" />
            Import Course or Video
          </h3>
          <p className="text-xs text-zinc-400">Paste a YouTube URL (video/playlist) or an external course link (e.g., Udemy).</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Course / Video URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/... or https://udemy.com/..." 
                required 
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-red-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Section & Topic (Format: Main / Subtopic)</label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. DSA / Linked List" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-red-500 transition-colors" 
              />
              <p className="text-[10px] text-zinc-500 mt-1">Use a slash (/) to create a sub-topic folder under a main domain.</p>
            </div>
          </div>
          
          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Importing..." : "Import"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)} 
              disabled={loading}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {playlists.length === 0 && !isAdding && (
        <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 flex flex-col items-center gap-3">
          <ListVideo className="w-12 h-12 text-zinc-700" />
          <p>No playlists imported yet.</p>
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(groupedPlaylists).map(([domain, subTopics]: [string, any]) => (
          <div key={domain} className="space-y-6">
            
            {/* Domain Header */}
            <div className="border-b border-zinc-800 pb-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {domain}
              </h2>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-8 snap-x hide-scrollbar items-start">
              {(() => {
                const allSubtopics = Object.keys(subTopics as Record<string, any[]>);
                const order = subtopicOrder[domain] || [];
                const sortedSubtopics = [...new Set([...order, ...allSubtopics])].filter(st => allSubtopics.includes(st));

                return sortedSubtopics.map((subTopic, index) => {
                  const items = subTopics[subTopic];
                  return (
                    <div key={subTopic} className="min-w-[320px] w-[320px] shrink-0 snap-start space-y-4">
                      
                      {/* SubTopic Header */}
                      {subTopic !== "General" && (
                        <h3 className="text-lg font-semibold text-zinc-300 flex items-center gap-2 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50 group">
                          <Folder className="w-5 h-5 text-blue-400" />
                          <span className="flex-1 truncate">{subTopic}</span>
                          <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">{items.length}</span>
                          
                          {/* Reorder Buttons */}
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => moveSubtopic(domain, subTopic, 'left')}
                              disabled={index === 0}
                              className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 transition-colors"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                            <button 
                              onClick={() => moveSubtopic(domain, subTopic, 'right')}
                              disabled={index === sortedSubtopics.length - 1}
                              className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 transition-colors"
                              title="Move Right"
                            >
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                          </div>
                        </h3>
                      )}

                  {/* Vertical Stack for Playlists within Subtopic */}
                  <div className="space-y-4">
                    {items.map((playlist: any) => {
                      const totalVideos = playlist.items.length;
                      const completedVideos = playlist.items.filter((i: any) => i.isCompleted).length;
                      const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

                      return (
                        <Link 
                          href={`/playlists/${playlist.id}`} 
                          key={playlist.id}
                          className="group block w-full bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all"
                        >
                          <div className="h-40 w-full bg-zinc-800 relative">
                            {playlist.thumbnail ? (
                              <Image src={playlist.thumbnail} alt={playlist.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <PlaySquare className="w-10 h-10" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                              {totalVideos} Videos
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h4 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-red-400 transition-colors" title={playlist.title}>{playlist.title}</h4>
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await deletePlaylist(playlist.id);
                                }}
                                aria-label="Delete playlist"
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded text-zinc-500 transition-all shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-zinc-500 mb-6 line-clamp-1">{playlist.channel || "YouTube"}</p>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-2 font-medium">
                                <span className="text-zinc-300">Progress</span>
                                <span className={progress === 100 ? "text-emerald-400" : "text-zinc-400"}>{progress}%</span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-800 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                  style={{ width: `${progress}%` }} 
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                </div>
              );
            })})()}
            </div>

          </div>
        ))}
      </div>

      {/* Hide Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
