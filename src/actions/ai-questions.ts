"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";
import { prisma } from "@/lib/prisma";

export async function generateAICompanyGuide(query: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GROQ API Key is missing in environment variables." };
    }

    const systemPrompt = `You are a world-class Technical Recruiter and Staff Software Engineer. 
The user wants a comprehensive, categorized list of real interview questions based on the query: "${query}".
The query could be a company name (e.g., "Google", "Meta") OR a specific topic (e.g., "Computer Networks", "System Design", "OOPs", "Frontend", "Operating Systems").
You must synthesize data from top online resources to build the ultimate interview preparation guide for this query.

REQUIREMENTS:
1. Provide a massive list of realistic questions. Do NOT hold back. 
2. If the query is a COMPANY, categorize the questions into "Online Assessment (OA)", "Phone Screen", and "Onsite Rounds".
3. If the query is a TOPIC, categorize the questions logically by sub-topics (e.g., "Basic Concepts", "Advanced Scenarios", "Real-world Applications").
4. Include the difficulty (Easy, Medium, Hard) and frequency (High, Medium, Low) for each.
5. In the "topics" array for each question, you MUST include the COMPANIES that frequently ask this question (if known), alongside the technical concepts.
6. Not all questions are on LeetCode. For the reference link, use the best available platform where the user can practice or read about the question (e.g., LeetCode, GeeksforGeeks, HackerRank, Codeforces).
7. The output MUST be a valid JSON object.

The output MUST be a valid JSON object with the following structure exactly:
{
  "company": "Query Name (Company or Topic)",
  "overview": "Brief 2-sentence overview of what to expect for this query.",
  "categories": [
    {
      "name": "Category Name",
      "questions": [
        {
          "title": "Precise name of the question/problem",
          "difficulty": "Medium",
          "frequency": "High",
          "topics": ["Arrays", "Google", "Amazon"],
          "referenceUrl": "https://leetcode.com/problems/precise-name-of-the-problem/ OR GeeksforGeeks link"
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
    if (!parsed.company || !parsed.categories) {
      throw new Error("Generated guide missing company or categories.");
    }

    const savedGuide = await prisma.aICompanyGuide.create({
      data: {
        userId: user.id,
        companyName: query,
        content: JSON.stringify(parsed)
      }
    });

    revalidatePath("/questions");
    return { success: true, guideId: savedGuide.id };
  } catch (error: unknown) {
    console.error("AI Company Guide Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to generate guide." };
  }
}

export async function getAICompanyGuides() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return [];

    const guides = await prisma.aICompanyGuide.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    return guides.map(g => ({
      id: g.id,
      companyName: g.companyName,
      parsedContent: JSON.parse(g.content),
      createdAt: g.createdAt
    }));
  } catch (error) {
    console.error("Error fetching AI company guides:", error);
    return [];
  }
}

export async function deleteAICompanyGuide(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.aICompanyGuide.deleteMany({
      where: { id, userId: user.id }
    });
    
    revalidatePath("/questions");
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
