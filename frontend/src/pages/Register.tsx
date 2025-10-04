import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Register() {
  const nav = useNavigate()
  const { setUser, hydrate, user, hydrated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (hydrated && user) nav('/') }, [hydrated, user, nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await api.post('/api/auth/register', { email, password, name, role })
      setUser(data.user)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50 via-primary-50 to-success-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dd57ff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="text-center space-y-4 mb-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="heading-secondary text-gradient">Join SellPoint</h1>
            <p className="text-gray-600">Create your account and start buying or selling electronics</p>
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
                <label className="label">Full Name</label>
                <input 
                  className="input" 
                  placeholder="Enter your full name"
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Create a strong password"
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div className="form-group">
                <label className="label">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'buyer'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🛍️</div>
                      <div className="font-medium">Buyer</div>
                      <div className="text-xs mt-1">Shop electronics</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'seller'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏪</div>
                      <div className="font-medium">Seller</div>
                      <div className="text-xs mt-1">Sell electronics</div>
                    </div>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
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
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="btn-outline w-full text-lg py-4"
              >
                Sign In Instead
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in-up animate-delay-400">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{' '}
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