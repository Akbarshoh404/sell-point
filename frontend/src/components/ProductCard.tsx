
import { Link } from 'react-router-dom'

type Props = { product: any }

export default function ProductCard({ product }: Props) {
  const price = (product.price - product.discount).toFixed(2)
  return (
    <Link to={`/product/${product.id}`} className="group border rounded-lg p-4 hover:shadow-sm transition">
      <div className="aspect-square w-full bg-gray-50 rounded mb-3 flex items-center justify-center text-gray-300">IMG</div>
      <div className="text-xs text-gray-500 mb-1">{product.brand} {product.model}</div>
      <div className="font-medium group-hover:underline mb-1 line-clamp-2">{product.title}</div>
      <div className="text-lg">${price}</div>
    </Link>
  )
}
