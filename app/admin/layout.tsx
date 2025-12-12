import React from "react";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminNavbar from "@/components/admin/AdminNavbar"; 

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/protected');

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      
      <AdminNavbar email={user.email || 'admin'} userId={user.id} />
      
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your library system</p>
        </div>

        <AdminTabs />
        
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}