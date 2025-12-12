"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FilterModalProps } from '@/type/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FilterModal({ 
  isOpen, 
  onClose, 
  onApply, 
  initialGenre = '', 
  initialSort = '' 
}: FilterModalProps) {
  const [genre, setGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);

  useEffect(() => {
    if (isOpen) {
      setGenre(initialGenre || '');
      setSortBy(initialSort || '');
    }
  }, [isOpen, initialGenre, initialSort]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ genre, sortBy });
  };

  const handleReset = () => {
    setGenre('');
    setSortBy('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Filter Books</h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium text-gray-700">
                Genre
              </Label>
              <Input
                id="genre"
                type="text"
                placeholder="e.g. Fiction, History, Science"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-white border-gray-300 focus:border-accent-teal focus:ring-accent-teal"
              />
              <p className="text-xs text-gray-500">
                Matches exact genre name from the database.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort By
              </Label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal bg-white text-gray-900"
                >
                  <option value="">Default (Newest)</option>
                  <option value="newest">Newest Added</option>
                  <option value="oldest">Oldest Added</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="author-asc">Author (A-Z)</option>
                  <option value="author-desc">Author (Z-A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-red-600 font-medium px-2 py-1 transition-colors"
            >
              Reset Filters
            </button>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
               className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}