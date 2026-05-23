import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { NoteForm } from "@/components/NoteForm";

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noteId = Number(id);
  
  if (isNaN(noteId)) {
    notFound();
  }

  const result = await db.select().from(notes).where(eq(notes.id, noteId));
  const note = result[0];

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Note</h1>
      <NoteForm note={note} />
    </div>
  );
}