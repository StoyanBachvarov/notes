import { NoteForm } from "@/components/NoteForm";

export default function NewNotePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Note</h1>
      <NoteForm />
    </div>
  );
}