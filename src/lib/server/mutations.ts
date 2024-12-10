/**
 * @author Remco Stoeten
 * @description Server mutations for authentication and user management
 */

'use server'

import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function handleLogout() {
  await logout()
  redirect('/login')
} 