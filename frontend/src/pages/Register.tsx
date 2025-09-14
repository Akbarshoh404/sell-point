
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Register() {
  const nav = useNavigate()
  const { setUser, hydrate, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (user) nav('/') }, [user, nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/register', { email, password, name, role })
      setUser(data.user)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4 bg-white/90 backdrop-blur rounded-xl p-6 shadow-sm">
      <h1 className="text-xl font-bold">✨ Register</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border p-2 rounded" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="border px-4 py-2 rounded bg-blue-600 text-white w-full">Create account</button>
      </form>
      <div className="text-sm">Already have an account? <Link className="underline" to="/login">Login</Link></div>
    </div>
  )
}
