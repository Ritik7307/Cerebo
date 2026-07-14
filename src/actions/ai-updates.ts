"use server";

import { getAuthenticatedUser } from "./user";

export type JobUpdate = {
  id: string;
  company: string;
  role: string;
  type: "Internship" | "Full-time" | "Hackathon" | "Program";
  status: "Open" | "Closing Soon" | "Closed";
  deadline: string;
  applyLink: string;
  notes: string;
  postedAt: string;
};

export async function fetchLiveJobUpdates(): Promise<{ success: boolean; updates?: JobUpdate[]; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetching real software development jobs from Remotive API to ensure 100% accuracy and valid apply links.
    const response = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=15", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Job API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = data.jobs || [];

    const parsed: JobUpdate[] = jobs.map((job: any) => {
      let type: JobUpdate["type"] = "Full-time";
      const jobTypeStr = (job.job_type || "").toLowerCase();
      if (jobTypeStr.includes("intern") || jobTypeStr === "internship") type = "Internship";
      
      const postedDate = new Date(job.publication_date);
      const now = new Date();
      const diffMs = now.getTime() - postedDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let postedStr = `${diffDays} days ago`;
      if (diffDays === 0) postedStr = "Today";
      else if (diffDays === 1) postedStr = "Yesterday";

      return {
        id: job.id.toString(),
        company: job.company_name,
        role: job.title,
        type,
        status: "Open",
        deadline: "Rolling", // Remote jobs typically have rolling deadlines
        applyLink: job.url, // Real, valid apply link
        notes: `Location: ${job.candidate_required_location || "Anywhere (Remote)"}`,
        postedAt: postedStr
      };
    });

    return { success: true, updates: parsed };
  } catch (error: unknown) {
    console.error("Updates Fetch Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to fetch real job updates." };
  }
}
