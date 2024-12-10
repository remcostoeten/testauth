/**
 * @author Remco Stoeten
 * @description Authentication-related server queries
 */

'use server'

import { getSession, requireAuth } from '@/lib/session'

export async function getCurrentUser() {
  return await requireAuth()
}

export async function getSessionData() {
  return await getSession()
}

export async function checkAuthStatus() {
  const { isAuthenticated } = await getSession()
  return isAuthenticated
} 