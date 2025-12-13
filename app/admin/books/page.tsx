import { getAllBooks } from "@/lib/AdminAction";
import { Search, ChevronDown, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function BookManagement({ searchParams }: PageProps) {

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.query || '';
  const ITEMS_PER_PAGE = 5;


  const { books, totalPages } = await getAllBooks(currentPage, ITEMS_PER_PAGE, searchQuery);

  if (currentPage > 1 && books.length === 0 && currentPage > totalPages) {
    redirect('/admin/books?page=1');
  }

  return (
    <div className="space-y-6">
      
     
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
       
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search book by title, author" 
            className="w-full bg-[#F0F2F5] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-400"
            defaultValue={searchQuery}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

     
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            All Books
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          
          <Link 
            href="/admin/books/add-book"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Book</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#00FF9D] text-gray-900">
              <tr>
                <th className="px-6 py-4 font-bold text-sm">Title</th>
                <th className="px-6 py-4 font-bold text-sm">Author</th>
                <th className="px-6 py-4 font-bold text-sm">Subject</th>
                <th className="px-6 py-4 font-bold text-sm">Location</th>
                <th className="px-6 py-4 font-bold text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map((book: any) => (
                  <tr key={book.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {book.genre}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {book.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages || 1}</span>
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/books?page=${currentPage - 1}`}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentPage <= 1 
                  ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </Link>

            <Link
              href={`/admin/books?page=${currentPage + 1}`}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentPage >= totalPages 
                  ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}