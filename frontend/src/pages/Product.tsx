import { useParams, useEffect, useState } from "react"
import { API_BASE } from "../lib/config"
import { useCart } from '../store/cart'
import { Link } from 'react-router-dom'

export default function Product() {
  const { id } = useParams() as { id: string }
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { add } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/api/products/${id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()
        setItem(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    add(item.id, quantity)
    // Show success feedback
    const button = document.getElementById('add-to-cart-btn')
    if (button) {
      button.textContent = '✓ Added to Cart!'
      button.classList.add('bg-success-500')
      setTimeout(() => {
        button.textContent = 'Add to Cart'
        button.classList.remove('bg-success-500')
      }, 2000)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="heading-tertiary text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const images = item.images && item.images.length > 0 ? item.images : ['/api/uploads/demo-phone.png']
  const price = (item.price - item.discount).toFixed(2)
  const originalPrice = item.price.toFixed(2)
  const discountPercentage = item.discount > 0 ? Math.round((item.discount / item.price) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 animate-fade-in-up">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li><Link to={`/category/${item.category}`} className="hover:text-primary-600 capitalize">{item.category}</Link></li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{item.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4 animate-fade-in-up">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              src={images[selectedImage]} 
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-primary-500 ring-2 ring-primary-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 animate-fade-in-up animate-delay-200">
          {/* Title & Brand */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {item.brand}
              </span>
              {item.condition && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.condition === 'new' 
                    ? 'bg-success-100 text-success-700' 
                    : item.condition === 'used'
                    ? 'bg-warning-100 text-warning-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.condition}
                </span>
              )}
            </div>
            <h1 className="heading-secondary text-gray-800">{item.title}</h1>
            {item.model && (
              <p className="text-lg text-gray-600">{item.model}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-800">${price}</span>
              {item.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">${originalPrice}</span>
                  <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-bold px-2 py-1 rounded-full">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
            {item.discount > 0 && (
              <p className="text-sm text-success-600 font-medium">
                You save ${item.discount.toFixed(2)}!
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {item.stock > 10 ? (
              <span className="text-success-600 font-medium">✓ In Stock</span>
            ) : item.stock > 0 ? (
              <span className="text-warning-600 font-medium">⚠️ Only {item.stock} left in stock</span>
            ) : (
              <span className="text-error-600 font-medium">❌ Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="label mb-0">Quantity:</label>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  disabled={quantity >= item.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={item.stock === 0}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Description */}
          {item.description && (
            <div className="space-y-2">
              <h3 className="heading-tertiary text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Specifications */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <div className="space-y-4">
              <h3 className="heading-tertiary text-gray-800">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(item.specifications).map(([key, value]: any) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 animate-fade-in-up animate-delay-400">
        <h2 className="heading-secondary text-gradient-secondary mb-8 text-center">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* This would typically fetch related products */}
          <div className="text-center p-8 bg-gray-50 rounded-2xl">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">Related products coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}