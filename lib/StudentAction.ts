"use server";

import { createClient } from '@/lib/server';
import { revalidatePath } from "next/cache";

export async function getBookBusyDates(bookId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reservations')
    .select('reservation_date')
    .eq('book_id', bookId)
    .neq('status', 'cancelled');

  return data?.map(d => new Date(d.reservation_date).toISOString().split('T')[0]) || [];
}

export async function reserveBook(bookId: string, date: Date) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const dateStr = date.toISOString().split('T')[0];
  
  const { data: existing } = await supabase
    .from('reservations')
    .select('id')
    .eq('book_id', bookId)
    .eq('reservation_date', dateStr)
    .neq('status', 'cancelled')
    .single();

  if (existing) {
    return { error: "This date is already reserved by someone else." };
  }
  const { error } = await supabase.from('reservations').insert({
    user_id: user.id,
    book_id: bookId,
    reservation_date: dateStr,
    status: 'pending'
  });

  if (error) {
    console.error("Reservation error:", error);
    return { error: "Failed to create reservation" };
  }

  revalidatePath('/protected/dashboard');
  return { success: true };
}

export async function placeHold(bookId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { count } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId)
    .eq('status', 'pending'); 

  if (count && count > 0) {
    return { error: "This book is already on hold for another student." };
  }

  const { error } = await supabase.from('reservations').insert({
    user_id: user.id,
    book_id: bookId,
    reservation_date: new Date().toISOString().split('T')[0], 
  });

  if (error) {
    console.error("Hold error:", error);
    return { error: "Failed to place hold." };
  }

  revalidatePath('/protected/dashboard');
  return { success: true };
}

export async function getStudentStats(userId: string) {
  const supabase = await createClient();

  const { count: borrowedCount } = await supabase
    .from('borrowings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'borrowed');

  const { count: reservedCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  const { count: readCount } = await supabase
    .from('borrowings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'returned');

  return {
    currentlyBorrowed: borrowedCount || 0,
    activeReservations: reservedCount || 0,
    booksRead: readCount || 0
  };
}

export async function getStudentActivity(userId: string) {
  const supabase = await createClient();

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*, book:book(Title, Author, "Genre (Subject)")')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: borrowings } = await supabase
    .from('borrowings')
    .select('*, book:book(Title, Author, "Genre (Subject)")')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  interface RawReservation {
    created_at: string;
    status: string;
    book: { Title: string; Author: string; "Genre (Subject)": string } | null;
  }

  interface RawBorrowing {
    created_at: string;
    status: string;
    book: { Title: string; Author: string; "Genre (Subject)": string } | null;
    due_date?: string;
  }


  const activityList = [
    ...(reservations || []).map((r) => {
        const item = r as unknown as RawReservation;
        return {
            id: `res-${r.id}`,
            bookId: r.book_id,
            bookTitle: item.book?.Title || 'Unknown Title',
            bookAuthor: item.book?.Author || 'Unknown Author',
            bookGenre: item.book?.["Genre (Subject)"] || 'General',
            status: 'reserved' as const,
            date: new Date(item.created_at).toLocaleDateString(),
            timestamp: new Date(item.created_at).getTime()
        };
    }),
    ...(borrowings || []).map((b) => {
        const item = b as unknown as RawBorrowing;
        return {
            id: `bor-${b.id}`,
            bookId: b.book_id,
            bookTitle: item.book?.Title || 'Unknown Title',
            bookAuthor: item.book?.Author || 'Unknown Author',
            bookGenre: item.book?.["Genre (Subject)"] || 'General',
            status: (item.status === 'returned' ? 'returned' : 'borrowed') as 'returned' | 'borrowed',
            date: item.due_date ? new Date(item.due_date).toLocaleDateString() : new Date(item.created_at).toLocaleDateString(),
            timestamp: new Date(item.created_at).getTime()
        };
    })
  ];

  return activityList.sort((a, b) => b.timestamp - a.timestamp);
}
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({ 
    password: password 
  });

  if (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password");
  }

  revalidatePath('/protected/settings');
}
export async function updateStudentProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const avatarUrl = formData.get("avatarUrl") as string; 
  
  const fullName = `${firstName} ${lastName}`.trim();

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error("Profile update error:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath('/protected/settings');
}
