/**
 * @author Remco Stoeten
 * @description Authentication-related server mutations
 */

'use server'

import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function handleLogout() {
  await logout()
  redirect('/login')
}

export async function handleEmailLogin(formData: FormData) {
  'use server'
  
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    throw new Error('Please provide both email and password')
  }

  // TODO: Implement email/password login logic
  // For now, just redirect to show the flow
  redirect('/dashboard')
} 