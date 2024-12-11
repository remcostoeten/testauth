"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

export function Grid() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Grid Pattern
      </p>
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
    </div>
  );
}

interface GridPatternProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    squares?: Array<[x: number, y: number]>;
    strokeDasharray?: string;
    className?: string;
    [key: string]: unknown;
  }
  

  export function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = "0",
    squares,
    className,
    ...props
  }: GridPatternProps) {
    const id = useId();
   
    return (
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none  absolute inset-0 h-full w-full fill-gray-400/10 stroke-gray-400/30",
          className,
        )}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        {squares && (
          <svg x={x} y={y} className="overflow-visible">
            {squares.map(([x, y]) => (
              <rect
                strokeWidth="0"
                key={`${x}-${y}`}
                width={width - 1}
                height={height - 1}
                x={x * width + 1}
                y={y * height + 1}
              />
            ))}
          </svg>
        )}
      </svg>
    );
  }