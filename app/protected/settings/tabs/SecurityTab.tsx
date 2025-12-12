"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePassword } from '@/lib/StudentAction'; 
import { Lock, Save, X } from 'lucide-react';
export default function SecurityTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <Card className="border-gray-100 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>Manage your password and security preferences.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between mb-4">
               <div className="space-y-1">
                 <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                 <p className="text-xs text-gray-500">Update your password regularly to keep your account secure.</p>
               </div>
               
               {!isEditing && (
                 <Button 
                   variant="outline" 
                   onClick={() => setIsEditing(true)}
                   className="text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50"
                 >
                   Update Password
                 </Button>
               )}
            </div>

            {isEditing && (
              <form 
                action={async (formData) => {
                  setLoading(true);
                  try {
                    await updatePassword(formData);
                    setIsEditing(false);
                    alert("Password updated successfully!");
                  } catch (e) {
                    alert("Error updating password.");
                  } finally {
                    setLoading(false);
                  }
                }} 
                className="bg-gray-50 p-6 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        name="password" 
                        id="password" 
                        type="password" 
                        placeholder="Enter new password"
                        className="pl-10 bg-white"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Retype new password" 
                        className="pl-10 bg-white"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                  >
                    {loading ? "Updating..." : "Save New Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="space-y-1">
               <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
               <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
             </div>
             <Switch />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}