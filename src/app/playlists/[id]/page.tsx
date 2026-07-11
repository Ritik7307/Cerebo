"use client";

import { useState, use, useEffect, useCallback } from "react";
import { getPlaylistById, togglePlaylistItem } from "@/actions/playlists";
import { ChevronLeft, PlayCircle, CheckCircle2, Circle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PlaylistDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Timer State (Stopwatch)
  const [timeElapsed, setTimeElapsed] = useState(0); // Starts at 0 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const fetchPlaylist = useCallback(async () => {
    const data = await getPlaylistById(id);
    if (!data) notFound();
    setPlaylist(data);
    setLoading(false);
    
    // Auto-select first unwatched video if none active
    if (data && data.items.length > 0) {
      const firstUnwatched = data.items.find((i: any) => !i.isCompleted);
      setActiveVideo(firstUnwatched ? firstUnwatched.videoId : data.items[0].videoId);
    }
  }, [id]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse">Loading playlist...</div>;
  }

  if (!playlist) return null;

  const totalVideos = playlist.items.length;
  const completedVideos = playlist.items.filter((i: any) => i.isCompleted).length;
  const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    // Optimistic UI update
    setPlaylist((prev: any) => ({
      ...prev,
      items: prev.items.map((item: any) => 
        item.id === itemId ? { ...item, isCompleted: !currentStatus } : item
      )
    }));
    await togglePlaylistItem(itemId, !currentStatus);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden text-white -m-8">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/playlists" className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">{playlist.title}</h1>
            <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-400">{completedVideos} / {totalVideos}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Pomodoro Timer */}
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors px-3 py-1.5 rounded-lg border border-zinc-700 shadow-sm"
            title="Toggle Focus Timer"
          >
            <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
            <span className="font-mono font-bold text-white tracking-wider text-sm">{formatTime(timeElapsed)}</span>
          </button>
          
          <div className="w-48 bg-zinc-900 rounded-full h-2 border border-zinc-800 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-red-500'}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Video Player */}
        <div className="flex-1 bg-black flex flex-col items-center justify-start pt-12 relative p-6">
          {activeVideo ? (
            <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="text-zinc-600 flex flex-col items-center gap-4">
              <PlayCircle className="w-16 h-16 opacity-50" />
              <p>Select a video to start watching</p>
            </div>
          )}
        </div>

        {/* Right Side: Playlist Tracker */}
        <div className="w-96 bg-zinc-950 border-l border-zinc-800 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 sticky top-0 z-10 backdrop-blur-md">
            <h2 className="font-bold tracking-tight">Course Content</h2>
          </div>
          
          <div className="flex-1 p-2 space-y-1">
            {playlist.items.map((item: any, index: number) => {
              const isActive = activeVideo === item.videoId;
              
              return (
                <div 
                  key={item.id} 
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors group ${
                    isActive ? 'bg-zinc-800/80 ring-1 ring-zinc-700' : 'hover:bg-zinc-900'
                  }`}
                  onClick={() => setActiveVideo(item.videoId)}
                >
                  {/* Checkbox */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.isCompleted); }}
                    aria-label={item.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    className={`mt-0.5 shrink-0 transition-colors ${item.isCompleted ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {item.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  
                  {/* Video Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium line-clamp-2 leading-snug mb-1 ${
                      isActive ? 'text-white' : (item.isCompleted ? 'text-zinc-400' : 'text-zinc-200 group-hover:text-white')
                    }`}>
                      {index + 1}. {item.title}
                    </h4>
                    {item.duration && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.duration}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
