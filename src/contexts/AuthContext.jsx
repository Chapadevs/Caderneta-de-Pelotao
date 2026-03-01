import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const TIMEOUT_MS = 8000

    const finish = () => {
      if (!cancelled) setLoading(false)
    }

    const initAuth = async () => {
      try {
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
        )
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])

        if (cancelled) return
        if (session?.user) {
          setUser(session.user)
          try {
            const rolePromise = resolveRoleAndProfile(session.user.id)
            const roleTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
            )
            await Promise.race([rolePromise, roleTimeout])
          } catch {
            setUser(null)
            setRole(null)
            setProfile(null)
          }
        } else {
          setUser(null)
          setRole(null)
          setProfile(null)
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.message !== 'timeout') {
            console.error('Erro ao inicializar autenticação:', err)
          }
          setUser(null)
          setRole(null)
          setProfile(null)
        }
      } finally {
        finish()
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        resolveRoleAndProfile(session.user.id).catch(() => {
          setRole(null)
          setProfile(null)
        })
      } else {
        setUser(null)
        setRole(null)
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [])

  async function resolveRoleAndProfile(authUserId) {
    const { data: admin } = await supabase
      .from('administrador')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (admin) {
      setRole('administrador')
      setProfile({ ...admin, id: admin.administrador_id })
      return
    }

    const { data: comandante } = await supabase
      .from('comandante')
      .select('*, pelotao!fk_comandante_pelotao(nome_pelotao)')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (comandante) {
      setRole('comandante')
      setProfile({ ...comandante, id: comandante.comandante_id })
      return
    }

    setRole(null)
    setProfile(null)
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setProfile(null)
  }

  async function registerAdmin(nome, email, password) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) throw authError

    const { error: adminError } = await supabase.from('administrador').insert({
      nome,
      email,
      auth_user_id: authData.user.id,
      senha: '', // placeholder - auth via Supabase
    })
    if (adminError) throw adminError

    return authData
  }

  async function registerComandante(nome, email, password, id_pelotao) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) throw authError

    const { error: cmdError } = await supabase.from('comandante').insert({
      nome,
      email,
      id_pelotao,
      auth_user_id: authData.user.id,
      senha: '', // placeholder - auth via Supabase
    })
    if (cmdError) throw cmdError

    return authData
  }

  const value = {
    user,
    role,
    profile,
    loading,
    login,
    logout,
    registerAdmin,
    registerComandante,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
