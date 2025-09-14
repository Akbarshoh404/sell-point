
import { useParams, useEffect, useState } from "react"
import { API_BASE } from "../lib/config"
import { useCart } from '../store/cart'

export default function Product() {
  const { id } = useParams() as { id: string }
  const [item, setItem] = useState<any>(null)
  const { add } = useCart()

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`).then(r=>r.json()).then(setItem)
  }, [id])
  if (!item) return <div>Loading...</div>
  const img = (item.images && item.images[0]) || '/api/uploads/demo-phone.png'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <img src={img} alt={item.title} className="w-full h-auto object-cover" />
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <div className="text-gray-600">{item.brand} {item.model} • {item.condition}</div>
        <div className="text-3xl text-emerald-700">${(item.price - item.discount).toFixed(2)}</div>
        <button className="border px-4 py-2 rounded bg-emerald-600 text-white" onClick={() => add(item.id, 1)}>Add to Cart</button>
        <div className="space-y-1">
          <div className="font-medium">Specifications</div>
          <ul className="list-disc ml-6">
            {Object.entries(item.specifications || {}).map(([k,v]: any) => (
              <li key={k}><span className="font-medium">{k}</span>: {String(v)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
