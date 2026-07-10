export const dynamic = "force-dynamic";
import { getProjects } from "@/actions/projects";
import { ProjectBoard } from "@/components/features/ProjectBoard";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Projects Hub</h1>
        <p className="text-zinc-400">Manage your portfolio, track time, and deploy.</p>
      </header>

      <ProjectBoard initialProjects={projects} />
    </div>
  );
}

