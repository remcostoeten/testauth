/**
 * @author Remco Stoeten
 * @description Server queries for data fetching
 */

'use server'

import { getSession, requireAuth } from '@/lib/session'

export async function getCurrentUser() {
  return await requireAuth()
}

export async function getSessionData() {
  return await getSession()
} 