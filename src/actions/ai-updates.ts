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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GROQ API Key is missing in environment variables." };
    }

    const systemPrompt = `You are an AI assistant providing real-time-like updates on tech industry job and internship openings for students and recent grads.
Generate a realistic list of 6-8 currently active or recently opened hiring drives, internships, and programs (e.g., Wipro, TCS, Amazon, Google, Microsoft, startups).
Make sure to include a mix of roles (SDE, Data Analyst, Product Manager).
Return the data as a JSON array of objects. Do not include markdown formatting or extra text.

Each object MUST have:
- "id": A unique string ID (e.g., UUID or short hash)
- "company": String
- "role": String
- "type": "Internship" | "Full-time" | "Hackathon" | "Program"
- "status": "Open" | "Closing Soon"
- "deadline": A realistic future date string (e.g., "Oct 15, 2026")
- "applyLink": "https://careers.[company].com/..."
- "notes": A short 1-sentence note (e.g., "Batch 2025/2026 eligible. Online Assessment in 2 weeks.")
- "postedAt": "2 hours ago" or "Yesterday"`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      // We can use Next.js cache to avoid hitting the API on every page load
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean up potential markdown formatting
    if (content.startsWith("```json")) {
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/```/g, "").trim();
    }

    const parsed: JobUpdate[] = JSON.parse(content);

    return { success: true, updates: parsed };
  } catch (error: unknown) {
    console.error("AI Updates Fetch Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to fetch updates." };
  }
}
