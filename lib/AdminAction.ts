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
