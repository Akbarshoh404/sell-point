
import { create } from 'zustand'
import { api } from '../lib/api'
import { useAuth } from './auth'

type CartItem = { id: number; productId: number; quantity: number }

type CartState = {
  items: CartItem[]
  loading: boolean
  fetch: () => Promise<void>
  add: (productId: number, quantity?: number) => Promise<void>
  update: (itemId: number, quantity: number) => Promise<void>
  remove: (itemId: number) => Promise<void>
  checkout: () => Promise<{ id: number } | null>
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  async fetch() {
    set({ loading: true })
    try {
      const { data } = await api.get('/api/cart')
      set({ items: data })
    } finally { set({ loading: false }) }
  },
  async add(productId, quantity = 1) {
    await api.post('/api/cart', { productId, quantity })
    await get().fetch()
  },
  async update(itemId, quantity) {
    await api.patch(`/api/cart/${itemId}`, { quantity })
    await get().fetch()
  },
  async remove(itemId) {
    await api.delete(`/api/cart/${itemId}`)
    await get().fetch()
  },
  async checkout() {
    const { data } = await api.post('/api/orders', {})
    await get().fetch()
    return data
  },
}))
