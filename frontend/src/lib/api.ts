
import axios from 'axios'
import { useAuth } from '../store/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001',
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any)['Authorization'] = `Bearer ${token}`
  }
  return config
})
