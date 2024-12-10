/**
 * @author Remco Stoeten
 * @description Global error page
 */

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="space-y-4 text-center">
        <div className="inline-block rounded-full bg-red-500/10 p-3">
          <div className="rounded-full bg-red-500/10 p-2">
            <div className="h-6 w-6 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-medium text-zinc-100">Something went wrong!</h2>
        <p className="text-sm text-zinc-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={reset}
            variant="outline"
            className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-900/80"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 text-white hover:bg-emerald-400"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
} 