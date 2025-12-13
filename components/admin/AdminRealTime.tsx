"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client"; 
import { getAdminStats, getRecentActivity } from "@/lib/AdminAction";
import Link from "next/link";
import { 
  BookOpen, Users, Calendar, AlertCircle, PlusCircle, UserPlus, 
  Clock, CheckCircle, Plus 
} from "lucide-react";


function StatCard({ label, value, icon: Icon, bgClass, textClass = "text-slate-900" }: any) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${bgClass} shadow-sm transition-transform hover:scale-105`}>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Icon className={`h-5 w-5 ${textClass}`} />
          <span className={`text-sm font-semibold ${textClass}`}>{label}</span>
        </div>
        <div>
          <span className={`text-3xl font-black tracking-tighter ${textClass}`}>{value}</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>
    </div>
  );
}

function ActivityItem({ type, book, user, timeAgo }: any) {
  let icon, iconBg, borderColor;

  if (type === 'reserved') {
    icon = <Calendar className="h-5 w-5 text-fuchsia-600" />;
    iconBg = "bg-fuchsia-100";
    borderColor = "border-l-4 border-l-fuchsia-500";
  } else if (type === 'borrowed') {
    icon = <Clock className="h-5 w-5 text-amber-600" />;
    iconBg = "bg-amber-100";
    borderColor = "border-l-4 border-l-amber-500";
  } else {
    icon = <CheckCircle className="h-5 w-5 text-green-600" />;
    iconBg = "bg-green-100";
    borderColor = "border-l-4 border-l-green-500";
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 ${borderColor} transition-all hover:shadow-md animate-in slide-in-from-left-2 duration-300`}>
      <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900 capitalize">{type}:</span> 
          {" "}{book}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-medium text-gray-500">by {user}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}


export default function RealTimeDashboard({ initialStats, initialActivities }: any) {
  const [stats, setStats] = useState(initialStats);
  const [activities, setActivities] = useState(initialActivities);
  const supabase = createClient();

  const refreshData = async () => {
    console.log("Change detected! Refreshing data...");
    const newStats = await getAdminStats();
    const newActivities = await getRecentActivity();
    setStats(newStats);
    setActivities(newActivities);
  };

  useEffect(() => {

    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'book' }, refreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, refreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'borrowings' }, refreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refreshData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-10">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Books" value={stats.totalBooks} icon={BookOpen} bgClass="bg-[#60A5FA]" />
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} bgClass="bg-[#4ADE80]" />
        <StatCard label="Active Res." value={stats.activeReservations} icon={Calendar} bgClass="bg-[#E879F9]" />
        <StatCard label="Overdue Books" value={stats.borrowedBooks} icon={AlertCircle} bgClass="bg-[#F87171]" />
        <StatCard label="New Books" value={stats.newBooks} icon={PlusCircle} bgClass="bg-[#22D3EE]" />
        <StatCard label="New Users" value={stats.newUsers} icon={UserPlus} bgClass="bg-[#FACC15]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        

        <div className="lg:col-span-2 shadow-sm rounded-3xl overflow-hidden border border-gray-100 bg-white min-h-[400px]">
          <div className="bg-[#1D4ED8] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white tracking-wide">Recent Activity</h2>
            </div>
       
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/50 border border-blue-400 text-xs text-white font-bold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              LIVE
            </span>
          </div>
          
          <div className="p-6 bg-gray-50/50 h-full space-y-3">
            {activities.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                <Clock className="h-12 w-12 mb-3 opacity-20" />
                <p>No recent activity found.</p>
              </div>
            ) : (
              activities.map((act: any, i: number) => (
                <ActivityItem key={i} {...act} />
              ))
            )}
          </div>
        </div>


        <div className="shadow-sm rounded-3xl overflow-hidden border border-gray-100 bg-white h-fit">
          <div className="bg-[#D946EF] px-6 py-5 flex items-center gap-3">
            <PlusCircle className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white tracking-wide">Quick Action</h2>
          </div>
          
          <div className="p-6 space-y-4 bg-white">
            <Link 
              href="/admin/books/addbook" 
              className="group w-full flex items-center justify-between p-4 bg-[#06B6D4] hover:opacity-90 text-white rounded-xl shadow-md transition-all"
            >
              <span className="font-bold text-lg">Add New Book</span>
              <div className="bg-white/20 p-1.5 rounded-full">
                <Plus className="h-5 w-5 text-white" />
              </div>
            </Link>
            
            <Link 
              href="/admin/borrowed" 
              className="group w-full flex items-center justify-between p-4 bg-[#F87171] hover:opacity-90 text-white rounded-xl shadow-md transition-all"
            >
              <span className="font-bold text-lg">View Overdue Books</span>
              <div className="bg-white/20 p-1.5 rounded-full">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}