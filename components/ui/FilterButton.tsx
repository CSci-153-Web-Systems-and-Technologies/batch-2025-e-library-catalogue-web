"use client";
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FilterButtonProps {
    onClick: () => void;
}

export const FilterButton = ({ onClick }: FilterButtonProps) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1 bg-accent-teal text-white border-accent-teal rounded-full text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
    >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
    </button>
);