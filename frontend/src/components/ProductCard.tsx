
import { Link } from 'react-router-dom'

type Props = { product: any }

export default function ProductCard({ product }: Props) {
  const price = (product.price - product.discount).toFixed(2)
  const img = (product.images && product.images[0]) || '/api/uploads/demo-phone.png'
  return (
    <Link to={`/product/${product.id}`} className="group border rounded-lg p-4 hover:shadow-lg transition bg-white">
      <div className="aspect-square w-full rounded mb-3 overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <img src={img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="text-xs text-gray-500 mb-1">{product.brand} {product.model}</div>
      <div className="font-medium group-hover:underline mb-1 line-clamp-2">{product.title}</div>
      <div className="text-lg text-emerald-700">${price}</div>
    </Link>
  )
}
