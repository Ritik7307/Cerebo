import { getAICompanyGuides } from "@/actions/ai-questions";
import { AIQuestionBoard } from "@/components/features/AIQuestionBoard";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const initialGuides = await getAICompanyGuides();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Interview Questions</h1>
        <p className="text-zinc-400">Master list of real coding questions asked by top tech companies.</p>
      </header>

      <AIQuestionBoard initialGuides={initialGuides} />
    </div>
  );
}
