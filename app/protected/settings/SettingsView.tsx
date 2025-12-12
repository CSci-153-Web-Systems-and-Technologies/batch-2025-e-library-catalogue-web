"use client";

import React, { useState } from 'react';
import { User, Bell, Shield } from 'lucide-react';
import ProfileTab from './tabs/ProfileTab'; 
import SecurityTab from './tabs/SecurityTab'; 
import NotificationsTab from './tabs/NotificationTab'; 

interface SettingsViewProps {
  userEmail: string;
  defaultTab?: string;
  profile?: any;
  notifications?: any[]; 
}

export default function SettingsView({ 
  userEmail, 
  defaultTab = 'profile', 
  profile,
  notifications = [] 
}: SettingsViewProps) {
  
  const [activeTab, setActiveTab] = useState(defaultTab);

  const getTabClass = (tabName: string) => `
    w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all text-left
    ${activeTab === tabName 
      ? 'bg-teal-50 text-teal-700 shadow-sm' 
      : 'text-gray-600 hover:bg-white hover:text-gray-900'}
  `;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      

      <aside className="lg:w-64 flex-shrink-0 space-y-2">
        <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
          <User className="w-4 h-4" /> Profile
        </button>
        <button onClick={() => setActiveTab('security')} className={getTabClass('security')}>
          <Shield className="w-4 h-4" /> Security
        </button>
        <button onClick={() => setActiveTab('notifications')} className={getTabClass('notifications')}>
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </aside>


      <div className="flex-1 space-y-6">
        
        {activeTab === 'profile' && (
          <ProfileTab userEmail={userEmail} profile={profile} />
        )}

        {activeTab === 'security' && (
          <SecurityTab />
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab notifications={notifications} />
        )}

      </div>
    </div>
  );
}