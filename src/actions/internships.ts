"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";

export async function getInternships() {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.internship.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function addInternship(formData: FormData) {
  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.internship.create({
    data: {
      userId: user.id,
      company,
      role,
      status,
    },
  });

  revalidatePath("/internships");
}

export async function updateInternshipStatus(id: string, newStatus: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.internship.updateMany({
    where: { id, userId: user.id },
    data: { status: newStatus },
  });
  
  revalidatePath("/internships");
}

export async function deleteInternship(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.internship.deleteMany({
    where: { id, userId: user.id },
  });
  
  revalidatePath("/internships");
}
