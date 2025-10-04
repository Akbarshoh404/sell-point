import CategoryTile from '../components/CategoryTile'
import ProductCard from '../components/ProductCard'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../lib/config'

export default function Landing() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => { 
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/products?sort=newest&size=8`)
        const data = await r.json()
        setItems(data.items || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    })() 
  }, [])

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-success-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230ea5e9" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="heading-primary text-gradient">
                Buy & Sell Electronics
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the latest phones, laptops, PCs, gaming consoles, and accessories at unbeatable prices. 
                Join thousands of satisfied customers in our thriving marketplace.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-200">
              <Link to="/category/phones" className="btn-primary text-lg px-8 py-4">
                🛍️ Start Shopping
              </Link>
              <Link to="/register" className="btn-outline text-lg px-8 py-4">
                🏪 Become a Seller
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in-up animate-delay-400">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">10K+</div>
                <div className="text-gray-600 font-medium">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">5K+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">500+</div>
                <div className="text-gray-600 font-medium">Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">99%</div>
                <div className="text-gray-600 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12 animate-fade-in-up">
          <h2 className="heading-secondary text-gradient-secondary">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of electronics categories and find exactly what you're looking for.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="animate-fade-in-up animate-delay-100">
            <CategoryTile to="/category/phones" label="📱 Phones" />
          </div>
          <div className="animate-fade-in-up animate-delay-200">
            <CategoryTile to="/category/laptops" label="💻 Laptops" />
          </div>
          <div className="animate-fade-in-up animate-delay-300">
            <CategoryTile to="/category/pcs" label="🖥️ PCs" />
          </div>
          <div className="animate-fade-in-up animate-delay-400">
            <CategoryTile to="/category/consoles" label="🎮 Consoles" />
          </div>
          <div className="animate-fade-in-up animate-delay-500">
            <CategoryTile to="/category/accessories" label="🔌 Accessories" />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12 animate-fade-in-up">
          <h2 className="heading-secondary text-gradient-secondary">
            Trending Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular and trending electronics in our marketplace.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12 animate-fade-in-up">
          <Link to="/category/phones" className="btn-primary text-lg px-8 py-4">
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <h2 className="heading-secondary text-gradient-secondary">
              Why Choose SellPoint?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best marketplace experience for buying and selling electronics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4 animate-fade-in-up animate-delay-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="heading-tertiary text-gray-800">Secure Transactions</h3>
              <p className="text-gray-600">
                All transactions are protected with industry-standard security measures and buyer protection.
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-in-up animate-delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="heading-tertiary text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping options to get your electronics to you as fast as possible.
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-in-up animate-delay-300">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="heading-tertiary text-gray-800">Quality Guarantee</h3>
              <p className="text-gray-600">
                Every product is verified for quality and authenticity before being listed on our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          
          <div className="relative space-y-6 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover amazing deals on electronics today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                Get Started Free
              </Link>
              <Link to="/category/phones" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}