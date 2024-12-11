import { GridPattern } from '@/components/grid'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <main className="flex flex-">
        <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
   <div className="w-full max-w-[350px] space-y-6 overflow-hidden                                               ">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-100">{title}</h1>
              <GridPattern
        width={66}
        height={66}
        x={-100}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />         <p className="text-sm text-zinc-400">{description}</p>
            </div>
            {children}
          </div>
        </div>
  
        <AuthSidebar />
      </main>
    </div>
  )
}

function AuthSidebar() {
  return (
    <div className="hidden flex-1 items-center justify-center bg-zinc-900/50 lg:flex">
      <figure className="max-w-md space-y-6 p-8">
        <blockquote className="space-y-2">
          <span className="text-5xl text-zinc-700">&ldquo;</span>
          <p className="text-lg text-zinc-300">
            Signing up was a breeze. The interface is intuitive, and I was up and running in no time. Highly recommend for anyone looking for a seamless onboarding experience.
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-4">
          <Image
            src="/placeholder.svg"
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>@newuser123</span>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}

