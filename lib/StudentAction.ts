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