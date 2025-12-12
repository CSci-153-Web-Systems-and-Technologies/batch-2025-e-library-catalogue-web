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

export interface DashboardContentProps {
  books: Book[];
}
export interface DashboardWrapperProps {
  email: string;
  userId: string;
  booksResponse: BooksResponse;
}
export const PAGE_SIZE = 12;

export interface BooksResponse {
  books: Book[];
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  error?: string;
}

export interface FilterOptions {
  search?: string;
  genre?: string;
  sort?: string;
}

export interface FilterState {
  genre?: string;
  sortBy?: string;
}
export interface DashboardNavBarProps {
  email: string;
  onMobileSearchToggle?: () => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}
export interface ProtectedPageProps {
  searchParams?: Promise<{
    search?: string;
    genre?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}
export interface UserStats {
  currentlyBorrowed: number;
  activeReservations: number;
  booksRead: number;
}
export interface BookRow {
  id: string;
  Title: string;
  Author: string;
  "Genre (Subject)": string;
  "ISBN-13": number;
  status: string;
  "Location (Call Number)"?: string;
  "Description / Notes"?: string;
  created_at?: string;
}

export interface UserProfileRow {
  email: string;
  full_name: string;
}

export interface BookTitleRow {
  Title: string;
}

export interface ReservationRow {
  id: string;
  status: string;
  reservation_date: string;
  created_at: string;
  user: UserProfileRow | null;
  book: BookTitleRow | null;
}

export interface BorrowingRow {
  id: string;
  status: string;
  borrow_date: string;
  due_date: string;
  user: UserProfileRow | null;
  book: BookTitleRow | null;
}