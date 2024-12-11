/**
 * @author Remco Stoeten
 * @description User context provider that manages authentication state
 */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserData } from '@/lib/auth'

type UserContextType = {
  user: UserData | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
  setUser: (user: UserData | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
  setUser: () => {}
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  useEffect(() => {
    refresh()
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
    router.push('/login')
  }

  return (
    <UserContext.Provider value={{ user, loading, logout, refresh, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) 