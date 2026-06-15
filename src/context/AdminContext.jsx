import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminContext } from './AdminContextValue'
import { useLanguage } from './useLanguage'
import { getSupabaseConfigError, isSupabaseConfigured, supabase } from '../lib/supabase'

function formatAdminAuthError(error, t) {
  const message = error?.message || t('admin.login.genericError')

  if (message.includes('admin_users_email_key')) {
    return t('adminContext.duplicateEmail')
  }

  if (message.includes('email rate limit exceeded')) {
    return t('adminContext.rateLimit')
  }

  return message
}

export function AdminProvider({ children }) {
  const { t } = useLanguage()
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authMessage, setAuthMessage] = useState('')

  const resolveAdminAccess = useCallback(async (nextSession) => {
    if (!supabase) {
      setAuthMessage(getSupabaseConfigError())
      setIsAdmin(false)
      setIsLoading(false)
      return false
    }

    if (!nextSession?.user) {
      setIsAdmin(false)
      setIsLoading(false)
      return false
    }

    const { data, error } = await supabase.rpc('claim_admin_access')

    if (error) {
      setAuthMessage(formatAdminAuthError(error, t))
      setIsAdmin(false)
      setIsLoading(false)
      return false
    }

    const hasAdminAccess = Boolean(data)
    setIsAdmin(hasAdminAccess)
    setAuthMessage(
      hasAdminAccess
        ? ''
        : t('adminContext.noAdminAccess'),
    )
    setIsLoading(false)
    return hasAdminAccess
  }, [t])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      if (!isSupabaseConfigured || !supabase) {
        if (!isMounted) return
        setAuthMessage(getSupabaseConfigError())
        setIsLoading(false)
        return
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      await resolveAdminAccess(currentSession)
    }

    bootstrap()

    if (!supabase) {
      return () => {
        isMounted = false
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(true)
      void resolveAdminAccess(nextSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [resolveAdminAccess])

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) {
      throw new Error(getSupabaseConfigError())
    }

    setAuthMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }

    const hasAccess = await resolveAdminAccess(data.session)

    if (!hasAccess) {
      throw new Error(t('adminContext.notAdmin'))
    }

    return data
  }, [resolveAdminAccess, t])

  const signUp = useCallback(async ({ email, password }) => {
    if (!supabase) {
      throw new Error(getSupabaseConfigError())
    }

    setAuthMessage('')
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      throw error
    }

    if (data.session) {
      await resolveAdminAccess(data.session)
      return {
        requiresConfirmation: false,
      }
    }

    return {
      requiresConfirmation: true,
    }
  }, [resolveAdminAccess])

  const signOut = useCallback(async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setIsAdmin(false)
    setAuthMessage('')
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      isAdmin,
      isLoading,
      authMessage,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, isAdmin, isLoading, authMessage, signIn, signUp, signOut],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
