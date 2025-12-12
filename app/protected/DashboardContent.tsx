// app/protected/dashboard-content.tsx
"use client";
import React from 'react';
import BookCard from '@/components/ui/book-card';
import { DashboardContentProps } from '@/type/index';

export default function DashboardContent({ books }: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id} // <--- CHANGED FROM book.isbn TO book.id
          book={book}
        />
      ))}
    </div>
  );
}