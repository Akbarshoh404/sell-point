import { useParams, useEffect, useState } from "react"
import { API_BASE } from "../lib/config"

export default function Product() {
  const { id } = useParams() as { id: string }
  const [item, setItem] = useState<any>(null)
  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`).then(r=>r.json()).then(setItem)
  }, [id])
  if (!item) return <div>Loading...</div>
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">{item.title}</h1>
      <div className="text-gray-600">{item.brand} {item.model} • {item.condition}</div>
      <div className="text-2xl">${(item.price - item.discount).toFixed(2)}</div>
      <div className="space-y-1">
        <div className="font-medium">Specifications</div>
        <ul className="list-disc ml-6">
          {Object.entries(item.specifications || {}).map(([k,v]) => (
            <li key={k}><span className="font-medium">{k}</span>: {String(v)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
