import { getSession } from '@/lib/session'

export default async function HomePage() {
  const { user, isAuthenticated } = await getSession()
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome back, {user?.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}

