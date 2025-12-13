import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    redirect('/auth/error?error=Missing confirmation code')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/login?message=Email verified successfully')
}
