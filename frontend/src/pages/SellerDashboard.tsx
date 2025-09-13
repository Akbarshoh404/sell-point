
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('phones')

  async function load() {
    const { data } = await api.get('/api/products')
    setProducts(data.items || [])
  }
  useEffect(() => { load() }, [])

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    const payload: any = { title, price: parseFloat(price), category, condition: 'new', stock: 1, images: [], specifications: {} }
    await api.post('/api/products', payload)
    setTitle(''); setPrice('')
    await load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Seller Dashboard</h1>
      <form onSubmit={createProduct} className="border p-3 rounded space-y-2">
        <input className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <select className="border p-2 rounded w-full" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="phones">Phones</option>
          <option value="laptops">Laptops</option>
          <option value="pcs">PCs</option>
          <option value="consoles">Consoles</option>
          <option value="accessories">Accessories</option>
        </select>
        <button className="border px-4 py-2 rounded">Create</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(p => (
          <div className="border p-3 rounded" key={p.id}>
            <div className="font-medium">{p.title}</div>
            <div>${(p.price - p.discount).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
