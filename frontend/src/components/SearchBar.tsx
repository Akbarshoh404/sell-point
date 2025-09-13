
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  function go(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const base = loc.pathname.startsWith('/category/') ? loc.pathname : '/category/phones'
    nav(`${base}?${params.toString()}`)
  }
  return (
    <form onSubmit={go} className="flex items-center gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Search for products..." />
      <button className="border rounded px-3 py-2 min-w-24">Search</button>
    </form>
  )
}
