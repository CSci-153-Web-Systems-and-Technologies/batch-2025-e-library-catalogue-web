// app/protected/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { Book, ProtectedPageProps, PAGE_SIZE, BooksResponse } from '@/type/Index'
import DashboardWrapper from './DashboardWrapper'

export default async function ProtectedPage({ searchParams }: ProtectedPageProps) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authData?.user || !authData.user.email) {
    redirect('/auth/login')
  }

  const userEmail = authData.user.email
  
  const params = await searchParams
  const search = params?.search || params?.q || ''
  const genre = params?.genre || ''
  const sort = params?.sort || ''
  const page = parseInt(params?.page || '1') 
  const currentPage = page > 0 ? page : 1
  
  const from = (currentPage - 1) * PAGE_SIZE
  const to = currentPage * PAGE_SIZE - 1
  
  let query = supabase
    .from('book') 
    .select(`
      id,
      isbn:"ISBN-13",
      title:Title,
      author:Author,
      genre:"Genre (Subject)",
      location:"Location (Call Number)",
      description:"Description / Notes",
      created_at,
      status
    `, { count: 'exact' }) // <--- ADDED status to selection
  
  if (search) {
    query = query.or(
      `Title.ilike.%${search}%,` +
      `Author.ilike.%${search}%,` +
      `"Genre (Subject)".ilike.%${search}%,` +
      `"Location (Call Number)".ilike.%${search}%`
    )
  }
  
  if (genre && genre !== 'all') {
    query = query.eq('"Genre (Subject)"', genre)
  }
  
  switch (sort) {
    case 'title-asc': query = query.order('Title', { ascending: true }); break;
    case 'title-desc': query = query.order('Title', { ascending: false }); break;
    case 'author-asc': query = query.order('Author', { ascending: true }); break;
    case 'author-desc': query = query.order('Author', { ascending: false }); break;
    case 'newest': query = query.order('created_at', { ascending: false }); break;
    case 'oldest': query = query.order('created_at', { ascending: true }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  query = query.range(from, to)
  
  const { data: books, error: booksError, count: totalBooks } = await query
  
  if (booksError) {
    console.error('Error fetching books:', booksError)
  }

  const total = totalBooks ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  
  const allBooks: Book[] = (books || []).map((book: any) => ({
    id: book.id,
    isbn: book.isbn || 0,
    title: book.title || 'Untitled',
    author: book.author || 'Unknown',
    genre: book.genre || 'Uncategorized',
    location: book.location || 'Unknown',
    description: book.description || '',
    status: book.status || 'available' // <--- Map Status
  }))
  
  const booksResponse: BooksResponse = {
    books: allBooks,
    currentPage: currentPage,
    totalPages: totalPages,
    totalBooks: total,
    error: booksError?.message
  }

  return (
    <div className="flex flex-col min-h-svh w-full bg-gray-50">
      <DashboardWrapper
        userId={authData.user.id}
        email={userEmail}
        booksResponse={booksResponse} 
      />
    </div>
  )
}