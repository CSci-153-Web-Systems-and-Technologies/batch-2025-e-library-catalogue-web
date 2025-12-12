"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { reserveBook, getBookBusyDates } from "@/lib/StudentAction";

interface ReservationDialogProps {
  bookId: string;
  bookTitle: string;
  className?: string; 
}

export default function BookReservationDialog({ bookId, bookTitle, className }: ReservationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [busyDates, setBusyDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFetching(true);
      getBookBusyDates(bookId).then((dates) => {
        setBusyDates(dates);
        setFetching(false);
      });
    }
  }, [isOpen, bookId]);

  const handleReserve = async () => {
    if (!selectedDate) return;
    setLoading(true);
    setMessage(null);

    const dateObj = new Date(selectedDate);
    const result = await reserveBook(bookId, dateObj);

    setLoading(false);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: "Book reserved successfully!" });
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          Reserve Book
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white z-[200]">
        <DialogHeader>
          <DialogTitle>Reserve &quot;{bookTitle}&quot;</DialogTitle>
          <DialogDescription>
            Select a date to pick up this book.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Pickup Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  if (busyDates.includes(e.target.value)) {
                    alert("Date already booked.");
                    setSelectedDate("");
                  } else {
                    setSelectedDate(e.target.value);
                  }
                }}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              {fetching ? <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Checking...</span> : <span>Busy dates: {busyDates.length}</span>}
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4"/> : null}
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleReserve} disabled={loading || !selectedDate} className="bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}