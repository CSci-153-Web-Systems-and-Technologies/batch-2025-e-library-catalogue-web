"use client";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/client'; 

interface LogoutButtonProps {
  className?: string; 
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signOut(); 
    
    if (error) {
        console.error('Logout error:', error);
    }

    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        text-gray-700 hover:text-red-600 transition-colors 
        ${className || ''} 
      `}
    >
      Log out
    </button>
  );
}