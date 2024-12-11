import React, { useState, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface RainbowButtonProps {
  children: React.ReactNode;
  shortcut?: string;
  variant?: 'light' | 'dark';
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  children,
  shortcut,
  variant = 'light',
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
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
  };

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--coord-x': `${coords.x}`,
        '--coord-y': `${coords.y}`,
      } as React.CSSProperties}
      className={cn(
        'relative overflow-hidden rounded-[0.80em] border',
        'flex items-center justify-center',
        'cursor-pointer text-[var(--color-button)]',
        'bg-gradient-conic from-[var(--color-red)] to-[var(--color-red)] bg-[length:200%]',
        'bg-[position:center] transition-all duration-300',
        'hover:bg-[position:center_calc(100%_-_2px)] hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.16)]',
        variant === 'light'
          ? 'border-transparent'
          : 'border-[rgba(255,255,255,0.05)]',
      )}
    >
      <div
        className={cn(
          'inner px-3 py-2 rounded-[0.70em]',
          'flex items-center justify-center gap-3',
          variant === 'light'
            ? 'bg-[var(--bg-button)] shadow-[inset_0_2px_1px_rgb(255_255_255_/_90%),_inset_0_-2px_3px_rgb(0_0_0_/_3%)]'
            : 'bg-[var(--bg-button)] shadow-[inset_0_2px_3px_rgb(255_255_255_/_1%),_inset_0_-2px_3px_rgb(0_0_0_/_25%)]',
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
      {/* Overlay pseudo-element effect */}
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-0',
          'bg-gradient-conic from-[var(--color-red)] to-[var(--color-red)]',
          'transition-all duration-300',
          'w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2',
        )}
        style={{
          transform: `translate(calc(${coords.x}/1.5 * 1px), calc(${coords.y}/1.5 * -1px))`,
          filter: 'saturate(2) blur(5px)',
          opacity: coords.x !== 0 || coords.y !== 0 ? 0.2 : 0,
        }}
      />
    </button>
  );
};