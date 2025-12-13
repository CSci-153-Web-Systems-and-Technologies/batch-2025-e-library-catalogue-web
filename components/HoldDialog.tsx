"use client";

import { useState } from "react";
import { Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { placeHold } from "@/lib/StudentAction";

interface PlaceHoldDialogProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

export default function PlaceHoldDialog({ bookId, bookTitle, className }: PlaceHoldDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleHold = async () => {
    setLoading(true);
    setMessage(null);

    const result = await placeHold(bookId);

    setLoading(false);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: "Success! You are next in line." });
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          Place Hold
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white z-[200]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Place Hold: {bookTitle}
          </DialogTitle>
          <DialogDescription>
            This book is borrowed. Join the waitlist to be notified when it returns.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
            <p className="font-bold mb-1">Queue Policy:</p>
            <p className="text-xs opacity-90">
              Only one student can hold a book at a time. If successful, you will be the next person allowed to borrow this book.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleHold} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white border-none">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Checking Queue...</> : "Confirm Hold"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}