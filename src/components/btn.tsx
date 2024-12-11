import React, { useState, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type RainbowButtonProps = {
  children: React.ReactNode;
  shortcut?: string;
  variant?: 'light' | 'dark';
  className?: string;
};

export default function RainbowButton({
  children,
  shortcut,
  variant = 'light',
  className
}: RainbowButtonProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = event.clientX - centerX;
      const y = centerY - event.clientY;
      setCoords({ x, y });
    }
  };

  const handlePointerLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      style={{
        '--coord-x': `${coords.x}`,
        '--coord-y': `${coords.y}`,
      } as React.CSSProperties}
      className={cn(
        className,
        'relative overflow-hidden rounded-[0.80em] border',
        'flex items-center justify-center',
        'cursor-pointer text-[var(--color-button)]',
        'transition-all duration-300',
        'hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.16)]',
        variant === 'light'
          ? 'border-transparent text-[hsl(359deg_1%_35%)] bg-[hsl(179deg_7%_97%)]'
          : 'border-[rgba(255,255,255,0.05)] text-[hsl(0deg_0%_66%)] bg-[hsl(0deg_0%_10%)]',
      )}
    >
      <div
        className={cn(
          'inner px-3 py-2 rounded-[0.70em]',
          'flex items-center justify-center gap-3',
          'relative z-10',
          variant === 'light'
            ? 'shadow-[inset_0_2px_1px_rgb(255_255_255_/_90%),_inset_0_-2px_3px_rgb(0_0_0_/_3%)]'
            : 'shadow-[inset_0_2px_3px_rgb(255_255_255_/_1%),_inset_0_-2px_3px_rgb(0_0_0_/_25%)]',
        )}
      >
        {children}
        {shortcut && (
          <span
            className={cn(
              'text-xs px-1 py-0.5 border rounded-md',
              variant === 'light'
                ? 'border-[rgba(0,0,0,0.1)]'
                : 'border-[rgba(255,255,255,0.1)]',
            )}
          >
            {shortcut}
          </span>
        )}
      </div>
      {/* Gradient overlay - only visible on hover */}
      <div
        className={cn(
          'absolute inset-0 -z-0 transition-opacity duration-300',
          'bg-[conic-gradient(from_180deg,_var(--color-red)_0%,_var(--color-orange)_10%,_var(--color-olive)_20%,_var(--color-lime)_30%,_var(--color-teal)_40%,_var(--color-tealer)_50%,_var(--color-blue)_60%,_var(--color-purple)_70%,_var(--color-purpler)_80%,_var(--color-pink)_90%,_var(--color-red)_100%)]',
        )}
        style={{
          transform: `translate(calc(${coords.x}/1.5 * 1px), calc(${coords.y}/1.5 * -1px))`,
          filter: 'saturate(1.2) blur(15px)',
          opacity: isHovered ? 0.15 : 0,
        }}
      />
    </button>
  );
}