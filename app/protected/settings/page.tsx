import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import DashboardNavBar from '@/components/ui/DashboardNavbar';
import SettingsView from './SettingsView';

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createClient();


  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authData?.user || !authData.user.email) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const params = await searchParams;
  const tab = params?.tab || 'profile';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      
      <DashboardNavBar 
        email={authData.user.email} 
        userId={authData.user.id} 
        showSearch={false} 
      />

      <main className="flex-1 w-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your profile details and preferences.</p>
        </div>

        <SettingsView 
          userEmail={authData.user.email} 
          defaultTab={tab} 
          profile={profile}
          notifications={notifications || []} 
        />
      </main>
    </div>
  );
}