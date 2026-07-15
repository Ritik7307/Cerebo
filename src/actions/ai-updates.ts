"use server";

import { getAuthenticatedUser } from "./user";
import { Groq } from "groq-sdk";

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
  location: string;
  isRemote: boolean;
};

export async function fetchLiveJobUpdates(): Promise<{ success: boolean; updates?: JobUpdate[]; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetching from multiple real job APIs + Groq AI for localized fresher drives
    const [remotiveRes, arbeitnowRes, groqRes] = await Promise.all([
      fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=100", { next: { revalidate: 3600 } }).catch(() => null),
      fetch("https://www.arbeitnow.com/api/job-board-api", { next: { revalidate: 3600 } }).catch(() => null),
      fetchGroqUpdates()
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

        const loc = job.candidate_required_location || "Worldwide";
        const isRemote = true;

        return {
          id: `remotive-${job.id}`,
          company: job.company_name,
          role: job.title,
          type,
          status: "Open",
          deadline: "Rolling",
          applyLink: job.url,
          notes: `Location: ${loc}`,
          postedAt: postedStr,
          location: loc,
          isRemote
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

        const loc = job.location || "Remote";
        const isRemote = job.remote || false;

        return {
          id: `arbeitnow-${job.slug}`,
          company: job.company_name,
          role: job.title,
          type,
          status: "Open",
          deadline: "Rolling",
          applyLink: job.url,
          notes: `Location: ${loc}${isRemote ? " (Supports Remote)" : ""}`,
          postedAt: postedStr,
          location: loc,
          isRemote
        };
      });
      allParsedJobs = [...allParsedJobs, ...parsedArbeitnow];
    }

    // 3. Add AI Simulated Local Drives (Wipro, Flipkart, etc)
    if (groqRes && groqRes.length > 0) {
      allParsedJobs = [...groqRes, ...allParsedJobs];
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

// Helper function to fetch localized tech drives using Groq
async function fetchGroqUpdates(): Promise<JobUpdate[]> {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert tech recruiter API. Output ONLY valid JSON containing an array of 15 current/recent active off-campus drives or internships in India for freshers and junior developers. 
Include top companies like Wipro, Flipkart, TCS, Amazon, Google, Microsoft, Adobe, Swiggy, Zomato, Infosys, and Tech Mahindra. 
CRITICAL: For the "applyLink", you MUST provide the official career page root url of that company (e.g., https://careers.wipro.com/careers-home/, https://www.flipkartcareers.com/) to ensure it is a valid, working link. Do not make up fake specific job paths.
Output format:
{
  "jobs": [
    {
      "company": "Company Name",
      "role": "Role Name",
      "type": "Internship" | "Full-time",
      "status": "Open",
      "deadline": "Closing Soon" or a date,
      "applyLink": "OFFICIAL_CAREERS_URL",
      "notes": "Short description",
      "location": "India (Hybrid/On-site)",
      "isRemote": false
    }
  ]
}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "[]";
    // Since response_format is json_object, we need to wrap the array in an object in the prompt, or just parse safely.
    // Wait, json_object requires an object. The prompt asks for an array. Let's parse whatever is returned.
    let parsed: any;
    try {
      parsed = JSON.parse(content);
      // If it returned an object with a key containing the array (e.g. { "jobs": [...] }), extract it.
      if (!Array.isArray(parsed) && typeof parsed === "object") {
        const keys = Object.keys(parsed);
        if (keys.length > 0 && Array.isArray(parsed[keys[0]])) {
          parsed = parsed[keys[0]];
        } else {
          parsed = [];
        }
      }
    } catch {
      parsed = [];
    }

    if (Array.isArray(parsed)) {
      return parsed.map((job, idx) => ({
        id: `ai-local-${idx}`,
        company: job.company || "Unknown",
        role: job.role || "Role",
        type: job.type === "Internship" ? "Internship" : "Full-time",
        status: "Open",
        deadline: job.deadline || "Rolling",
        applyLink: job.applyLink || "#",
        notes: job.notes || "",
        location: job.location || "India",
        isRemote: job.isRemote || false,
        postedAt: "Today"
      }));
    }
    return [];
  } catch (error) {
    console.error("Groq Local Drives fetch error:", error);
    return [];
  }
}
