export const dynamic = "force-dynamic";
import { getResumes } from "@/actions/resume";
import { ResumeBoard } from "@/components/features/ResumeBoard";

export default async function ResumePage() {
  const resumes = await getResumes();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Resume Tracker</h1>
        <p className="text-zinc-400">Manage versions and ATS scores for different roles.</p>
      </header>

      <ResumeBoard initialResumes={resumes} />
    </div>
  );
}

