'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface AuthFormProps {
  isRegister?: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
}

function DirectionalButton({ children, onClick, disabled }: { 
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <Button
      className={cn(
        "relative w-full flex items-center justify-center gap-2 overflow-hidden",
        "border-zinc-800 bg-zinc-900/80 text-sm text-zinc-300",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-zinc-700/80 hover:bg-zinc-800/80 hover:text-zinc-200",
        "focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950",
        disabled && "cursor-not-allowed opacity-50"
      )}
      style={{
        '--x': `${position.x}%`,
        '--y': `${position.y}%`,
      } as React.CSSProperties}
      variant="outline"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      disabled={disabled}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,255,255,0.05)_10%,transparent_60%)]"
        />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] hover:transition-transform hover:duration-1000 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
      {children}
    </Button>
  )
}

export function AuthForm({ isRegister = false, onSubmit, isLoading = false }: AuthFormProps) {
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="space-y-4">
        <DirectionalButton
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
            const redirectUri = `${window.location.origin}/api/auth/github/callback`
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
            window.location.href = authUrl
          }}
          disabled={isLoading}
        >
          <Github className="h-4 w-4" />
          {isRegister ? 'Sign up' : 'Continue'} with GitHub
        </DirectionalButton>

        <DirectionalButton
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
            const redirectUri = `${window.location.origin}/api/auth/google/callback`
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`
            window.location.href = authUrl
          }}
          disabled={isLoading}
        >
          <Image 
            src="/google.svg" 
            alt="Google" 
            width={16} 
            height={16} 
          />
          {isRegister ? 'Sign up' : 'Continue'} with Google
        </DirectionalButton>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800 bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2 text-zinc-500">or continue with</span>
        </div>
      </motion.div>

      <motion.form variants={formVariants} onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <motion.div variants={itemVariants}>
            <AuthInput
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AuthInput
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
          />
        </motion.div>
        {isRegister && (
          <motion.div variants={itemVariants}>
            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              disabled={isLoading}
            />
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className={cn(
              "relative w-full overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-medium text-white",
              "transition-all duration-300",
              "hover:from-emerald-400 hover:to-emerald-500",
              "before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] before:opacity-0 before:hover:opacity-100 before:hover:animate-shine",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950",
              isLoading && "cursor-not-allowed opacity-50"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.span 
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-white">
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </span>
              </div>
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </motion.div>
      </motion.form>
      <motion.div variants={itemVariants}>
        <AuthFooter isRegister={isRegister} />
      </motion.div>
    </motion.div>
  )
}

function AuthInput({ id, label, disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="group space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-zinc-500 transition-colors group-focus-within:text-emerald-500"
      >
        {label}
      </label>
      <Input
        id={id}
        name={id}
        required
        disabled={disabled}
        className={cn(
          "h-9 bg-zinc-900/80 text-sm text-zinc-100",
          "border-zinc-800 placeholder:text-zinc-500",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-zinc-700/80",
          "focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50",
          "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          disabled && "cursor-not-allowed opacity-50"
        )}
        {...props}
      />
    </div>
  )
}

function AuthFooter({ isRegister }: { isRegister: boolean }) {
  return (
    <>
      <div className="text-center text-sm">
        <span className="text-zinc-500">
          {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
        </span>
        <Link
          href={isRegister ? '/login' : '/register'}
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {isRegister ? 'Sign In' : 'Sign Up Now'}
        </Link>
      </div>
      <div className="text-center text-xs text-zinc-500">
        By {isRegister ? 'signing up' : 'continuing'}, you agree to our{' '}
        <Link href="/terms" className="underline transition-colors hover:text-emerald-500">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline transition-colors hover:text-emerald-500">
          Privacy Policy
        </Link>
        , and to receive periodic emails with updates.
      </div>
    </>
  )
}