'use client'

import { useState } from 'react'
import { AuthForm } from '../components/auth-form'
import { AuthLayout } from '../components/layout'
import { handleRegister } from '@/lib/server/auth/mutations'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const password = formData.get('password')?.toString()
      const confirmPassword = formData.get('confirmPassword')?.toString()

      if (password !== confirmPassword) {
        toast.error("Passwords don't match")
        return
      }

      await toast.promise(
        handleRegister(formData),
        {
          loading: 'Creating your account...',
          success: 'Account created successfully!',
          error: (err) => err instanceof Error ? err.message : 'Registration failed'
        }
      )
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Sign up to get started"
    >
      <AuthForm 
        isRegister={true} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  )
}

