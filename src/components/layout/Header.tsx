"use client";

import { Search, Bell, Clock } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-400 focus-within:border-zinc-700 focus-within:text-zinc-200 transition-colors">
        <Search className="w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search anything... (Cmd+K)" 
          className="bg-transparent border-none outline-none flex-1 placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-md border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium">25:00</span>
        </div>
        
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950"></span>
        </button>

        <div className="pl-2 border-l border-zinc-800">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
