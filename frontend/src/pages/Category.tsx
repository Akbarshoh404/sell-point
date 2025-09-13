import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { API_BASE } from "../lib/config"

type Product = { id:number; title:string; price:number; discount:number; images:string[]; brand?:string; model?:string; condition:string; stock:number }

export default function Category() {
  const { category } = useParams()
  const [items, setItems] = useState<Product[]>([])
  const [q, setQ] = useState("")
  const [brand, setBrand] = useState("")
  const [condition, setCondition] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sort, setSort] = useState("newest")
  const [loading, setLoading] = useState(false)

  const endpoint = useMemo(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', String(category))
    if (q) params.set('q', q)
    if (brand) params.set('brand', brand)
    if (condition) params.set('condition', condition)
    if (priceMin) params.set('price_min', priceMin)
    if (priceMax) params.set('price_max', priceMax)
    if (sort) params.set('sort', sort)
    return `${API_BASE}/api/products?${params.toString()}`
  }, [category, q, brand, condition, priceMin, priceMax, sort])

  useEffect(() => {
    setLoading(true)
    fetch(endpoint).then(r => r.json()).then(data => setItems(data.items || [])).finally(() => setLoading(false))
  }, [endpoint])

  const Controls = () => (
    <>
      <input value={q} onChange={e=>setQ(e.target.value)} className="border p-2 rounded w-full" placeholder="Search..."/>
      <input value={brand} onChange={e=>setBrand(e.target.value)} className="border p-2 rounded w-full" placeholder="Brand"/>
      <select value={condition} onChange={e=>setCondition(e.target.value)} className="border p-2 rounded w-full">
        <option value="">Condition</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="refurbished">Refurbished</option>
      </select>
      <input value={priceMin} onChange={e=>setPriceMin(e.target.value)} className="border p-2 rounded w-full" placeholder="Min Price"/>
      <input value={priceMax} onChange={e=>setPriceMax(e.target.value)} className="border p-2 rounded w-full" placeholder="Max Price"/>
      <select value={sort} onChange={e=>setSort(e.target.value)} className="border p-2 rounded w-full">
        <option value="newest">Newest</option>
        <option value="price_asc">Price Low→High</option>
        <option value="price_desc">Price High→Low</option>
      </select>
    </>
  )

  return (
    <div className="space-y-4">
      <details className="md:hidden">
        <summary className="cursor-pointer border px-2 py-1 rounded inline-block">Filters</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Controls />
        </div>
      </details>

      <div className="hidden md:grid grid-cols-6 gap-2">
        <Controls />
      </div>

      {loading ? <div>Loading...</div> : (
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
