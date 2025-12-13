"use client";

import React, { useEffect } from 'react';
import { X, Book as BookIcon, User, MapPin, Hash, AlignLeft, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Book } from '@/type/Index';
import { Button } from '@/components/ui/button';
import BookReservationDialog from '@/components/BookReservationDialog';
import PlaceHoldDialog from '@/components/HoldDialog'; 

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function BookDetailsModal({ isOpen, onClose, book }: BookDetailsModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  
  const isAvailable = book.status === 'available';
  const isBorrowed = book.status === 'borrowed'; 
  
 
  const showReserveCalendar = isAvailable || book.status === 'reserved';

  const getStatusBadge = () => {
    switch (book.status) {
      case 'available':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"><CheckCircle2 className="h-3.5 w-3.5" /> Available</span>;
      case 'borrowed':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/10"><AlertCircle className="h-3.5 w-3.5" /> Borrowed</span>;
      case 'reserved':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20"><Clock className="h-3.5 w-3.5" /> Reserved</span>;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        
        
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100">
           <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
           <div className="flex gap-4">
             <div className={`shrink-0 p-3 rounded-xl h-fit ${isAvailable ? 'bg-teal-50 text-accent-teal' : isBorrowed ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
               <BookIcon className="h-8 w-8" />
             </div>
             <div className="space-y-2">
               <div className="flex flex-wrap gap-2">
                 <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{book.genre}</span>
                 {getStatusBadge()}
               </div>
               <h2 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h2>
               <div className="flex items-center gap-2 text-gray-600 font-medium"><User className="h-4 w-4 text-accent-teal" /> {book.author}</div>
             </div>
           </div>
        </div>

    
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><MapPin className="h-3.5 w-3.5" /> Location</div>
               <p className="text-sm font-medium text-gray-900 truncate">{book.location}</p>
             </div>
             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><Hash className="h-3.5 w-3.5" /> ISBN</div>
               <p className="text-sm font-medium text-gray-900 font-mono">{book.isbn}</p>
             </div>
           </div>
           <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><AlignLeft className="h-4 w-4 text-gray-500" /> Description</div>
             <div className="text-sm text-gray-600 leading-relaxed bg-white">{book.description || "No description available."}</div>
           </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-700 hover:bg-white">Cancel</Button>
          
          {showReserveCalendar ? (
            
            <BookReservationDialog 
              bookId={book.id} 
              bookTitle={book.title} 
              className="px-6 shadow-sm bg-teal-600 hover:bg-teal-700 text-white" 
            />
          ) : isBorrowed ? (
            <PlaceHoldDialog 
              bookId={book.id} 
              bookTitle={book.title} 
              className="px-6 shadow-sm bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
            />
          ) : (
            <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
              Currently {book.status}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}