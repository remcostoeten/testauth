/**
 * @author Remco Stoeten
 * @description Protected dashboard page with user profile
 */

import { requireAuth } from '@/lib/session'
import { handleLogout } from '@/lib/server/auth/mutations'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Logo } from '@/components/Logo'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <form action={handleLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="text-sm text-zinc-400 hover:text-zinc-100"
          >
            Logout
          </Button>
        </form>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full"
                />
              )}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-100">
              Welcome, {user.name}!
            </h2>
            <p className="mt-2 text-sm text-zinc-400">{user.email}</p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-medium text-zinc-100">Dashboard Overview</h3>
            <p className="mt-2 text-sm text-zinc-400">
              This is a protected page. You can only see this if you&apos;re logged in.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 