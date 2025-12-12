export type BookStatus = 'available' | 'borrowed' | 'reserved';

export interface Book {
  id: string;
  isbn: number;
  title: string;
  author: string;
  genre: string;
  location: string;
  description: string;
  status: BookStatus;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialGenre?: string;
  initialSort?: string;
}
export interface FilterState {
  genre?: string;
  sortBy?: string;
}


export type ActivityStatus = 'borrowed' | 'reserved' | 'returned' | 'cancelled';

export interface ActivityRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookGenre: string;
  status: ActivityStatus;
  date: string; 
  image_url?: string;
}
