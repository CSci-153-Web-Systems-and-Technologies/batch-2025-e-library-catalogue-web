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
    flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full lg:rounded-xl transition-all whitespace-nowrap
    justify-center lg:justify-start w-auto lg:w-full
    ${activeTab === tabName 
      ? 'bg-teal-600 text-white shadow-md lg:bg-teal-50 lg:text-teal-700 lg:shadow-sm' 
      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 lg:border-transparent lg:bg-transparent'}
  `;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
      

      <aside className="lg:w-64 flex-shrink-0">
 
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
          <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button onClick={() => setActiveTab('security')} className={getTabClass('security')}>
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} className={getTabClass('notifications')}>
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>
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