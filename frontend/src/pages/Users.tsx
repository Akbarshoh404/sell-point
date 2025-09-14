import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/config'

export default function Users() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { (async () => {
    const r = await fetch(`${API_BASE}/api/users`)
    const data = await r.json()
    setItems(data)
  })() }, [])
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">👥 Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(u => (
          <div key={u.id} className="border rounded p-3 bg-white/70">
            <div className="font-medium">{u.email}</div>
            <div className="text-sm text-gray-600">Role: {u.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

