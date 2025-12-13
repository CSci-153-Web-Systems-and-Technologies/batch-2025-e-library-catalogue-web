import { getBorrowedBooks, markBookReturned } from "@/lib/AdminAction";
import { RotateCcw } from "lucide-react";

export default async function AdminBorrowedBooks() {
  const borrowedItems = await getBorrowedBooks();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-amber-400">
        <h2 className="text-gray-900 font-bold text-lg">
          Currently Borrowed Books
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-amber-50 text-amber-900 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Book</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Borrowed</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {borrowedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No borrowed books
                </td>
              </tr>
            ) : (
              borrowedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {item.bookTitle}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.userEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.borrowDate}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {item.dueDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={markBookReturned}>
                      <input
                        type="hidden"
                        name="borrowingId"
                        value={item.id}
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1
                                   px-3 py-1.5 rounded-lg
                                   bg-gray-100 text-gray-700
                                   hover:bg-green-100 hover:text-green-700
                                   text-xs font-bold uppercase transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Mark Returned
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
