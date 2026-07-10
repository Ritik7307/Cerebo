export const dynamic = "force-dynamic";
import { getEvents } from "@/actions/calendar";
import { CalendarBoard } from "@/components/features/CalendarBoard";

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Calendar</h1>
        <p className="text-zinc-400">Interviews, contests, and deadlines.</p>
      </header>

      <CalendarBoard initialEvents={events} />
    </div>
  );
}

