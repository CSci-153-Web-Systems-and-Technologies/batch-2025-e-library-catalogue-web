import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const supabase = await createClient();


  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  let data: any[] = [];
  let filename = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;

  if (type === 'usage') {
   
    const { data: borrowings } = await supabase
      .from('borrowings')
      .select('*, user:profiles(email), book:book(Title)')
      .order('borrow_date', { ascending: false });
    
    data = borrowings?.map(b => ({
      BorrowID: b.id,
      User: b.user?.email,
      Book: b.book?.Title,
      BorrowedDate: b.borrow_date,
      ReturnedDate: b.return_date || 'Not Returned',
      Status: b.status
    })) || [];

  } else if (type === 'users') {

    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'member');
    
    data = users?.map(u => ({
      ID: u.id,
      Email: u.email,
      Name: u.full_name,
      JoinedDate: u.created_at
    })) || [];

  } else if (type === 'inventory') {
   
    const { data: books } = await supabase
      .from('book')
      .select('*');
    
    data = books?.map(b => ({
      ID: b.id,
      Title: b.Title,
      Author: b.Author,
      Genre: b["Genre (Subject)"],
      ISBN: b["ISBN-13"],
      Status: b.status
    })) || [];

  } else if (type === 'overdue') {
   
    const { data: overdue } = await supabase
      .from('borrowings')
      .select('*, user:profiles(email), book:book(Title)')
      .eq('status', 'overdue'); 
    data = overdue?.map(b => ({
      User: b.user?.email,
      Book: b.book?.Title,
      DueDate: b.due_date,
      DaysLate: Math.floor((new Date().getTime() - new Date(b.due_date).getTime()) / (1000 * 3600 * 24))
    })) || [];
  }

 
  if (data.length === 0) {
    return new NextResponse("No data found for this report", { status: 404 });
  }

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row => 
    Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
  );
  const csv = [headers, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}