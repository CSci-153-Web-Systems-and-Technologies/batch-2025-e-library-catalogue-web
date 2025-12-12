// components/logout-button.tsx

"use client";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/client'; // Import the corrected client utility

// Define the props interface to accept 'className', fixing the TS error
interface LogoutButtonProps {
  className?: string; 
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Initialize the Supabase Client
    const supabase = createClient();
    
    // 2. Perform the sign-out operation
    const { error } = await supabase.auth.signOut(); 
    
    if (error) {
        console.error('Logout error:', error);
    }

    // 3. Refresh the page. This will trigger the logic in app/protected/page.tsx
    // causing a redirect to /auth/login after the session is cleared.
    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      // Apply default styles and the custom className prop
      className={`
        text-gray-700 hover:text-red-600 transition-colors 
        ${className || ''} 
      `}
    >
      Log out
    </button>
  );
}