import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import { useAuth } from '../store/auth'
import { useCart } from '../store/cart'

export default function Header() {
  const { user, hydrated, logout, hydrate } = useAuth()
  const { items } = useCart()
  const nav = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => { hydrate() }, [hydrate])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-bold text-xl">🛒</span>
            </div>
            <span className="text-2xl font-bold text-gradient">SellPoint</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/category/phones" 
              className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
            >
              📱 Phones
            </Link>
            <Link 
              to="/category/laptops" 
              className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
            >
              💻 Laptops
            </Link>
            <Link 
              to="/category/pcs" 
              className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
            >
              🖥️ PCs
            </Link>
            <Link 
              to="/category/consoles" 
              className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
            >
              🎮 Consoles
            </Link>
            <Link 
              to="/category/accessories" 
              className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
            >
              🔌 Accessories
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3 ml-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
            >
              <span className="text-xl">🛍️</span>
              {items?.length ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce-gentle">
                  {items.length}
                </span>
              ) : null}
            </Link>

            {/* User Actions */}
            {hydrated && user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/orders" 
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                >
                  📦 Orders
                </Link>
                {user?.role === 'seller' && (
                  <Link 
                    to="/seller" 
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                  >
                    🏪 Seller
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                  >
                    🛠️ Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                >
                  👤 {user?.name || user?.email}
                </Link>
                <button 
                  className="btn-error text-sm px-4 py-2" 
                  onClick={() => { logout(); nav('/'); closeMobileMenu() }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="btn-outline text-sm px-4 py-2"
                >
                  🔐 Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm px-4 py-2"
                >
                  ✨ Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg animate-fade-in-down">
            <nav className="space-y-2">
              <Link 
                to="/category/phones" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                📱 Phones
              </Link>
              <Link 
                to="/category/laptops" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                💻 Laptops
              </Link>
              <Link 
                to="/category/pcs" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                🖥️ PCs
              </Link>
              <Link 
                to="/category/consoles" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                🎮 Consoles
              </Link>
              <Link 
                to="/category/accessories" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                🔌 Accessories
              </Link>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link 
                  to="/cart" 
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                  onClick={closeMobileMenu}
                >
                  <span>🛍️ Cart</span>
                  {items?.length ? (
                    <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {items.length}
                    </span>
                  ) : null}
                </Link>
                
                {hydrated && user ? (
                  <>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                      onClick={closeMobileMenu}
                    >
                      📦 Orders
                    </Link>
                    {user?.role === 'seller' && (
                      <Link 
                        to="/seller" 
                        className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                        onClick={closeMobileMenu}
                      >
                        🏪 Seller Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                        onClick={closeMobileMenu}
                      >
                        🛠️ Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                      onClick={closeMobileMenu}
                    >
                      👤 {user?.name || user?.email}
                    </Link>
                    <button 
                      className="w-full btn-error text-sm px-4 py-3 mt-2" 
                      onClick={() => { logout(); nav('/'); closeMobileMenu() }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-4">
                    <Link 
                      to="/login" 
                      className="block btn-outline text-sm px-4 py-3 text-center"
                      onClick={closeMobileMenu}
                    >
                      🔐 Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block btn-primary text-sm px-4 py-3 text-center"
                      onClick={closeMobileMenu}
                    >
                      ✨ Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}