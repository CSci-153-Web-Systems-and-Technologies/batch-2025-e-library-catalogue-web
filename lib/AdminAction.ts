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
export async function getReservations() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      status,
      reservation_date,
      created_at,
      user:profiles(email, full_name),
      book:book(Title)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
  
  return (data as unknown as ReservationRow[]).map((res) => ({
    id: res.id,
    bookTitle: res.book?.Title || "Unknown Book",
    userEmail: res.user?.email || "Unknown User",
    userName: res.user?.full_name || res.user?.email?.split('@')[0] || "N/A",
    reserveDate: new Date(res.created_at).toLocaleDateString(),
    requestedDate: new Date(res.reservation_date).toLocaleDateString(),
    status: res.status
  }));
}

export async function updateReservationStatus(id: string, newStatus: 'fulfilled' | 'cancelled') {
  const supabase = await createClient();

  const { data: reservation } = await supabase
    .from('reservations')
    .select('*, book:book(Title)')
    .eq('id', id)
    .single();

  if (!reservation) return { error: "Reservation not found" };

  const { error: updateError } = await supabase
    .from('reservations')
    .update({ status: newStatus })
    .eq('id', id);

  if (updateError) {
    console.error(`Error updating reservation ${id}:`, updateError);
    return { error: "Failed to update reservation status" };
  }

  if (newStatus === 'fulfilled') {
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); 

    const { error: borrowError } = await supabase.from('borrowings').insert({
      user_id: reservation.user_id,
      book_id: reservation.book_id,
      borrow_date: borrowDate.toISOString(),
      due_date: dueDate.toISOString(),
      status: 'borrowed'
    });

    if (borrowError) {
      console.error("Error creating borrowing record:", borrowError);
      return { error: "Reservation updated, but failed to create borrowing record." };
    }

    const { error: bookError } = await supabase
      .from('book')
      .update({ status: 'borrowed' })
      .eq('id', reservation.book_id);

    if (bookError) {
      console.error("Error updating book status:", bookError);
    }
  }

  const message = newStatus === 'fulfilled' 
    ? `Your reservation for "${reservation.book?.Title}" has been processed. You have borrowed this book until ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
    : `We're sorry. Your reservation for "${reservation.book?.Title}" has been declined.`;

  await supabase.from('notifications').insert({
    user_id: reservation.user_id,
    title: newStatus === 'fulfilled' ? 'Book Borrowed' : 'Reservation Declined',
    message: message,
    is_read: false
  });

  revalidatePath('/admin/reservations');
  revalidatePath('/admin/borrowed'); 
  revalidatePath('/protected/dashboard');
}
