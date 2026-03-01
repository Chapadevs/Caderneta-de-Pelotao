import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateLogin } from '../lib/formValidation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const validation = validateLogin({ email, password })
    if (validation) {
      setFieldErrors(validation)
      setError(Object.values(validation).join(' '))
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erro ao entrar. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-army-dark via-brown-dark to-army-dark p-4">
      <div className="w-full max-w-md bg-brown-dark p-8 md:p-12 border border-brown-light rounded-lg">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-army-accent rounded-full flex items-center justify-center p-2">
            <img src={`${import.meta.env.BASE_URL}images/EB-logo.png`} alt="Logo EB" className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-8 font-display">Acessar Painel</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-brown-light text-sm font-bold mb-2 font-body">Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: null })) }}
              className={`rounded-none appearance-none border-b-2 bg-transparent w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:border-army-accent ${fieldErrors.email ? 'border-red-500' : 'border-brown-light'}`}
              placeholder="comandante@eb.mil.br"
              required
            />
            {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-brown-light text-sm font-bold mb-2 font-body">Senha <span className="text-red-400">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: null })) }}
              className={`rounded-none appearance-none border-b-2 bg-transparent w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none focus:border-army-accent ${fieldErrors.password ? 'border-red-500' : 'border-brown-light'}`}
              required
            />
            {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
            <a href="#" className="text-sm text-army-accent hover:text-army-light" onClick={(e) => e.preventDefault()}>
              Esqueceu a senha?
            </a>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-army-accent hover:bg-army-light text-white font-bold py-3 px-4 focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:opacity-50 font-body"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
