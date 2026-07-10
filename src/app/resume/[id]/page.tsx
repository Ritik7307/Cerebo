import { getResumeById } from "@/actions/resume";
import ResumeEditor from "@/components/resume/ResumeEditor";
import { notFound } from "next/navigation";

export default async function ResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    return notFound();
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950">
      <ResumeEditor initialData={resume.content} resumeId={resume.id} />
    </div>
  );
}
