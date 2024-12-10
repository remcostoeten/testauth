/**
 * @author Remco Stoeten
 * @description Custom 404 Not Found page
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-bold text-zinc-100">404</h1>
        <h2 className="text-xl font-medium text-zinc-300">Page Not Found</h2>
        <p className="text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
} 