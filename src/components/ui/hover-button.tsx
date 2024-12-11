'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type HoverButtonProps = {
  children: React.ReactNode
  shortcut?: string
  onClick?: () => void
  className?: string
  variant?: 'default' | 'dark'
}

export function HoverButton({ 
  children, 
  shortcut, 
  onClick, 
  className,
  variant = 'default'
}: HoverButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const getCursorPosition = (element: Element, event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = event.clientX - centerX
      const y = centerY - event.clientY
      return { x, y }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const { x, y } = getCursorPosition(button, event)
      button.style.setProperty('--coord-x', `${x}px`)
      button.style.setProperty('--coord-y', `${y}px`)
    }

    const handlePointerLeave = () => {
      button.style.setProperty('--coord-x', '0')
      button.style.setProperty('--coord-y', '0')
    }

    button.addEventListener('pointermove', handlePointerMove)
    button.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      button.removeEventListener('pointermove', handlePointerMove)
      button.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        'rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 transition-colors hover:border-zinc-700',
        'before:absolute before:inset-0 before:transition-opacity before:duration-300',
        'before:bg-[radial-gradient(circle_at_calc(50%_+_var(--coord-x,_0px))_calc(50%_+_var(--coord-y,_0px)),theme(colors.emerald.500/0.15)_0%,transparent_100%)]',
        'before:opacity-0 hover:before:opacity-100',
        variant === 'dark' && 'border-zinc-700 bg-zinc-800',
        className
      )}
    >
      <div className="inner flex items-center gap-2">
        {children}
        {shortcut && (
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {shortcut}
          </span>
        )}
      </div>
    </button>
  )
} 