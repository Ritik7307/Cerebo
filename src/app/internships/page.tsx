import { getInternships } from "@/actions/internships";
import { KanbanBoard } from "@/components/features/KanbanBoard";

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <div className="h-full animate-in fade-in duration-500">
      <KanbanBoard initialInternships={internships} />
    </div>
  );
}
