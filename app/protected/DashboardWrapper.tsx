"use client";
import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNavBar from '@/components/ui/DashboardNavbar';
import DashboardContent from './DashboardContent';
import { FilterModal } from '@/components/ui/FilterModal'; 
import { FilterState, DashboardWrapperProps, PAGE_SIZE } from '@/type/Index';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({ currentPage, totalPages, onPageChange, totalBooks }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalBooks: number;
}) => {
  if (totalPages <= 1) return null;

  const getPages = (current: number, total: number) => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total) {
      if (endPage < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  };

  const pages = getPages(currentPage, totalPages);
  const startBook = (currentPage - 1) * PAGE_SIZE + 1;
  const endBook = Math.min(currentPage * PAGE_SIZE, totalBooks);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-gray-200 mt-6">
      <div className="text-sm text-gray-600 mb-4 sm:mb-0">
        Showing <span className="font-semibold text-gray-900">{startBook}</span> to <span className="font-semibold text-gray-900">{endBook}</span> of <span className="font-semibold text-gray-900">{totalBooks}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex space-x-1">
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    page === currentPage
                      ? 'bg-accent-teal text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function DashboardWrapper({ email, userId, booksResponse }: DashboardWrapperProps) {
  const { books, currentPage, totalPages, totalBooks } = booksResponse;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get('search') || searchParams.get('q') || '';
  const currentGenre = searchParams.get('genre') || '';
  const currentSort = searchParams.get('sort') || '';
  
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const hasActiveFilters = useMemo(() => {
    return !!(currentGenre || currentSort || currentSearch);
  }, [currentGenre, currentSort, currentSearch]);

  const updateFilters = (updates: {
    search?: string;
    genre?: string;
    sort?: string;
    page?: number; 
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    const isFilterUpdate = updates.search !== undefined || updates.genre !== undefined || updates.sort !== undefined;

    if (updates.search !== undefined) {
      if (updates.search.trim()) {
        params.set('search', updates.search.trim());
        params.delete('q');
      } else {
        params.delete('search');
        params.delete('q');
      }
    }
    
    if (updates.genre !== undefined) {
      if (updates.genre && updates.genre !== 'all') {
        params.set('genre', updates.genre);
      } else {
        params.delete('genre');
      }
    }
    
    if (updates.sort !== undefined) {
      if (updates.sort) {
        params.set('sort', updates.sort);
      } else {
        params.delete('sort');
      }
    }

    if (isFilterUpdate) {
        params.delete('page');
    } else if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set('page', updates.page.toString());
      } else {
        params.delete('page');
      }
    }
    
    router.push(`/protected?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const handleApplyFilters = (filters: FilterState) => {
    updateFilters({ 
      genre: filters.genre,
      sort: filters.sortBy 
    });
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    router.push('/protected');
  };
  
  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };
  
  const toggleMobileSearch = () => {
    setIsSearchExpanded(prev => !prev);
  };
  
  if (booksResponse.error) {
    return (
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0 z-50">
             <DashboardNavBar 
              email={email}
              userId={userId}
              onMobileSearchToggle={() => {}} 
              onSearchSubmit={(e) => e.preventDefault()}
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
            <div className="text-center">
                <h3 className="text-lg font-medium text-red-600 mb-2">Error Fetching Books</h3>
                <p className="text-gray-600">{booksResponse.error}</p>
            </div>
          </div>
        </div>
    )
  }
  
  const currentBooks = booksResponse.books;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
          <DashboardNavBar 
          email={email}
          userId={userId}
          onMobileSearchToggle={toggleMobileSearch}
          onSearchSubmit={handleSearchSubmit}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />
        
        {isSearchExpanded && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex items-center w-full bg-gray-50 p-2 rounded-lg text-gray-600 border border-gray-200 focus-within:ring-2 focus-within:ring-accent-teal">
                <input
                  type="text"
                  placeholder="Search books by title, author..."
                  className="flex-grow bg-transparent outline-none px-3 text-sm text-gray-800"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="p-1 text-gray-500 hover:text-accent-teal"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Available Books</h1>
            <p className="text-gray-600 mt-1">
              {totalBooks === 0 
                ? "No books found" 
                : `${totalBooks} book${totalBooks !== 1 ? 's' : ''} available${hasActiveFilters ? ' (filtered)' : ''}`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear filters
              </button>
            )}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {currentBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-300 mb-4 flex justify-center">
                 <Search className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No books found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "No books are currently available in the library."
                }
              </p>
              {hasActiveFilters && (
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-accent-teal text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  View All Books
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <DashboardContent 
              books={currentBooks}
            />
            
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalBooks={totalBooks}
              />
            )}
          </>
        )}
      </main>

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters}
        initialGenre={currentGenre}
        initialSort={currentSort}
      />
    </div>
  );
}