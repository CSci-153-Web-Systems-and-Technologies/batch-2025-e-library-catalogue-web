"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${colorClass}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}