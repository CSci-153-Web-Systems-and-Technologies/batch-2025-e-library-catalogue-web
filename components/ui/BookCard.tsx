"use client"

import { useState } from "react"
import { Book } from "@/type/Index"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Hash, User, ArrowRight, Book as BookIcon, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { BookDetailsModal } from "./BookDetailsModal"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available':
        return { 
          color: 'text-emerald-700', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-100',
          icon: CheckCircle2,
          label: 'Available'
        };
      case 'borrowed':
        return { 
          color: 'text-red-700', 
          bg: 'bg-red-50', 
          border: 'border-red-100',
          icon: AlertCircle,
          label: 'Borrowed'
        };
      case 'reserved':
        return { 
          color: 'text-amber-700', 
          bg: 'bg-amber-50', 
          border: 'border-amber-100',
          icon: Clock,
          label: 'Reserved'
        };
      default:
        return { 
          color: 'text-gray-700', 
          bg: 'bg-gray-50', 
          border: 'border-gray-100',
          icon: BookIcon,
          label: status 
        };
    }
  };

  const statusStyle = getStatusStyles(book.status);
  const StatusIcon = statusStyle.icon;

  return (
    <>
      <Card className={`group relative flex flex-col h-full overflow-hidden border bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${book.status === 'available' ? 'border-gray-200' : 'border-gray-100 opacity-90 hover:opacity-100'}`}>
        
        
        <div className={`h-1.5 w-full bg-gradient-to-r ${book.status === 'available' ? 'from-accent-teal to-teal-400' : book.status === 'borrowed' ? 'from-red-400 to-red-300' : 'from-amber-400 to-amber-300'}`} />
        
        <CardContent className="flex-1 p-5 flex flex-col gap-3">
         
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {book.genre}
            </span>
            
           
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
              <StatusIcon className="h-3 w-3" />
              {statusStyle.label}
            </div>
          </div>

          
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-accent-teal transition-colors line-clamp-1" title={book.title}>
              {book.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{book.author}</span>
            </div>
          </div>

          
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5em]">
            {book.description || "No description available."}
          </p>

          
          <div className="mt-auto grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Location</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium truncate">
                <MapPin className="h-3 w-3 text-accent-teal/80" />
                <span className="truncate" title={book.location}>{book.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">ISBN</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium truncate">
                <Hash className="h-3 w-3 text-accent-teal/80" />
                {book.isbn}
              </div>
            </div>
          </div>
        </CardContent>

        
        <CardFooter className="p-0">
          <Button 
            variant="ghost" 
            onClick={() => setIsModalOpen(true)}
            className="w-full justify-between rounded-t-none h-11 px-5 text-xs font-medium text-gray-500 hover:text-accent-teal hover:bg-teal-50/50 transition-all duration-300"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-50 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent-teal" />
          </Button>
        </CardFooter>
      </Card>

      <BookDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        book={book} 
      />
    </>
  )
}