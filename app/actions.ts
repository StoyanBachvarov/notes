"use server";

import { db } from "../db";
import { notes } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function createNote(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsString = formData.get("tags") as string;
  
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];

  await db.insert(notes).values({
    userId: session.userId,
    title,
    content,
    tags,
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateNote(id: number, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsString = formData.get("tags") as string;
  
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];

  await db.update(notes)
    .set({ title, content, tags, updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, session.userId)));

  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNote(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, session.userId)));
  
  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect("/");
}