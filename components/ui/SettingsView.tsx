"use client";

import React, { useState } from 'react';
import { User, Lock, Bell, Mail, Shield, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsViewProps {
  userEmail: string;
}

export default function SettingsView({ userEmail }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      
      <aside className="lg:w-64 flex-shrink-0 space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
            activeTab === 'profile' 
              ? 'bg-teal-50 text-teal-700 shadow-sm' 
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
            activeTab === 'security' 
              ? 'bg-teal-50 text-teal-700 shadow-sm' 
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
            activeTab === 'notifications' 
              ? 'bg-teal-50 text-teal-700 shadow-sm' 
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications
        </button>
      </aside>

      <div className="flex-1 space-y-6">
        
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-400"></div>
               <div className="px-8 pb-8">
                 <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                          {userEmail[0].toUpperCase()}
                        </div>
                      </div>
                      <button className="absolute bottom-[-6px] right-[-6px] p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-md">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                 </div>
                 
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
                   <p className="text-gray-500">Manage your personal information and student details.</p>
                 </div>
               </div>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>This information will be displayed on your profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="e.g. Jane" defaultValue="" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="e.g. Doe" defaultValue="" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input id="email" value={userEmail} disabled className="pl-10 bg-gray-50 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Student Role</Label>
                  <Input id="bio" placeholder="e.g. Computer Science Student" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Manage your password and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                   <div className="space-y-0.5">
                     <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                     <p className="text-xs text-gray-500">Update your password regularly to keep your account secure.</p>
                   </div>
                   <Button variant="outline" className="border-gray-200">Update Password</Button>
                </div>

                <div className="flex items-center justify-between py-2">
                   <div className="space-y-0.5">
                     <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                     <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                   </div>
                   <Switch />
                </div>

              </CardContent>
            </Card>

            <Card className="border-red-100 bg-red-50/30 shadow-none">
              <CardHeader>
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
                <CardDescription className="text-red-500/80">Irreversible actions regarding your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-reservations" className="flex flex-col gap-1 font-normal">
                      <span className="font-medium text-gray-900">Reservation Updates</span>
                      <span className="text-xs text-gray-500">Receive emails when your reservation is confirmed or ready.</span>
                    </Label>
                    <Switch id="notif-reservations" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-due" className="flex flex-col gap-1 font-normal">
                      <span className="font-medium text-gray-900">Due Date Reminders</span>
                      <span className="text-xs text-gray-500">Get reminded 3 days before books are due.</span>
                    </Label>
                    <Switch id="notif-due" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-news" className="flex flex-col gap-1 font-normal">
                      <span className="font-medium text-gray-900">Library Newsletter</span>
                      <span className="text-xs text-gray-500">Weekly updates about new book arrivals.</span>
                    </Label>
                    <Switch id="notif-news" />
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}