
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../store/cart'
import { API_BASE } from '../lib/config'

export default function Cart() {
  const { items, fetch, update, remove, checkout, loading } = useCart()
  const [products, setProducts] = useState<Record<number, any>>({})

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => {
    (async () => {
      const map: Record<number, any> = {}
      for (const it of items) {
        const r = await fetch(`${API_BASE}/api/products/${it.productId}`)
        map[it.productId] = await r.json()
      }
      setProducts(map)
    })()
  }, [items])

  const total = useMemo(() => items.reduce((sum, it) => {
    const p = products[it.productId]
    const price = p ? (p.price - p.discount) : 0
    return sum + price * it.quantity
  }, 0), [items, products])

  async function onCheckout() {
    const r = await checkout()
    if (r) alert(`Order #${r.id} placed`) // minimal UX
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Cart</h1>
      {loading && <div>Loading...</div>}
      <div className="space-y-3">
        {items.map(it => {
          const p = products[it.productId]
          return (
            <div key={it.id} className="border p-3 rounded flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <div className="font-medium">{p?.title || `Product #${it.productId}`}</div>
                <div className="text-sm text-gray-500">Qty: 
                  <input className="border p-1 w-16 ml-2" type="number" min={1} value={it.quantity} onChange={e => update(it.id, Math.max(1, parseInt(e.target.value||'1', 10)))} />
                </div>
                <div className="text-sm">Price: ${p ? (p.price - p.discount).toFixed(2) : '...'}</div>
              </div>
              <button className="border px-3 py-1 rounded" onClick={() => remove(it.id)}>Remove</button>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
        <button className="border px-4 py-2 rounded" onClick={onCheckout} disabled={!items.length}>Checkout</button>
      </div>
    </div>
  )
}
