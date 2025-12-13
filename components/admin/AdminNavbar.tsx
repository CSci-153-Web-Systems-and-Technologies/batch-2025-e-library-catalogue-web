"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, LogOut, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import NotificationBell from "@/components/ui/NotificationBell"; 

interface AdminNavbarProps {
  email: string;
  userId: string;
}

export default function AdminNavbar({ email, userId }: AdminNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          

          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-800 leading-none tracking-tight">BookIt</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </div>

  
          <div className="flex items-center gap-4 ml-auto">

            <NotificationBell userId={userId} />
            
            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors outline-none"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-sm">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} alt="Admin" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-tight">Admin</p>
                  <span className="inline-flex items-center text-[10px] font-medium text-cyan-800">
                    Super User <ChevronDown className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{email}</p>
                  </div>
                  
                  <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}