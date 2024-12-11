'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  if (isAuthPage) {
    return null
  }

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-zinc-400">Built with</span>
          <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="text-sm text-zinc-400">by</span>
          <Link
            href="https://github.com/RemcoStoeten"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Remco Stoeten
          </Link>
        </div>
      </div>
    </footer>
  )
}

