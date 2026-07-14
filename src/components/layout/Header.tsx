"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Clock, Menu, X, Settings, GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./Sidebar";
import { fetchLiveJobUpdates, JobUpdate } from "@/actions/ai-updates";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<JobUpdate[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = async () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && notifications.length === 0) {
      setIsLoadingNotifs(true);
      const res = await fetchLiveJobUpdates();
      if (res.success && res.updates) {
        setNotifications(res.updates);
      }
      setIsLoadingNotifs(false);
    }
  };

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
          
          <div className="relative" ref={notifRef}>
            <button 
              onClick={handleToggleNotifications}
              className={cn(
                "relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full",
                isNotificationsOpen ? "bg-zinc-800 text-white" : ""
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">New Updates</span>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoadingNotifs ? (
                    <div className="p-8 text-center text-zinc-500 flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm">Fetching latest opportunities...</p>
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="divide-y divide-zinc-800/50">
                      {notifications.slice(0, 4).map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{notif.company}</h4>
                            <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{notif.postedAt}</span>
                          </div>
                          <p className="text-xs text-zinc-300 mb-2">{notif.role}</p>
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                              notif.status === "Open" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                            )}>
                              {notif.status}
                            </span>
                            <span className="text-[10px] text-zinc-500">Deadline: {notif.deadline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                      No new updates found.
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/updates" 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="block p-3 text-center text-sm text-blue-400 hover:text-blue-300 hover:bg-zinc-800/50 transition-colors border-t border-zinc-800 font-medium bg-zinc-950/50"
                >
                  View All Opportunities
                </Link>
              </div>
            )}
          </div>

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
