"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map, 
  Briefcase, 
  FolderGit2, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings,
  BrainCircuit,
  GraduationCap,
  PlaySquare,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Learning Hub", href: "/playlists", icon: PlaySquare },
  { name: "Roadmaps", href: "/roadmaps", icon: Map },
  { name: "Interview Questions", href: "/questions", icon: Building2 },
  { name: "Internships", href: "/internships", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          Cerebo.
        </Link>
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
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
