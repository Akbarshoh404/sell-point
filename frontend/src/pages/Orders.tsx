
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Orders() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { (async () => { const { data } = await api.get('/api/orders'); setItems(data) })() }, [])
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Orders</h1>
      <div className="space-y-2">
        {items.map(o => (
          <div key={o.id} className="border p-3 rounded">
            <div>#{o.id} · {o.paymentStatus} · {o.deliveryStatus}</div>
            <div>Total: ${o.totalPrice?.toFixed?.(2) ?? o.totalPrice}</div>
            <div className="text-xs text-gray-500">{o.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
