"use client";

import { useState } from "react";
import { Search, Bell, Clock, Menu, X, Settings, GraduationCap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./Sidebar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tighter text-white">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            Cerebo.
          </Link>
        </div>

        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-400 focus-within:border-zinc-700 focus-within:text-zinc-200 transition-colors">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search anything... (Cmd+K)" 
            className="bg-transparent border-none outline-none flex-1 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-md border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-64 max-w-[80%] h-full bg-zinc-950 border-r border-zinc-800 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white" onClick={() => setIsMobileMenuOpen(false)}>
                <GraduationCap className="w-6 h-6 text-blue-500" />
                Cerebo.
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Main Menu</p>
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-zinc-800/50 text-white" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800">
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
