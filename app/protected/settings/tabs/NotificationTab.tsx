"use client";

import React from 'react';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsTab({ notifications = [] }: { notifications?: any[] }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      

      <Card className="border-gray-100 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be updated.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
             <div className="space-y-1">
               <h4 className="text-sm font-medium text-gray-900">Reservation Updates</h4>
               <p className="text-xs text-gray-500">Get notified when your book requests are approved.</p>
             </div>
             <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>History of alerts sent by the Admin.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No notifications yet.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
