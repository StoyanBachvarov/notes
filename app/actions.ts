"use server";

import { db } from "../db";
import { notes } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsString = formData.get("tags") as string;
  
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];

  await db.insert(notes).values({
    title,
    content,
    tags,
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateNote(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsString = formData.get("tags") as string;
  
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];

  await db.update(notes)
    .set({ title, content, tags, updatedAt: new Date() })
    .where(eq(notes.id, id));

  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNote(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
  
  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect("/");
}