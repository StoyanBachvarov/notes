"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createNote, updateNote } from "../app/actions";

type Note = {
  id?: number;
  title: string;
  content: string;
  tags: string[];
};

export function NoteForm({ note }: { note?: Note }) {
  const isEditing = !!note?.id;
  
  // Create bound actions depending on if we're editing or not
  const formAction = isEditing 
    ? updateNote.bind(null, note.id!)
    : createNote;

  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      await formAction(formData);
      return { success: true }; // actually it redirects
    } catch (e: any) {
      return { error: e.message || "An error occurred" };
    }
  }, null);

  return (
    <form action={action} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          defaultValue={note?.title}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Note title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea 
          id="content" 
          name="content" 
          required 
          rows={8}
          defaultValue={note?.content}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your note here..."
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input 
          type="text" 
          id="tags" 
          name="tags" 
          defaultValue={note?.tags?.join(", ")}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. personal, work, ideas"
        />
      </div>

      <div className="flex gap-4 pt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : (isEditing ? "Update Note" : "Create Note")}
        </button>
        <Link 
          href={isEditing ? `/notes/${note.id}` : "/"} 
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}