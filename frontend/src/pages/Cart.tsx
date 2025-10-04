import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../store/cart'
import { API_BASE } from '../lib/config'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, fetch, update, remove, checkout, loading } = useCart()
  const [products, setProducts] = useState<Record<number, any>>({})
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => {
    (async () => {
      const map: Record<number, any> = {}
      for (const it of items) {
        try {
          const r = await fetch(`${API_BASE}/api/products/${it.productId}`)
          map[it.productId] = await r.json()
        } catch (error) {
          console.error(`Failed to fetch product ${it.productId}:`, error)
        }
      }
      setProducts(map)
    })()
  }, [items])

  const total = useMemo(() => items.reduce((sum, it) => {
    const p = products[it.productId]
    const price = p ? (p.price - p.discount) : 0
    return sum + price * it.quantity
  }, 0), [items, products])

  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items])

  async function onCheckout() {
    setCheckoutLoading(true)
    try {
      const result = await checkout()
      if (result) {
        setCheckoutSuccess(true)
        setTimeout(() => setCheckoutSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="heading-secondary text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link to="/" className="btn-primary text-lg px-8 py-4">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-secondary text-gradient-secondary">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <Link to="/" className="btn-outline">
            Continue Shopping
          </Link>
        </div>

        {/* Success Message */}
        {checkoutSuccess && (
          <div className="card p-6 bg-success-50 border border-success-200 animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-success-500 text-2xl mr-3">✅</span>
              <div>
                <h3 className="font-semibold text-success-800">Order Placed Successfully!</h3>
                <p className="text-success-700">Your order has been confirmed and will be processed soon.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const product = products[item.productId]
              const price = product ? (product.price - product.discount) : 0
              const img = (product?.images && product.images[0]) || '/api/uploads/demo-phone.png'
              
              return (
                <div key={item.id} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      <img 
                        src={img} 
                        alt={product?.title || `Product ${item.productId}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {product?.title || `Product #${item.productId}`}
                        </h3>
                        {product?.brand && (
                          <p className="text-sm text-gray-500">{product.brand} {product.model}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-800">
                          ${price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${(price * item.quantity).toFixed(2)} total
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => update(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => update(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => remove(item.id)}
                        className="text-error-600 hover:text-error-700 text-sm font-medium transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card p-6 animate-fade-in-up animate-delay-300">
              <h2 className="heading-tertiary text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-success-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-gray-800">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
            </div>

            {/* Security Badge */}
            <div className="card p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200">
              <div className="flex items-center space-x-3">
                <span className="text-success-600 text-xl">🛡️</span>
                <div>
                  <h3 className="font-semibold text-success-800">Secure Checkout</h3>
                  <p className="text-sm text-success-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Have questions about your order or need assistance?
              </p>
              <Link to="/contact" className="btn-outline text-sm w-full">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}