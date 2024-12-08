import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, AuthState, getCurrentUser, login as loginApi, logout as logoutApi, signup as signupApi } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    getCurrentUser().then((user) => {
      setState((prev) => ({ ...prev, user, isLoading: false }))
    })
  }, [])

  const login = async (email: string, password: string) => {
    const user = await loginApi(email, password)
    setState((prev) => ({ ...prev, user }))
  }

  const signup = async (email: string, password: string, name: string) => {
    const user = await signupApi(email, password, name)
    setState((prev) => ({ ...prev, user }))
  }

  const logout = async () => {
    await logoutApi()
    setState((prev) => ({ ...prev, user: null }))
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
