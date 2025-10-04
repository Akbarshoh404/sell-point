import { Link } from 'react-router-dom'
import { useState } from 'react'

type Props = { product: any }

export default function ProductCard({ product }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const price = (product.price - product.discount).toFixed(2)
  const originalPrice = product.price.toFixed(2)
  const discountPercentage = product.discount > 0 ? Math.round((product.discount / product.price) * 100) : 0
  const img = (product.images && product.images[0]) || '/api/uploads/demo-phone.png'
  
  const handleImageLoad = () => {
    setImageLoaded(true)
  }
  
  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="card card-hover p-0 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {!imageLoaded && (
            <div className="absolute inset-0 loading-shimmer"></div>
          )}
          
          {!imageError ? (
            <img 
              src={img} 
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-sm text-gray-500">No Image</div>
              </div>
            </div>
          )}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-warning-500 to-warning-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Only {product.stock} left
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                Out of Stock
              </div>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                <span className="text-sm font-medium text-gray-800">View Details</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand & Model */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.brand}
            </div>
            {product.condition && (
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                product.condition === 'new' 
                  ? 'bg-success-100 text-success-700' 
                  : product.condition === 'used'
                  ? 'bg-warning-100 text-warning-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {product.condition}
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Model */}
          {product.model && (
            <div className="text-sm text-gray-600">
              {product.model}
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-gray-800">
                ${price}
              </div>
              {product.discount > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  ${originalPrice}
                </div>
              )}
            </div>
            
            {/* Stock Indicator */}
            <div className="text-right">
              {product.stock > 10 ? (
                <div className="text-xs text-success-600 font-medium">
                  ✓ In Stock
                </div>
              ) : product.stock > 0 ? (
                <div className="text-xs text-warning-600 font-medium">
                  {product.stock} left
                </div>
              ) : (
                <div className="text-xs text-error-600 font-medium">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
          
          {/* Specifications Preview */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                  <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {key}: {value}
                  </span>
                ))}
                {Object.keys(product.specifications).length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{Object.keys(product.specifications).length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}