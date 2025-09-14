
import { create } from 'zustand'

export type User = { id: number; email: string; role: string; name?: string | null }

type AuthState = {
  user: User | null
  setUser: (user: User | null) => void
  hydrate: () => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) localStorage.setItem('sp_user', JSON.stringify(user))
    else localStorage.removeItem('sp_user')
    set({ user })
  },
  hydrate: () => {
    const u = localStorage.getItem('sp_user')
    set({ user: u ? JSON.parse(u) : null })
  },
  logout: () => {
    localStorage.removeItem('sp_user')
    set({ user: null })
  }
}))
