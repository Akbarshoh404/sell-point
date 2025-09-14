import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { API_BASE } from "../lib/config"
import ProductCard from "../components/ProductCard"

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
    </>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
    <div className="md:col-span-1 space-y-3">
      <details className="md:hidden">
        <summary className="cursor-pointer border px-2 py-1 rounded inline-block">Filters</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Controls />
        </div>
      </details>

      <div className="hidden md:grid grid-cols-1 gap-2">
        <Controls />
      </div>

      </div>
      <div className="md:col-span-3 space-y-4">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 border rounded p-3">
          <div className="text-sm text-gray-600">{items.length} results</div>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="border p-2 rounded">
            <option value="newest">Newest</option>
            <option value="price_asc">Price Low→High</option>
            <option value="price_desc">Price High→Low</option>
          </select>
        </div>
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
