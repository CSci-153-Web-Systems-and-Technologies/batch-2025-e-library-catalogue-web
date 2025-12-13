import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import DashboardNavBar from '@/components/ui/DashboardNavbar';
import { getStudentStats, getStudentActivity } from '@/lib/StudentAction';
import { StatCard } from '@/components/ui/dashboard/StatCard';
import { ActivitySection } from '@/components/ui/dashboard/ActivitySection';
import { BookOpen, Calendar, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Check Authentication
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }

  // 2. Fetch Dashboard Data
  const stats = await getStudentStats(user.id);
  const activities = await getStudentActivity(user.id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      
      {/* Navbar */}
      <DashboardNavBar 
        email={user.email || ''} 
        userId={user.id} 
        showSearch={false} // Search is usually for the library, not personal dashboard
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.email?.split('@')[0]}! Here is your library overview.</p>
        </div>

        {/* 1. Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Currently Borrowed" 
            value={stats.currentlyBorrowed} 
            icon={<BookOpen className="h-6 w-6 text-blue-600" />} 
            colorClass="bg-blue-50"
          />
          <StatCard 
            label="Active Reservations" 
            value={stats.activeReservations} 
            icon={<Calendar className="h-6 w-6 text-amber-600" />} 
            colorClass="bg-amber-50"
          />
          <StatCard 
            label="Books Read" 
            value={stats.booksRead} 
            icon={<CheckCircle className="h-6 w-6 text-green-600" />} 
            colorClass="bg-green-50"
          />
        </div>

        {/* 2. Recent Activity Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <ActivitySection activities={activities} />
        </div>

      </main>
    </div>
  );
}