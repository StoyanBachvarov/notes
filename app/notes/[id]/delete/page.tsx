import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteNote } from "@/app/actions";

export default async function DeleteNotePage({ params }: { params: Promise<{ id: string }> }) {
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

  const deleteAction = deleteNote.bind(null, noteId);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Note</h1>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete <span className="font-semibold">{note.title}</span>? This action cannot be undone.
      </p>
      
      <form action={deleteAction} className="flex gap-4">
        <button 
          type="submit" 
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Yes, Delete Note
        </button>
        <Link 
          href={`/notes/${noteId}`} 
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}