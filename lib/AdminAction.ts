"use server";

import { createClient } from '@/lib/server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
  BookRow, 
  ReservationRow, 
  BorrowingRow 
} from '@/type/Index';
export async function addBook(formData: FormData) {
  const supabase = await createClient();

  const bookData = {
    Title: formData.get("title") as string,
    Author: formData.get("author") as string,
    "Genre (Subject)": formData.get("genre") as string,
    "ISBN-13": Number(formData.get("isbn")),
    "Location (Call Number)": formData.get("location") as string,
    "Description / Notes": formData.get("description") as string,
    status: "available",
  };

  const { error } = await supabase.from("book").insert([bookData]);

  if (error) {
    console.error("Error adding book:", error);
    throw new Error("Failed to add book: " + error.message);
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function getAllBooks(page: number = 1, limit: number = 5, search: string = '') {
  const supabase = await createClient();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('book')
    .select('*', { count: 'exact' }) 
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`Title.ilike.%${search}%,Author.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching books:", error);
    return { books: [], totalPages: 0 };
  }

  const books = (data as BookRow[]).map((book) => ({
    id: book.id,
    title: book.Title || 'Untitled', 
    author: book.Author || 'Unknown',
    genre: book["Genre (Subject)"] || 'Uncategorized',
    location: book["Location (Call Number)"] || 'Unknown',
    isbn: book["ISBN-13"] || 0,
    status: book.status || 'available'
  }));

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return { books, totalPages };
}
export async function getBorrowedBooks() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('borrowings')
    .select(`
      id,
      status,
      borrow_date,
      due_date,
      user:profiles(email, full_name),
      book:book(Title)
    `)
    .eq('status', 'borrowed')
    .order('due_date', { ascending: true }); 

  if (error) {
    console.error("Error fetching borrowings:", error);
    return [];
  }
  
  return (data as unknown as BorrowingRow[]).map((item) => ({
    id: item.id,
    bookTitle: item.book?.Title || "Unknown Book",
    userEmail: item.user?.email || "Unknown User",
    userName: item.user?.full_name || "N/A",
    borrowDate: new Date(item.borrow_date).toLocaleDateString(),
    dueDate: new Date(item.due_date).toLocaleDateString(),
    status: item.status
  }));
}