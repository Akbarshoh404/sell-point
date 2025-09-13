
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Login() {
  const nav = useNavigate()
  const { setAuth, hydrate, token } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (token) nav('/') }, [token, nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setAuth(data.access_token, data.user)
      nav('/')</n>
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Login</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="border px-4 py-2 rounded">Login</button>
      </form>
      <div className="text-sm">No account? <Link className="underline" to="/register">Register</Link></div>
    </div>
  )
}
