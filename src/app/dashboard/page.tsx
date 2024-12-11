/**
 * @author Remco Stoeten
 * @description Protected dashboard page with user profile
 */

import { requireAuth } from '@/lib/session'
import { Logo } from '@/components/Logo'
import Image from 'next/image'
import UserMenu from '@/components/user-menu'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full ring-2 ring-zinc-800"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-2xl font-medium text-zinc-400">
                  {user.name[0]}
                </div>
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