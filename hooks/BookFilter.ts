'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/type/Index';

export function useBookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get('search') || searchParams.get('q') || '';
  const currentGenre = searchParams.get('genre') || '';
  const currentSort = searchParams.get('sort') || '';
  
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const updateFilters = (updates: { search?: string; genre?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.search !== undefined) {
      updates.search.trim() ? params.set('search', updates.search.trim()) : params.delete('search');
      params.delete('q');
    }
    
    if (updates.genre !== undefined) {
      updates.genre && updates.genre !== 'all' ? params.set('genre', updates.genre) : params.delete('genre');
    }
    
    if (updates.sort !== undefined) {
      updates.sort ? params.set('sort', updates.sort) : params.delete('sort');
    }
    
    router.push(`/protected?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const handleApplyFilters = (filters: FilterState) => {
    updateFilters({ genre: filters.genre, sort: filters.sortBy });
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    router.push('/protected');
  };

  const toggleMobileSearch = () => {
    setIsSearchExpanded(prev => !prev);
  };

  return {
    localSearch,
    setLocalSearch,
    isFilterOpen,
    setIsFilterOpen,
    isSearchExpanded,
    setIsSearchExpanded,
    currentGenre,
    currentSort,
    handleSearchSubmit,
    handleApplyFilters,
    handleClearFilters,
    toggleMobileSearch,
    updateFilters
  };
}