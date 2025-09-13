
import { Link } from 'react-router-dom'

type Props = { to: string; label: string }

export default function CategoryTile({ to, label }: Props) {
  return (
    <Link to={to} className="border rounded-lg p-6 hover:shadow-sm transition flex items-center justify-center font-medium">
      {label}
    </Link>
  )
}
