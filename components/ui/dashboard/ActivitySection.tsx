"use client";
import React, { useState } from 'react';
import { ActivityRecord, ActivityStatus } from '@/type/Index';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, Clock, CheckCircle, XCircle, History } from 'lucide-react';

interface ActivitySectionProps {
  activities: ActivityRecord[];
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  const [filter, setFilter] = useState<'borrowed' | 'reserved' | 'history'>('borrowed');

  const filteredActivities = activities.filter((item) => {
    if (filter === 'borrowed') return item.status === 'borrowed';
    if (filter === 'reserved') return item.status === 'reserved';
    if (filter === 'history') return item.status === 'returned' || item.status === 'cancelled';
    return false;
  });

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'borrowed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">Borrowed</span>;
      case 'reserved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Reserved</span>;
      case 'returned':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">Returned</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-lg w-fit">
        <button
          onClick={() => setFilter('borrowed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'borrowed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Currently Borrowed
        </button>
        <button
          onClick={() => setFilter('reserved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'reserved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Reservations
        </button>
        <button
          onClick={() => setFilter('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          History
        </button>
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <BookOpen className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No books found</h3>
            <p className="text-sm text-gray-500 mt-1">You don&apos;t have any items in this category yet.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="group hover:shadow-md transition-all duration-200 border-gray-100 bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className={`sm:h-24 w-full sm:w-1.5 ${
                    activity.status === 'borrowed' ? 'bg-blue-500' : 
                    activity.status === 'reserved' ? 'bg-amber-500' : 'bg-gray-300'
                  }`} />
                  
                  <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{activity.bookGenre}</span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-accent-teal transition-colors">
                        {activity.bookTitle}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium">by {activity.bookAuthor}</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 bg-gray-50/50 px-4 py-3 rounded-lg border border-gray-100 sm:border-0 sm:bg-transparent">
                       <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase">
                                {activity.status === 'borrowed' ? 'Due Date' : activity.status === 'reserved' ? 'Reserved On' : 'Returned On'}
                            </p>
                            <p className="font-medium text-gray-900">{activity.date}</p>
                          </div>
                       </div>
                       
                       <div className="ml-auto sm:ml-0">
                          {activity.status === 'borrowed' && <Clock className="h-5 w-5 text-blue-400" />}
                          {activity.status === 'reserved' && <History className="h-5 w-5 text-amber-400" />}
                          {activity.status === 'returned' && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {activity.status === 'cancelled' && <XCircle className="h-5 w-5 text-gray-400" />}
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}