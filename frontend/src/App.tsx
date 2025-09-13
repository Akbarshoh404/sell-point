import { Routes, Route, Link } from "react-router-dom"
import Landing from "./pages/Landing"
import Category from "./pages/Category"
import Product from "./pages/Product"
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import SellerDashboard from './pages/SellerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto p-4 flex gap-4">
          <Link to="/" className="font-bold">SellPoint</Link>
          <nav className="flex gap-4">
            <Link to="/category/phones">Phones</Link>
            <Link to="/category/laptops">Laptops</Link>
            <Link to="/category/pcs">PCs</Link>
            <Link to="/category/consoles">Consoles</Link>
            <Link to="/category/accessories">Accessories</Link>
            <Link to="/cart" className="ml-auto">Cart</Link>
          </nav>
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
          </Route>
        </Routes>
      </main>
      <footer className="border-t p-4 text-center">© SellPoint</footer>
    </div>
  )
}
