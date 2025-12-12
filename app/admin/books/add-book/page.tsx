import { addBook } from "@/lib/AdminAction";
import { ChevronLeft, Save, Book, User, Hash, MapPin, AlignLeft, Library } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/books"
          className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Add New Book</h1>
          <p className="text-sm text-slate-500 font-medium">Enter the details to add a book to the catalog.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <form action={addBook} className="space-y-6">
          
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Book className="h-4 w-4 text-blue-500" /> Book Title
              </label>
              <input
                name="title"
                id="title"
                type="text"
                required
                placeholder="e.g. Clean Code"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-500" /> Author
              </label>
              <input
                name="author"
                id="author"
                type="text"
                required
                placeholder="e.g. Robert C. Martin"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Genre & ISBN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="genre" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Library className="h-4 w-4 text-green-500" /> Genre / Subject
              </label>
              <select
                name="genre"
                id="genre"
                required
                defaultValue="" // FIXED: Use defaultValue here instead of 'selected' on option
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select a genre...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Fiction">Fiction</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="isbn" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Hash className="h-4 w-4 text-orange-500" /> ISBN-13
              </label>
              <input
                name="isbn"
                id="isbn"
                type="number"
                required
                placeholder="e.g. 9780132350884"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" /> Library Location
            </label>
            <input
              name="location"
              id="location"
              type="text"
              required
              placeholder="e.g. Section B - Floor 2, Shelf 4"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            />
          </div>

       
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-gray-500" /> Description / Notes
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              placeholder="Enter a brief summary of the book..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link 
              href="/admin/books"
              className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <Button 
              type="submit"
              className="px-8 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Book
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}