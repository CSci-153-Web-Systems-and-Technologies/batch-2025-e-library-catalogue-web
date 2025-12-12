import { createClient } from "@/lib/server";
import { updateProfile } from "@/lib/AdminAction";
import { User, Mail, Shield, Save } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h2 className="text-2xl font-black text-slate-800">Profile Settings</h2>
        <p className="text-slate-500 font-medium">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[3px] mb-4">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{profile?.full_name || 'Admin User'}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
            
            <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">
              <Shield className="h-3 w-3" />
              {profile?.role || 'Admin'}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Edit Details
            </h3>

            <form action={updateProfile} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ''} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 pl-1">Email cannot be changed.</p>
              </div>


              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input 
                  name="fullName"
                  type="text" 
                  defaultValue={profile?.full_name || ''}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}