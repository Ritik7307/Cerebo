"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Clock, Video, MapPin } from "lucide-react";
import { addEvent } from "@/actions/calendar";
import type { Event } from "@prisma/client";

export function CalendarBoard({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {isAdding && (
        <form 
          action={async (formData) => {
            await addEvent(formData);
            setIsAdding(false);
          }} 
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4 max-w-md animate-in fade-in"
        >
          <h3 className="text-white font-semibold">New Event</h3>
          <input name="title" placeholder="Event Title (e.g. Google Interview)" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <input type="datetime-local" name="date" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500" />
          <select name="type" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm outline-none text-white focus:border-blue-500">
            <option value="Interview">Interview</option>
            <option value="Contest">Contest</option>
            <option value="Deadline">Deadline</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            No upcoming events found.
          </div>
        )}
        {events.map((event) => (
          <div key={event.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col h-full hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${
                event.type === 'Interview' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                event.type === 'Contest' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                {event.type}
              </span>
              <CalendarIcon className="w-5 h-5 text-zinc-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">{event.title}</h3>
            
            <div className="mt-auto space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(event.date).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
