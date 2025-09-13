
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './store/auth'
import { useCart } from './store/cart'

import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const nav = useNavigate()
  const { user, token, logout, hydrate } = useAuth()
  const { items } = useCart()
  // hydrate auth on mount
  useEffect(() => { hydrate() }, [hydrate])
  const [showBanner, setShowBanner] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShowBanner(false), 2500); return () => clearTimeout(t) }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {showBanner && (
        <div role="status" aria-live="polite" className="bg-emerald-50 text-emerald-700 text-sm px-4 py-2 text-center">
          Optimizing layout for your device...
        </div>
      )}
      
      <main className="container mx-auto p-4 flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}