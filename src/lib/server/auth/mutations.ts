/**
 * @author Remco Stoeten
 * @description Authentication-related server mutations
 */

'use server'

import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { setUserCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function handleLogout() {
  await logout()
  redirect('/login')
}

export async function handleEmailLogin(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    throw new Error('Please provide both email and password')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    await setUserCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture || undefined
    })

    // Return the user data without the password
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error('Login error:', error)
    throw error instanceof Error ? error : new Error('Authentication failed')
  }
}

export async function handleRegister(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()
  const confirmPassword = formData.get('confirmPassword')?.toString()
  const name = formData.get('name')?.toString().trim()

  if (!email || !password || !name || !confirmPassword) {
    throw new Error('Please provide all required fields')
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    await setUserCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture || undefined
    })

    redirect('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
    throw error instanceof Error ? error : new Error('Registration failed')
  }
} 