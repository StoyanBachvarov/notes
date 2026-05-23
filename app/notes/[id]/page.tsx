import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          &larr; Back to all notes
        </Link>
        <div className="flex gap-3">
          <Link 
            href={`/notes/${noteId}/edit`} 
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition"
          >
            Edit
          </Link>
          <Link 
            href={`/notes/${noteId}/delete`} 
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition"
          >
            Delete
          </Link>
        </div>
      </div>
      
      <article className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <header className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-gray-500">
            <div className="flex flex-wrap gap-2">
              {note.tags.map((t, i) => (
                <Link 
                  key={i} 
                  href={`/?tag=${encodeURIComponent(t)}`}
                  className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-100 transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
            <div className="flex flex-col sm:text-right">
              <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
              {note.updatedAt > note.createdAt && (
                <span className="italic">Updated: {new Date(note.updatedAt).toLocaleString()}</span>
              )}
            </div>
          </div>
        </header>
        
        <div className="prose prose-blue max-w-none text-gray-800 whitespace-pre-wrap">
          {note.content}
        </div>
      </article>
    </div>
  );
}