'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { FeatureFlag, isFeatureEnabled } from '@/config/features'

type SessionIndicatorProps = {
  className?: string
}

export default function SessionIndicator({ className }: SessionIndicatorProps) {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsVisible(isFeatureEnabled(FeatureFlag.SHOW_SESSION_INDICATOR))
  }, [])

  if (!mounted || !isVisible) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50',
        'transition-transform duration-300 ease-in-out',
        isHovered ? 'scale-105' : '',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Status Indicator */}
        <div
          className={cn(
            'h-4 w-4 rounded-full',
            'transition-all duration-300 ease-in-out',
            'shadow-lg',
            user ? 'bg-green-500' : 'bg-red-500',
            {
              'scale-110 ring-2 ring-offset-2 ring-offset-background': isHovered,
              'ring-green-400': user && isHovered,
              'ring-red-400': !user && isHovered,
            }
          )}
        >
          {/* Pulse Rings */}
          <div className={cn(
            'absolute -inset-1 rounded-full',
            'animate-ping opacity-75',
            user ? 'bg-green-400/60' : 'bg-red-400/60'
          )} />
          <div className={cn(
            'absolute -inset-2 rounded-full',
            'animate-ping opacity-50 animation-delay-200',
            user ? 'bg-green-400/40' : 'bg-red-400/40'
          )} />
        </div>

        {/* Session Details Popup */}
        {isHovered && (
          <div className={cn(
            'absolute bottom-6 right-0',
            'w-72 p-4 rounded-lg',
            'bg-background/95 backdrop-blur-sm',
            'border border-border shadow-xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2',
            'text-sm'
          )}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Session Status</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {user ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {user ? (
                <div className="space-y-2 border-t pt-2">
                  <div className="text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>Email:</span>
                      <span className="font-mono text-xs">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Name:</span>
                      <span className="font-mono text-xs">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ID:</span>
                      <span className="font-mono text-xs">{user.id}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-xs">
                  No active session. Sign in to see session details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 