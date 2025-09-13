
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
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

export default function App() {
  const nav = useNavigate()
  const { user, token, logout, hydrate } = useAuth()
  const { items } = useCart()
  // hydrate auth on mount
  if (typeof window !== 'undefined') {
    hydrate()
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto p-4 flex gap-3 items-center">
          <Link to="/" className="font-bold">SellPoint</Link>
          <nav className="hidden sm:flex gap-4">
            <Link to="/category/phones">Phones</Link>
            <Link to="/category/laptops">Laptops</Link>
            <Link to="/category/pcs">PCs</Link>
            <Link to="/category/consoles">Consoles</Link>
            <Link to="/category/accessories">Accessories</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/cart">Cart{items?.length ? ` (${items.length})` : ''}</Link>
            {token ? (
              <>
                <Link to="/orders">Orders</Link>
                {user?.role === 'seller' && (<Link to="/seller">Seller</Link>)}
                {user?.role === 'admin' && (<Link to="/admin">Admin</Link>)}
                <Link to="/profile">{user?.email}</Link>
                <button className="border px-2 py-1 rounded" onClick={() => { logout(); nav('/')}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
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
      <footer className="border-t p-4 text-center">© SellPoint</footer>
    </div>
  )
}
