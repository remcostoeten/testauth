'use client'

import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import React from 'react'
import UserMenu from './user-menu'

export default function Header() {
  const pathname = usePathname()
  const { user, loading } = useUser()
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  if (isAuthPage || loading) {
    return null
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
      <div className="flex items-center gap-6">
        <Link href={user ? "/dashboard" : "/"} className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <Link 
          href="/docs" 
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Documentation
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <UserMenu />
        ) : (
          <Button
            variant="ghost"
            className="text-sm text-zinc-400 hover:text-zinc-100"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  )
}

