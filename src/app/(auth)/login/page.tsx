'use client'

import { AuthForm } from '../components/auth-form'
import { AuthLayout } from '../components/layout'
import { useState } from 'react'
import { handleEmailLogin } from '@/lib/server/auth/mutations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import { UserData } from '@/lib/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, refresh, setUser } = useUser()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await toast.promise(
        (async () => {
          const result = await handleEmailLogin(new FormData(event.currentTarget))
          if (result.success) {
            const userData: UserData = {
              ...result.user,
              picture: result.user.picture || undefined
            }
            setUser(userData)
            await refresh()
            router.push('/dashboard')
          }
          return result
        })(),
        {
          loading: 'Signing in...',
          success: 'Welcome back!',
          error: (err) => err instanceof Error ? err.message : 'Invalid email or password'
        }
      )
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account"
    >
      <AuthForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  )
}

