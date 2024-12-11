'use client'

import { useState } from 'react'
import { handleEmailLogin } from '@/lib/server/auth/mutations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import { UserData } from '@/lib/auth'
import { motion } from 'framer-motion'
import { AuthForm } from '../components/auth-form'
import { AuthQuote } from '../components/auth-quote'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <main className="flex flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="w-full max-w-[350px] space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-400">Sign in to your account</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AuthForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        </motion.div>

        <AuthQuote />
      </main>
    </div>
  )
}

