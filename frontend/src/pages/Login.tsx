import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Login() {
  const nav = useNavigate()
  const { setUser, hydrate, user, hydrated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (hydrated && user) nav('/') }, [hydrated, user, nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setUser(data.user)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-success-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230ea5e9" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="text-center space-y-4 mb-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="heading-secondary text-gradient">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your SellPoint account</p>
          </div>

          {/* Form */}
          <div className="card p-8 animate-fade-in-up animate-delay-200">
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                <div className="flex items-center">
                  <span className="text-error-500 mr-2">⚠️</span>
                  <span className="text-error-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              <div className="form-group">
                <label className="label">Email Address</label>
                <input 
                  className="input" 
                  placeholder="Enter your email"
                  type="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Password</label>
                <input 
                  className="input" 
                  placeholder="Enter your password"
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to SellPoint?</span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="btn-outline w-full text-lg py-4"
              >
                Create New Account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in-up animate-delay-400">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}