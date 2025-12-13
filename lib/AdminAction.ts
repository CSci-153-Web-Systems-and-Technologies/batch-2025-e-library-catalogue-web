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
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const fullName = formData.get("fullName") as string;
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath('/admin');
  redirect('/admin/settings');
}
export async function getAdminStats() {
  const supabase = await createClient();

  const { count: totalBooks } = await supabase
    .from('book')
    .select('*', { count: 'exact', head: true });

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member');

  const { count: activeReservations } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: borrowedBooks } = await supabase
    .from('borrowings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'borrowed');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count: newBooks } = await supabase
    .from('book')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  const { count: newUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member')
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    totalBooks: totalBooks || 0,
    totalUsers: totalUsers || 0,
    activeReservations: activeReservations || 0,
    borrowedBooks: borrowedBooks || 0,
    newBooks: newBooks || 0,
    newUsers: newUsers || 0,
  };
}
export async function getRecentActivity() {
  const supabase = await createClient();

  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      created_at,
      user:profiles(full_name, email),
      book:book(Title)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: borrowings } = await supabase
    .from('borrowings')
    .select(`
      created_at,
      status,
      user:profiles(full_name, email),
      book:book(Title)
    `)
    .order('created_at', { ascending: false })
    .limit(5);


  interface ActivityItem {
    created_at: string;
    user: { full_name: string; email: string } | null;
    book: { Title: string } | null;
    status?: string;
  }

  const activities = [
    ...(reservations || []).map((r: unknown) => {
      const res = r as ActivityItem;
      return {
        type: 'reserved',
        user: res.user?.full_name || res.user?.email?.split('@')[0] || 'Unknown User',
        book: res.book?.Title || 'Unknown Book',
        time: new Date(res.created_at),
      };
    }),
    ...(borrowings || []).map((b: unknown) => {
      const bor = b as ActivityItem;
      return {
        type: bor.status === 'returned' ? 'returned' : 'borrowed',
        user: bor.user?.full_name || bor.user?.email?.split('@')[0] || 'Unknown User',
        book: bor.book?.Title || 'Unknown Book',
        time: new Date(bor.created_at),
      };
    })
  ];

  return activities
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5)
    .map(act => ({
      ...act,
      timeAgo: getTimeAgo(act.time)
    }));
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export async function markBookReturned(formData: FormData) {
  const supabase = await createClient();

  const borrowingId = formData.get("borrowingId") as string;
  if (!borrowingId) throw new Error("Missing borrowing ID");

  
  const { data: borrowing, error: fetchError } = await supabase
    .from("borrowings")
    .select("id, book_id, status")
    .eq("id", borrowingId)
    .single();

  if (fetchError || !borrowing) {
    console.error("Fetch error:", fetchError);
    throw new Error(`Borrowing record not found: ${fetchError?.message || 'Unknown error'}`);
  }

  if (borrowing.status === "returned") {
    throw new Error("This book has already been returned");
  }


  const { error: borrowError } = await supabase
    .from("borrowings")
    .update({
      status: "returned",
      return_date: new Date().toISOString(),
    })
    .eq("id", borrowingId);

  if (borrowError) {
    console.error("Borrowing update error details:", {
      message: borrowError.message,
      details: borrowError.details,
      hint: borrowError.hint,
      code: borrowError.code,
    });
    throw new Error(`Failed to update borrowing status: ${borrowError.message}`);
  }

  const { error: bookError } = await supabase
    .from("book")
    .update({ status: "available" })
    .eq("id", borrowing.book_id);

  if (bookError) {
    console.error("Book update error details:", {
      message: bookError.message,
      details: bookError.details,
      hint: bookError.hint,
      code: bookError.code,
    });
    throw new Error(`Failed to update book status: ${bookError.message}`);
  }

  revalidatePath("/admin/borrowed");
  revalidatePath("/admin/books");
  revalidatePath("/protected/dashboard");
  
  return { success: true };
}