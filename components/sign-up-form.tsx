'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, ChevronLeft } from 'lucide-react'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })
      if (error) throw error
      
      router.push('/auth/sign-up-success')
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-row bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#F5E6D3] via-[#F0DCC8] to-[#EBD4BE] items-center justify-center p-8">
        <img
          src="/Background/sideBanner.png"
          alt="Book Reservation"
          className="h-[90vh] w-auto object-contain"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-20 relative">
        <button
          onClick={() => router.push('/')}
          className="hidden lg:flex items-center justify-center absolute left-6 top-6 h-10 w-10 bg-white shadow-md rounded-full border border-gray-200 hover:bg-gray-100 transition"
        >
          <ChevronLeft className="h-6 w-6 text-gray-900" />
        </button>

        <div className="w-full max-w-md flex flex-col items-center" {...props}>
          <BookOpen className="w-24 h-24 text-gray-900 mb-6 mt-2" />
          
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">Sign Up</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Create a new account to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-900 font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-gray-800 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-900 font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-gray-800 text-gray-900"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="text-gray-900 font-semibold">Repeat Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="border-gray-300 focus:border-gray-800 text-gray-900"
                  />
                </div>

                {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

                <Button
                  type="submit"
                  className="w-full text-lg py-5 bg-[#0D1B2A] hover:bg-[#1B263B] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>

                <p className="text-center text-sm mt-4 text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-gray-900 font-semibold underline underline-offset-4 hover:text-blue-700"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}