import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { isAuthenticated } = await getSession()
  
  if (isAuthenticated) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}

