"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: 'Overview', href: '/admin' },
  { name: 'Book Management', href: '/admin/books' },
  { name: 'Reservation', href: '/admin/reservations' },
  { name: 'Borrowed Books', href: '/admin/borrowed' },
  { name: 'Reports', href: '/admin/reports' },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200/50 pb-1 mb-8">
      {tabs.map((tab) => {
        
        const isActive = tab.href === '/admin' 
          ? pathname === '/admin'
          : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm",
              isActive 
                ? "bg-[#60A5FA] text-white shadow-blue-200" // Active Blue Style
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}