"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./user";
import { prisma } from "@/lib/prisma";

export type UserLink = {
  name: string;
  url: string;
};

export async function getUserLinks(): Promise<UserLink[]> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return [];

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { links: true }
    });

    if (dbUser?.links) {
      // Prisma stores JSON fields, and depending on the database and driver, 
      // it might return a string or an object. Let's parse safely.
      let parsedLinks = dbUser.links;
      if (typeof parsedLinks === "string") {
        try {
          parsedLinks = JSON.parse(parsedLinks);
        } catch (e) {
          return [];
        }
      }
      if (Array.isArray(parsedLinks)) {
        return parsedLinks as UserLink[];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching user links:", error);
    return [];
  }
}

export async function saveUserLinks(links: UserLink[]): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Basic validation
    const validLinks = links.filter(link => link.name.trim() !== "" && link.url.trim() !== "");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        links: validLinks // Prisma takes care of converting this to a JSON field
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving user links:", error);
    return { success: false, error: "Failed to save links." };
  }
}
