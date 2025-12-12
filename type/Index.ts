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
