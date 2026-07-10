"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";
import { prisma } from "@/lib/prisma";

export async function generateAIRoadmap(topic: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GROQ API Key is missing in environment variables." };
    }

    const systemPrompt = `You are a world-class Staff Software Engineer and Technical Interview Coach. 
The user wants a highly comprehensive, sequential learning roadmap for: "${topic}".
You must synthesize data from top online resources (Wikipedia, GeeksforGeeks, LeetCode, company engineering blogs) to build the ultimate guide.

REQUIREMENTS:
1. The roadmap MUST be structured sequentially for a beginner to progress to an expert level.
2. It must be highly detailed. Do not skip fundamentals. 
3. You MUST provide a completely separate, exhaustive section for company-wise coding round and interview questions (OA/Onsite) organized by company.

The output MUST be a valid JSON object with the following structure exactly:
{
  "title": "Comprehensive Roadmap Title",
  "modules": [
    {
      "week": "Phase 1: [Phase Name]",
      "topics": [
        {
          "name": "Topic Name",
          "description": "Highly detailed 2-3 sentence description.",
          "gfgUrl": "https://www.geeksforgeeks.org/search/?q=Exact+Topic+Name"
        }
      ]
    }
  ],
  "companyInterviewGuide": [
    {
      "company": "Google",
      "questions": [
        {
          "question": "Precise name of the question/problem",
          "difficulty": "Medium",
          "type": "Onsite / OA",
          "leetcodeUrl": "https://leetcode.com/problems/precise-name-of-the-problem/"
        }
      ]
    }
  ]
}
Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.6,
        max_tokens: 6000,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean up potential markdown formatting
    if (content.startsWith("\`\`\`json")) {
      content = content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (content.startsWith("\`\`\`")) {
      content = content.replace(/\`\`\`/g, "").trim();
    }

    // Validate JSON
    const parsed = JSON.parse(content);
    if (!parsed.title || !parsed.modules) {
      throw new Error("Generated roadmap missing title or modules.");
    }

    const savedRoadmap = await prisma.aIRoadmap.create({
      data: {
        userId: user.id,
        topic: topic,
        content: JSON.stringify(parsed)
      }
    });

    revalidatePath("/roadmaps");
    return { success: true, roadmapId: savedRoadmap.id };
  } catch (error: unknown) {
    console.error("AI Roadmap Generation Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to generate roadmap." };
  }
}

export async function getAIRoadmaps() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return [];

    const roadmaps = await prisma.aIRoadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    return roadmaps.map(r => ({
      id: r.id,
      topic: r.topic,
      parsedContent: JSON.parse(r.content),
      createdAt: r.createdAt
    }));
  } catch (error) {
    console.error("Error fetching AI roadmaps:", error);
    return [];
  }
}

export async function deleteAIRoadmap(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.aIRoadmap.deleteMany({
      where: { id, userId: user.id }
    });
    
    revalidatePath("/roadmaps");
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
