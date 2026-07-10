import { getPlaylists } from "@/actions/playlists";
import { PlaylistBoard } from "@/components/features/PlaylistBoard";

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Learning Hub</h1>
        <p className="text-zinc-400">Import structured playlists and track your course completion.</p>
      </header>

      <PlaylistBoard initialPlaylists={playlists} />
    </div>
  );
}
