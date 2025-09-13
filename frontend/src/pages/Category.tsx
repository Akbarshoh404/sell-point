import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { API_BASE } from "../lib/config"

type Product = {
  id: number
  title: string
  price: number
  discount: number
  images: string[]
  brand?: string
  model?: string
  condition: string
  stock: number
}

export default function Category() {
  const { category } = useParams()
  const [items, setItems] = useState<Product[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)

  const endpoint = useMemo(() => {
    const c = category || ""
    const qs = new URLSearchParams({ category: String(c), q })
    return `${API_BASE}/api/products?${qs.toString()}`
  }, [category, q])

  useEffect(() => {
    setLoading(true)
    fetch(endpoint)
      .then(r => r.json())
      .then(data => setItems(data.items || []))
      .finally(() => setLoading(false))
  }, [endpoint])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search in category..."
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="border rounded p-3 hover:shadow">
              <div className="text-sm text-gray-500">{p.brand} {p.model}</div>
              <div className="font-medium">{p.title}</div>
              <div className="text-lg">${(p.price - p.discount).toFixed(2)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
