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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          router.push('/protected')
          return
        }

        if (profile?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/protected') 
        }
      }
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
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
          <BookOpen className="h-12 w-12 text-gray-900 mb-4"/>
       
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">Login</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                
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
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-900 font-semibold">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-gray-600 hover:text-gray-900"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-gray-800 text-gray-900"
                  />
                </div>
               
                {error && <p className="text-sm text-red-600">{error}</p>}
                
                <Button
                  type="submit"
                  className="w-full text-lg py-5 bg-[#0D1B2A] hover:bg-[#1B263B] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Checking credentials...' : 'Login'}
                </Button>
               
                <p className="text-center text-sm mt-4 text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="text-gray-900 font-semibold underline underline-offset-4 hover:text-blue-700"
                  >
                    Sign up
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