"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "./user";
import { revalidatePath } from "next/cache";

export async function saveStudySession(durationInSeconds: number, taskTitle?: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  if (durationInSeconds < 60) {
    // Ignore sessions shorter than 1 minute to avoid clutter
    return { success: false, error: "Session too short" };
  }

  try {
    await prisma.focusSession.create({
      data: {
        userId: user.id,
        duration: Math.floor(durationInSeconds / 60), // Store in minutes
        task: taskTitle || "General Study",
      }
    });
    
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("Failed to save study session:", error);
    return { success: false, error: "Failed to save session" };
  }
}

export async function getAnalyticsData() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // 1. Total Topics Covered
  const completedVideos = await prisma.playlistItem.count({
    where: { playlist: { userId: user.id }, isCompleted: true }
  });
  const completedDSA = await prisma.dSAProgress.count({
    where: { userId: user.id, status: 'Solved' }
  });
  const completedRoadmapTopics = await prisma.roadmapProgress.count({
    where: { userId: user.id, status: 'Completed' }
  });
  const totalTopicsCovered = completedVideos + completedDSA + completedRoadmapTopics;

  // 2. Total Study Time (all FocusSessions)
  const allSessions = await prisma.focusSession.aggregate({
    where: { userId: user.id },
    _sum: { duration: true }
  });
  const totalStudyMinutes = allSessions._sum.duration || 0;
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // 3. Learning Hours Chart (Last 4 weeks)
  const chartData = [];
  const now = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7 + 7));
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
    
    const weekSessions = await prisma.focusSession.aggregate({
      where: {
        userId: user.id,
        completedAt: {
          gte: startDate,
          lt: endDate,
        }
      },
      _sum: { duration: true }
    });
    
    chartData.push({
      name: `Week ${4 - i}`,
      hours: Number(((weekSessions._sum.duration || 0) / 60).toFixed(1))
    });
  }

  // 4. Skill Distribution
  const total = totalTopicsCovered || 1; // prevent divide by zero
  const skillDistribution = [
    { name: "Videos/Courses", percentage: Math.round((completedVideos / total) * 100), color: "bg-blue-500" },
    { name: "DSA Problems", percentage: Math.round((completedDSA / total) * 100), color: "bg-emerald-500" },
    { name: "Roadmap Topics", percentage: Math.round((completedRoadmapTopics / total) * 100), color: "bg-purple-500" },
  ];

  return {
    totalTopicsCovered,
    totalStudyHours,
    chartData,
    skillDistribution
  };
}
