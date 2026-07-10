"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";

export async function getResumes() {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.resumeVersion.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function addResume(formData: FormData) {
  const title = formData.get("title") as string;
  const atsScore = parseInt(formData.get("atsScore") as string, 10);
  const isMain = formData.get("isMain") === "on";

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  // If this new resume is marked as main, unset any existing main resumes
  if (isMain) {
    await prisma.resumeVersion.updateMany({
      where: { userId: user.id, isMain: true },
      data: { isMain: false },
    });
  }

  await prisma.resumeVersion.create({
    data: {
      userId: user.id,
      title,
      atsScore,
      isMain,
    },
  });

  revalidatePath("/resume");
}

export async function deleteResume(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");
  await prisma.resumeVersion.deleteMany({
    where: { id, userId: user.id },
  });
  
  revalidatePath("/resume");
}

export async function getResumeById(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  return await prisma.resumeVersion.findFirst({
    where: { id, userId: user.id }
  });
}

export async function updateResumeContent(id: string, content: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");
  await prisma.resumeVersion.updateMany({
    where: { id, userId: user.id },
    data: { content }
  });
  revalidatePath(`/resume/${id}`);
}
