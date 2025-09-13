
import { useEffect } from 'react'
import { useAuth } from '../store/auth'
import { api } from '../lib/api'

export default function Profile() {
  const { user, setAuth, hydrate, token } = useAuth()
  useEffect(() => {
    hydrate()
    ;(async () => {
      if (token) {
        const { data } = await api.get('/api/auth/me')
        setAuth(token, data)
      }
    })()
  }, [hydrate, setAuth, token])
  if (!user) return <div>Loading...</div>
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Profile</h1>
      <div>Email: {user.email}</div>
      <div>Role: {user.role}</div>
      <div>Name: {user.name || '-'}</div>
    </div>
  )
}
