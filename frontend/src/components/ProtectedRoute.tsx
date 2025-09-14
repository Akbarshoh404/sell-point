
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function ProtectedRoute() {
  const { user, hydrated } = useAuth()
  if (!hydrated) return null
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
