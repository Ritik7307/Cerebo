"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";

export async function getDomainProgress(domain: string) {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.roadmapProgress.findMany({
    where: { 
      userId: user.id,
      domain
    },
  });
}

export async function getAllProgress() {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.roadmapProgress.findMany({
    where: { userId: user.id },
  });
}

export async function markTopicCompleted(domain: string, topic: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  // Find if it exists
  const existing = await prisma.roadmapProgress.findFirst({
    where: { userId: user.id, domain, topic }
  });

  if (existing) {
    await prisma.roadmapProgress.update({
      where: { id: existing.id },
      data: { status: "completed" }
    });
  } else {
    await prisma.roadmapProgress.create({
      data: {
        userId: user.id,
        domain,
        topic,
        status: "completed"
      }
    });
  }

  revalidatePath(`/${domain.toLowerCase().replace(" ", "-")}`);
  revalidatePath("/roadmaps");
}
