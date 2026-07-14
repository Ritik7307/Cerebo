"use server";

import { getAuthenticatedUser } from "./user";

export type JobUpdate = {
  id: string;
  company: string;
  role: string;
  type: "Internship" | "Full-time" | "Contract" | "Freelance" | "Part-time" | "Other";
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

    // Fetching from multiple real job APIs to maximize coverage (Internships + Full-time)
    const [remotiveRes, arbeitnowRes] = await Promise.all([
      fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=40", { next: { revalidate: 3600 } }).catch(() => null),
      fetch("https://www.arbeitnow.com/api/job-board-api", { next: { revalidate: 3600 } }).catch(() => null)
    ]);

    let allParsedJobs: JobUpdate[] = [];

    // 1. Parse Remotive Data
    if (remotiveRes && remotiveRes.ok) {
      const data = await remotiveRes.json();
      const jobs = data.jobs || [];
      const parsedRemotive = jobs.map((job: any): JobUpdate => {
        let type: JobUpdate["type"] = "Full-time";
        const jobTypeStr = (job.job_type || "").toLowerCase();
        if (jobTypeStr.includes("intern") || jobTypeStr === "internship") type = "Internship";
        else if (jobTypeStr.includes("contract")) type = "Contract";
        else if (jobTypeStr.includes("freelance")) type = "Freelance";
        else if (jobTypeStr.includes("part")) type = "Part-time";
        else if (jobTypeStr && !jobTypeStr.includes("full")) type = "Other";
        
        const postedDate = new Date(job.publication_date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let postedStr = `${diffDays} days ago`;
        if (diffDays === 0) postedStr = "Today";
        else if (diffDays === 1) postedStr = "Yesterday";

        return {
          id: `remotive-${job.id}`,
          company: job.company_name,
          role: job.title,
          type,
          status: "Open",
          deadline: "Rolling",
          applyLink: job.url,
          notes: `Location: ${job.candidate_required_location || "Remote"}`,
          postedAt: postedStr
        };
      });
      allParsedJobs = [...allParsedJobs, ...parsedRemotive];
    }

    // 2. Parse Arbeitnow Data
    if (arbeitnowRes && arbeitnowRes.ok) {
      const data = await arbeitnowRes.json();
      const jobs = data.data || [];
      
      const parsedArbeitnow = jobs.map((job: any): JobUpdate => {
        let type: JobUpdate["type"] = "Full-time";
        const titleStr = (job.title || "").toLowerCase();
        if (titleStr.includes("intern") || titleStr.includes("student")) type = "Internship";
        else if (titleStr.includes("contract")) type = "Contract";
        else if (titleStr.includes("freelance")) type = "Freelance";
        else if (titleStr.includes("part time") || titleStr.includes("part-time")) type = "Part-time";
        
        const postedDate = new Date(job.created_at * 1000);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let postedStr = `${diffDays} days ago`;
        if (diffDays === 0) postedStr = "Today";
        else if (diffDays === 1) postedStr = "Yesterday";

        return {
          id: `arbeitnow-${job.slug}`,
          company: job.company_name,
          role: job.title,
          type,
          status: "Open",
          deadline: "Rolling",
          applyLink: job.url,
          notes: `Location: ${job.location || "Remote"}${job.remote ? " (Supports Remote)" : ""}`,
          postedAt: postedStr
        };
      });
      allParsedJobs = [...allParsedJobs, ...parsedArbeitnow];
    }

    // Sort all jobs so that "Today" / "Yesterday" appear first
    allParsedJobs.sort((a, b) => {
      const getScore = (timeStr: string) => {
        if (timeStr === "Today") return 0;
        if (timeStr === "Yesterday") return 1;
        const match = timeStr.match(/(\d+)\s+days/);
        return match ? parseInt(match[1]) + 1 : 999;
      };
      return getScore(a.postedAt) - getScore(b.postedAt);
    });

    return { success: true, updates: allParsedJobs };
  } catch (error: unknown) {
    console.error("Updates Fetch Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to fetch real job updates." };
  }
}
