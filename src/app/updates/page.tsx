import { fetchLiveJobUpdates } from "@/actions/ai-updates";
import { getInternships } from "@/actions/internships";
import { Megaphone } from "lucide-react";
import { UpdatesClient } from "./UpdatesClient";

// Make the page revalidate occasionally or be dynamic
export const revalidate = 0; // Or 3600 if we want to cache the page

export default async function UpdatesPage() {
  const [result, existingInternships] = await Promise.all([
    fetchLiveJobUpdates(),
    getInternships()
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-500" />
            Job & Internship Updates
          </h1>
          <p className="text-zinc-400 mt-2">Discover the latest tech opportunities tailored for you.</p>
        </div>
      </header>

      {result.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
          Failed to fetch updates: {result.error}
        </div>
      )}

      {result.updates && result.updates.length > 0 ? (
        <UpdatesClient updates={result.updates} existingInternships={existingInternships} />
      ) : (
        !result.error && (
          <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
            <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No active updates right now</h3>
            <p className="text-zinc-400">Check back later for new opportunities.</p>
          </div>
        )
      )}
    </div>
  );
}
