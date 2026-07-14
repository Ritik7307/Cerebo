import { getUserLinks } from "@/actions/profile";
import { getResumes } from "@/actions/resume";
import { ProfileLinksClient } from "./ProfileLinksClient";
import { ResumeBoard } from "@/components/features/ResumeBoard";
import { UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [links, resumes] = await Promise.all([
    getUserLinks(),
    getResumes()
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-blue-500" />
          My Profile
        </h1>
        <p className="text-zinc-400 mt-2">Manage your external links and resume versions in one place.</p>
      </header>

      <div className="space-y-12">
        <section>
          <ProfileLinksClient initialLinks={links} />
        </section>

        <section className="space-y-4 pt-6 border-t border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Resumes & ATS Management</h2>
            <p className="text-sm text-zinc-400">Track and score different resume versions tailored for roles.</p>
          </div>
          {/* Re-use the existing ResumeBoard component */}
          <ResumeBoard initialResumes={resumes} />
        </section>
      </div>
    </div>
  );
}
