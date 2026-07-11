import { 
  Flame, 
  Target, 
  TrendingUp, 
  Zap,
  Calendar as CalendarIcon
} from "lucide-react";
import { getAuthenticatedUser } from "@/actions/user";
import { getAnalyticsData } from "@/actions/analytics";
import { prisma } from "@/lib/prisma";
import { LearningHoursChart } from "@/components/features/LearningHoursChart";

export default async function Dashboard() {
  const user = await getAuthenticatedUser();
  
  // Fetch real data
  const events = await prisma.event.findMany({
    where: { userId: user.id },
    orderBy: { date: 'asc' },
    take: 3
  });
  
  const activeInternships = await prisma.internship.count({
    where: { userId: user.id }
  });
  
  const focusSessions = await prisma.focusSession.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: 'desc' },
    take: 3
  });

  const analyticsData = await getAnalyticsData();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
          Welcome back, {user.name?.split(' ')[0] || 'User'}.
        </h1>
        <p className="text-zinc-400">
          Your Career Health Score is <span className="text-emerald-400 font-semibold">{user.careerHealth}/100</span>. You're doing great!
        </p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Current Streak" 
          value={`${user.currentStreak} Days`} 
          trend="Keep it up!"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          title="Total XP" 
          value={`${user.xp} XP`} 
          trend={`Level ${user.level}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Learning Hours" 
          value={`${analyticsData?.totalStudyHours || '0'}h`} 
          trend="This week"
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
        />
        <StatCard 
          title="Applications" 
          value={`${activeInternships} Active`} 
          trend="Tracking progress"
          icon={<Target className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Focus Sessions</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">View Plan</button>
            </div>
            
            <div className="space-y-4">
              {focusSessions.length > 0 ? (
                focusSessions.map(session => (
                  <FocusItem key={session.id} title={session.task || "Focused Session"} category="Focus" time={`${session.duration}m`} />
                ))
              ) : (
                <p className="text-sm text-zinc-500">No focus sessions yet. Time to get to work!</p>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm min-h-[300px]">
             <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
             <div className="w-full mt-4">
                <LearningHoursChart chartData={analyticsData?.chartData || []} />
             </div>
          </div>

        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          
          {/* AI Coach Card */}
          <div className="relative group overflow-hidden bg-zinc-900/40 border border-purple-500/20 rounded-xl p-6 transition-all duration-500 hover:border-purple-500/40 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <h2 className="text-sm font-medium tracking-wide text-purple-400 uppercase">AI Insight</h2>
              </div>
              <span className="text-xs text-zinc-500">Just now</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                "You haven't practiced Graphs in a while. I recommend tackling 2 easy Graph problems today to maintain your algorithmic sharpness."
              </p>
            </div>
            
            <button className="relative z-10 mt-6 w-full group/btn overflow-hidden rounded-lg bg-purple-500/10 border border-purple-500/20 px-4 py-2.5 transition-all hover:bg-purple-500/20 hover:border-purple-500/50">
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium text-purple-300 transition-colors group-hover/btn:text-purple-200">
                Generate Custom Problem Set
              </span>
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-zinc-400" />
              <h2 className="font-semibold">Upcoming</h2>
            </div>
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map(event => (
                  <EventItem key={event.id} title={event.title} time={new Date(event.date).toLocaleDateString()} />
                ))
              ) : (
                <p className="text-sm text-zinc-500">No upcoming events.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <p className="text-xs text-zinc-500">{trend}</p>
    </div>
  );
}

function FocusItem({ title, category, time }: { title: string, category: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-zinc-600 group-hover:border-blue-500 transition-colors cursor-pointer" />
        <div>
          <p className="text-sm font-medium text-zinc-200">{title}</p>
          <p className="text-xs text-zinc-500">{category}</p>
        </div>
      </div>
      <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">{time}</span>
    </div>
  );
}

function EventItem({ title, time }: { title: string, time: string }) {
  return (
    <div className="flex flex-col gap-1 pl-3 border-l-2 border-zinc-700">
      <p className="text-sm font-medium text-zinc-200">{title}</p>
      <p className="text-xs text-zinc-500">{time}</p>
    </div>
  );
}

function BrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  );
}
