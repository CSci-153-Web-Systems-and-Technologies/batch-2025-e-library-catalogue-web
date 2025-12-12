"use client";

import React, { useRef, useState } from 'react';
import { Camera, Save, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateStudentProfile } from '@/lib/StudentAction';
import { createClient } from '@/lib/client';

interface ProfileTabProps {
  userEmail: string;
  profile: any;
}

export default function ProfileTab({ userEmail, profile }: ProfileTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fullName = profile?.full_name || '';
  const splitName = fullName.split(' ');
  const defaultFirstName = splitName[0] || '';
  const defaultLastName = splitName.slice(1).join(' ') || '';

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={updateStudentProfile} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <input type="hidden" name="avatarUrl" value={avatarUrl} />

      {/* Header Card */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-400"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : userEmail[0].toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-[-6px] right-[-6px] p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-md cursor-pointer z-10"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
            
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name || 'Student Profile'}</h2>
            <p className="text-gray-500">Manage your personal information and student details.</p>
          </div>
        </div>
      </Card>

      {/* Details Card */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>This information will be displayed on your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input name="firstName" id="firstName" defaultValue={defaultFirstName} placeholder="e.g. Jane" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input name="lastName" id="lastName" defaultValue={defaultLastName} placeholder="e.g. Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input id="email" value={userEmail} disabled className="pl-10 bg-gray-50 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
