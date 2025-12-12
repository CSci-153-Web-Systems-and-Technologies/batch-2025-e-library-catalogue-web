"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { 
  Search, BookOpen, Settings, LogOut, 
  ChevronDown, Menu, X, LayoutDashboard, Library 
} from 'lucide-react'; 
import { LogoutButton } from "@/components/logout-button"; 
import NotificationBell from "@/components/ui/NotificationBell"; 

interface DashboardNavBarProps {
  email: string;
  userId: string; // <--- ADD THIS
  onMobileSearchToggle?: () => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const UserMenu = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { name: "Settings", href: "/protected/settings", icon: Settings },
  ];
  
  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-4 border-b border-gray-50 bg-gray-50/30">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Signed in as</p>
        <p className="text-sm font-bold text-gray-900 truncate">{email}</p>
      </div>
      <div className="p-1.5">
        {menuItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => { router.push(item.href); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-colors group"
          >
            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
            {item.name}
          </button>
        ))}
        <div className="h-px bg-gray-100 my-1" />
        <div className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100">
           <LogOut className="w-4 h-4" />
           <LogoutButton className="text-left w-full text-red-600 hover:text-red-700" />
        </div>
      </div>
    </div>
  );
};

const DashboardNavBar = ({ 
  email, 
  userId, 
  onMobileSearchToggle,
  onSearchSubmit,
  searchValue,
  onSearchChange,
  showSearch = true 
}: DashboardNavBarProps) => { 
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(e);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/protected/dashboard', icon: LayoutDashboard },
    { name: 'Library', path: '/protected', icon: Library }
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            
            <div className="flex items-center gap-8">
              <div
                onClick={() => router.push("/protected")}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity z-50 relative"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white shadow-md shadow-teal-500/20">
                    <BookOpen className="w-5 h-5" /> 
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-900 sm:inline-block">
                  BookIt
                </span>
              </div>

              <nav className="hidden md:flex h-16 gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => router.push(link.path)}
                      className={`
                        relative h-full px-4 text-sm font-medium transition-colors duration-200
                        flex items-center
                        ${isActive ? "text-teal-700" : "text-gray-500 hover:text-gray-900"}
                      `}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {showSearch ? (
              <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 justify-center">
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search books, authors..."
                      className="block w-full pl-10 pr-3 py-2 border-none rounded-full bg-gray-100/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all text-sm"
                      value={searchValue || ''}
                      onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            ) : <div className="flex-1 hidden md:block" />}

            <div className="flex items-center gap-2 sm:gap-3 justify-end">
              {showSearch && (
                <button 
                  onClick={onMobileSearchToggle}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              
              <NotificationBell userId={userId} />
              

              <div className="relative hidden md:block">
                <button 
                  onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition-all ${
                    isDesktopMenuOpen 
                      ? 'border-teal-200 bg-teal-50' 
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center text-white ring-2 ring-white shadow-sm">
                    <span className="text-xs font-semibold">{email?.[0].toUpperCase()}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDesktopMenuOpen && <UserMenu email={email} onClose={() => setIsDesktopMenuOpen(false)} />}
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-900">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { router.push(link.path); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.path ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${pathname === link.path ? "text-teal-600" : "text-gray-400"}`} />
                  {link.name}
                </button>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                  <span className="text-sm font-bold">{email?.[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">{email}</p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
                <button
                  onClick={() => { router.push('/protected/settings'); setIsMobileMenuOpen(false); }}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-gray-200"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <div className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100">
                <LogOut className="h-4 w-4" />
                <LogoutButton className="text-left w-full text-red-600 hover:text-red-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavBar;