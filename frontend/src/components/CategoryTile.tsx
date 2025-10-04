import { Link } from 'react-router-dom'

type Props = { to: string; label: string }

export default function CategoryTile({ to, label }: Props) {
  // Extract emoji and text from label
  const emoji = label.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)?.[0] || '📦'
  const text = label.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u, '').trim()
  
  // Define gradient colors for different categories
  const getGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'phones':
        return 'from-blue-500 to-purple-600'
      case 'laptops':
        return 'from-green-500 to-teal-600'
      case 'pcs':
        return 'from-gray-500 to-slate-600'
      case 'consoles':
        return 'from-red-500 to-pink-600'
      case 'accessories':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-primary-500 to-accent-600'
    }
  }

  return (
    <Link to={to} className="group block">
      <div className={`card card-hover p-6 text-center relative overflow-hidden bg-gradient-to-br ${getGradient(text)}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Ccircle cx="20" cy="20" r="1"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Content */}
        <div className="relative z-10 space-y-3">
          {/* Emoji */}
          <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          
          {/* Text */}
          <div className="text-white font-semibold text-lg group-hover:text-white/90 transition-colors duration-300">
            {text}
          </div>
          
          {/* Hover Arrow */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white/80 text-sm font-medium">
              Shop Now →
            </div>
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </Link>
  )
}