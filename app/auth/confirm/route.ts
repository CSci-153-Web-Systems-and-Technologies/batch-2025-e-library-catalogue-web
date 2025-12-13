import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    return redirect('/auth/error?message=Missing verification parameters')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    console.error('Email verification error:', error)
    return redirect(`/auth/error?message=${encodeURIComponent(error.message)}`)
  }

  
  return redirect('/protected/dashboard')
}