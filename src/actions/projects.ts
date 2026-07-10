"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";

export async function getProjects() {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.project.findMany({
    where: { userId: user.id },
  });
}

export async function addProject(formData: FormData) {
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const techStack = formData.get("techStack") as string;

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.project.create({
    data: {
      userId: user.id,
      title,
      status,
      techStack,
    },
  });

  revalidatePath("/projects");
}

export async function updateProjectStatus(id: string, newStatus: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.project.updateMany({
    where: { id, userId: user.id },
    data: { status: newStatus },
  });
  
  revalidatePath("/projects");
}
