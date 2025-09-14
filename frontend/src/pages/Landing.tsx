
import CategoryTile from '../components/CategoryTile'
import ProductCard from '../components/ProductCard'
import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/config'

export default function Landing() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { (async () => {
    const r = await fetch(`${API_BASE}/api/products?sort=newest&size=8`)
    const data = await r.json()
    setItems(data.items || [])
  })() }, [])
  return (
    <div className="space-y-10 animate-fade-in">
      <section className="text-center space-y-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Buy & Sell Electronics</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Find the latest phones, laptops, PCs, consoles, and accessories at the best prices.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <CategoryTile to="/category/phones" label="Phones" />
          <CategoryTile to="/category/laptops" label="Laptops" />
          <CategoryTile to="/category/pcs" label="PCs" />
          <CategoryTile to="/category/consoles" label="Consoles" />
          <CategoryTile to="/category/accessories" label="Accessories" />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Trending</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(p => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>
    </div>
  )
}
