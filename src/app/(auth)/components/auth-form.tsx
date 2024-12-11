import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { HoverButton } from '@/components/ui/hover-button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  isRegister?: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
}

export function AuthForm({ isRegister = false, onSubmit, isLoading = false }: AuthFormProps) {
  return (
    <div className="space-y-4">
      <SocialAuthButtons isRegister={isRegister} isLoading={isLoading} />
      <Separator className="my-4" />
      <form onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <AuthInput
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
          />
        )}
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
        />
        {isRegister && (
          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            disabled={isLoading}
          />
        )}
        <HoverButton
          className="w-full"
          onClick={() => {}}
          variant={isLoading ? 'dark' : 'default'}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
              {isRegister ? 'Creating Account...' : 'Signing In...'}
            </div>
          ) : (
            isRegister ? 'Create Account' : 'Sign In'
          )}
        </HoverButton>
      </form>
      <AuthFooter isRegister={isRegister} />
    </div>
  )
}

function SocialAuthButtons({ isRegister, isLoading }: { isRegister: boolean, isLoading: boolean }) {
  const router = useRouter()

  const handleOAuthClick = (provider: 'github' | 'google') => {
    const clientId = provider === 'github' 
      ? process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID 
      : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    const redirectUri = `${window.location.origin}/api/auth/${provider}/callback`
    
    const authUrl = provider === 'github'
      ? `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
      : `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`

    router.push(authUrl)
  }

  return (
    <>
      <Button
        className="w-full flex items-center justify-center gap-2"
        variant="outline"
        onClick={() => handleOAuthClick('github')}
        disabled={isLoading}
      >
        <Github className="h-4 w-4" />
        {isRegister ? 'Sign up' : 'Continue'} with GitHub
      </Button>
      <Button
        className="w-full flex items-center justify-center gap-2"
        variant="outline"
        onClick={() => handleOAuthClick('google')}
        disabled={isLoading}
      >
        <Image 
          src="/google.svg" 
          alt="Google" 
          width={16} 
          height={16} 
        />
        {isRegister ? 'Sign up' : 'Continue'} with Google
      </Button>
    </>
  )
}

function AuthInput({ id, label, disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-zinc-500"
      >
        {label}
      </label>
      <Input
        id={id}
        name={id}
        required
        disabled={disabled}
        className={cn(
          "h-9 border-zinc-800 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-500",
          "transition-all focus-visible:ring-0 focus-visible:border-emerald-500 focus-visible:ring-offset-0",
          "hover:border-zinc-700",
          disabled && "opacity-50 cursor-not-allowed"
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
        <Link href="/terms" className="underline text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          Privacy Policy
        </Link>
        , and to receive periodic emails with updates.
      </div>
    </>
  )
}

