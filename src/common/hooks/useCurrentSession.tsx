import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type AuthStatus = 'unauthenticated' | 'authenticated' | 'loading'

export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('unauthenticated')
  const pathName = usePathname()

  const retrieveSession = useCallback(async () => {
    try {
      setStatus('loading')
      const sessionData = await getSession()

      if (sessionData) {
        setSession(sessionData)
        setStatus('authenticated')
        return
      }

      setStatus('unauthenticated')
    } catch (error) {
      setStatus('unauthenticated')
      setSession(null)
    }
  }, [])

  useEffect(() => {
    retrieveSession()

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, pathName])

  const isAuthenticated = status === 'authenticated'

  return { session, status, isAuthenticated }
}
