/**
 * @author Remco Stoeten
 * @description Utility functions for handling user sessions and authentication
 */

import { getUserFromCookie } from '@/lib/auth'
import type { UserData } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type Session = {
  user: {
    id: string
    name: string
    email: string
    picture?: string
  } | null
  isAuthenticated: boolean
}

/**
 * Get the current session and user data
 * Redirects to login if redirectOnUnauth is true and user is not authenticated
 */
export async function getSession(redirectOnUnauth = false): Promise<Session> {
  const user = await getUserFromCookie() as UserData | null
  
  if (!user && redirectOnUnauth) {
    redirect('/login')
  }

  return {
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    } : null,
    isAuthenticated: !!user
  }
}

/**
 * Get the current user, with type safety
 * Redirects to login if user is not authenticated
 */
export async function getUser() {
  const { user } = await getSession(true)
  if (!user) throw new Error('User not found')
  return user
}

/**
 * Check if user is authenticated
 * Useful for protecting API routes
 */
export async function checkAuth() {
  const { isAuthenticated } = await getSession()
  return isAuthenticated
}

/**
 * Protect a route from unauthenticated access
 * Use this in your page components
 */
export async function requireAuth() {
  const { user } = await getSession(true)
  if (!user) redirect('/login')
  return user
} 