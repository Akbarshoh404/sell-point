
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import SearchBar from './SearchBar'
import { useAuth } from '../store/auth'
import { useCart } from '../store/cart'

export default function Header() {
  const { user, token, logout, hydrate } = useAuth()
  const { items } = useCart()
  const nav = useNavigate()
  useEffect(() => { hydrate() }, [hydrate])
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-2xl font-bold tracking-tight">SellPoint</Link>
        <div className="hidden md:block flex-1 max-w-2xl"><SearchBar /></div>
        <nav className="ml-auto hidden sm:flex items-center gap-4 text-sm">
          <Link to="/category/phones">Phones</Link>
          <Link to="/category/laptops">Laptops</Link>
          <Link to="/category/pcs">PCs</Link>
          <Link to="/category/consoles">Consoles</Link>
          <Link to="/category/accessories">Accessories</Link>
          <Link to="/cart" className="font-medium">Cart{items?.length ? ` (${items.length})` : ''}</Link>
          {token ? (
            <>
              <Link to="/orders">Orders</Link>
              {user?.role === 'seller' && (<Link to="/seller">Seller</Link>)}
              {user?.role === 'admin' && (<Link to="/admin">Admin</Link>)}
              <Link to="/profile">{user?.email}</Link>
              <button className="border px-2 py-1 rounded" onClick={() => { logout(); nav('/') }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
      <div className="md:hidden px-4 pb-3"><SearchBar /></div>
    </header>
  )
}
