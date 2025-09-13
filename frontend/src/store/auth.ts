
import { create } from 'zustand'

export type User = { id: number; email: string; role: string; name?: string | null }

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (token: string | null, user: User | null) => void
  logout: () => void
  hydrate: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    if (token) localStorage.setItem('sp_token', token)
    else localStorage.removeItem('sp_token')
    if (user) localStorage.setItem('sp_user', JSON.stringify(user))
    else localStorage.removeItem('sp_user')
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('sp_token')
    localStorage.removeItem('sp_user')
    set({ token: null, user: null })
  },
  hydrate: () => {
    const t = localStorage.getItem('sp_token')
    const u = localStorage.getItem('sp_user')
    set({ token: t, user: u ? JSON.parse(u) : null })
  }
}))
