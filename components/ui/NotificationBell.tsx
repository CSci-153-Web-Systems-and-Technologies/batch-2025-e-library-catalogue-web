"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();


  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    if (userId) fetchNotifs();


    const channel = supabase
      .channel("student-notifs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);


  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      
     
      <PopoverTrigger asChild>
        <button 
          className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors outline-none active:scale-95 duration-200"
          title="Notifications"
        >
          <Bell className="h-6 w-6" />
          
         
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      </PopoverTrigger>
      
      
      <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-gray-100 bg-white">
        
    
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
          <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
              {unreadCount} New
            </span>
          )}
        </div>
        
       
        <div className="max-h-[300px] overflow-y-auto min-h-[100px]">
          {notifications.length === 0 ? (
            
          
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
            </div>

          ) : (
           
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => !notif.is_read && markRead(notif.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notif.is_read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div>
                    <p className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}