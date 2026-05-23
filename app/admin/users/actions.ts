"use server";

import { prisma } from "@/lib/prisma";
import { deleteImage } from "../blog/actions";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function updateUser(userId: string, data: { name?: string | null, role?: string, image?: string | null }) {
  try {
    await assertAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: data,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user." };
  }
}

export async function deleteUser(userId: string) {
  try {
    await assertAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (user?.image) {
      await deleteImage(user.image);
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}
