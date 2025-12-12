import { getReservations, updateReservationStatus } from "@/lib/AdminAction";
import { CheckCircle, XCircle } from "lucide-react";

export default async function AdminReservations() {

  const reservations = await getReservations();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
      

      <div className="p-6 bg-[#E879F9]">
        <h2 className="text-white font-bold text-lg">Active Reservations Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FCE7F3] text-fuchsia-900 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Reserve Date</th>
              <th className="px-6 py-4">Requested Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No pending reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((res: any) => (
                <tr key={res.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{res.bookTitle}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{res.userEmail}</span>
                        <span className="text-xs text-gray-500">{res.userName}</span>
                    </div>
                  </td>
                  

                  <td className="px-6 py-4 text-gray-600">{res.reserveDate}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{res.requestedDate}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <form action={async () => {
                        "use server";
                        await updateReservationStatus(res.id, 'fulfilled');
                      }}>
                        <button 
                          type="submit"
                          className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-200" 
                          title="Approve"
                        >
                          <CheckCircle className="h-6 w-6" />
                        </button>
                      </form>

                      <form action={async () => {
                        "use server";
                        await updateReservationStatus(res.id, 'cancelled');
                      }}>
                        <button 
                          type="submit"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-200" 
                          title="Reject"
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                      </form>

                    </div>
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