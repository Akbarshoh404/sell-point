
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('1')
  const [category, setCategory] = useState('phones')

  async function load() {
    const { data } = await api.get('/api/products')
    const mine = user?.id ? (data.items || []).filter((p: any) => p.sellerId === user.id) : (data.items || [])
    setProducts(mine)
  }
  useEffect(() => { load() }, [])

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    const payload: any = { title, price: parseFloat(price), category, condition: 'new', stock: parseInt(stock || '1', 10), images: [], specifications: {} }
    await api.post('/api/products', payload)
    setTitle(''); setPrice(''); setStock('1')
    await load()
  }

  async function del(id: number) { await api.delete(`/api/products/${id}`); await load() }
  async function save(p: any) { await api.patch(`/api/products/${p.id}`, { price: p.price, stock: p.stock }); await load() }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Seller Dashboard</h1>
      <form onSubmit={createProduct} className="border p-3 rounded grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
        <select className="border p-2 rounded w-full" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="phones">Phones</option>
          <option value="laptops">Laptops</option>
          <option value="pcs">PCs</option>
          <option value="consoles">Consoles</option>
          <option value="accessories">Accessories</option>
        </select>
        <button className="border px-4 py-2 rounded md:col-span-4">Create</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p: any) => (
          <div className="border p-3 rounded space-y-2" key={p.id}>
            <div className="font-medium">{p.title}</div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Price</label>
              <input className="border p-1 w-24" value={p.price} onChange={e => p.price = parseFloat(e.target.value || '0')} />
              <label className="text-sm">Stock</label>
              <input className="border p-1 w-20" value={p.stock} onChange={e => p.stock = parseInt(e.target.value || '0', 10)} />
            </div>
            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded" onClick={() => save(p)}>Save</button>
              <button className="border px-3 py-1 rounded" onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
