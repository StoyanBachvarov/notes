import { db } from "../db";
import { notes } from "../db/schema";
import { and, desc, ilike, sql } from "drizzle-orm";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const search = params.search || "";
  const tag = params.tag || "";
  const page = Number(params.page) || 1;
  const limit = 5;

  const conditions = [];
  if (search) {
    conditions.push(
      sql`(${ilike(notes.title, `%${search}%`)} OR ${ilike(notes.content, `%${search}%`)})`
    );
  }
  if (tag) {
    conditions.push(sql`${tag} = ANY(${notes.tags})`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notes)
    .where(whereClause);

  const totalPages = Math.ceil(count / limit) || 1;

  const allNotes = await db
    .select()
    .from(notes)
    .where(whereClause)
    .orderBy(desc(notes.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Notes</h1>
        <Link 
          href="/notes/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add New Note
        </Link>
      </div>

      <form className="flex gap-2">
        <input 
          type="text" 
          name="search" 
          placeholder="Search keyword..." 
          defaultValue={search}
          className="border border-gray-300 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          name="tag" 
          placeholder="Filter by tag..." 
          defaultValue={tag}
          className="border border-gray-300 rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
          Filter
        </button>
        {(search || tag) && (
          <Link href="/" className="bg-gray-100 border border-gray-300 text-red-600 px-4 py-2 rounded-md hover:bg-gray-200">
            Clear
          </Link>
        )}
      </form>

      {allNotes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
          No notes found. Create your first note!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {allNotes.map((note) => (
            <div key={note.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                <Link href={`/notes/${note.id}`} className="hover:text-blue-600">
                  {note.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{note.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((t, i) => (
                  <Link 
                    key={i} 
                    href={`/?tag=${encodeURIComponent(t)}`}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-100"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
              
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-3 text-sm">
                  <Link href={`/notes/${note.id}`} className="text-blue-500 hover:text-blue-700 font-medium">View</Link>
                  <Link href={`/notes/${note.id}/edit`} className="text-orange-500 hover:text-orange-700 font-medium">Edit</Link>
                  <Link href={`/notes/${note.id}/delete`} className="text-red-500 hover:text-red-700 font-medium">Delete</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const urlParams = new URLSearchParams();
            if (search) urlParams.set('search', search);
            if (tag) urlParams.set('tag', tag);
            urlParams.set('page', pageNum.toString());
            
            return (
              <Link 
                key={pageNum}
                href={`/?${urlParams.toString()}`}
                className={`px-3 py-1 rounded-md text-sm ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {pageNum}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}