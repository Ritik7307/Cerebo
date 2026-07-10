"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";

export async function getEvents() {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return await prisma.event.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });
}

export async function addEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const dateStr = formData.get("date") as string;

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.event.create({
    data: {
      userId: user.id,
      title,
      type,
      date: new Date(dateStr),
    },
  });

  revalidatePath("/calendar");
}
