import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateComandante } from '../lib/formValidation'

export default function RegistrarComandantePage() {
  const { role, registerComandante } = useAuth()
  const navigate = useNavigate()
  const [pelotoes, setPelotoes] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idPelotao, setIdPelotao] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    supabase.from('pelotao').select('id_pelotao, nome_pelotao').then(({ data }) => {
      setPelotoes(data || [])
      if (data?.length) setIdPelotao(String(data[0].id_pelotao))
    })
  }, [])

  if (role !== 'administrador') {
    return <p className="text-brown-light">Acesso negado. Apenas administradores podem registrar Comandantes de Pelotão.</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const validation = validateComandante({ nome, email, password, idPelotao })
    if (validation) {
      setFieldErrors(validation)
      setError(Object.values(validation).join(' '))
      return
    }

    setLoading(true)
    try {
      await registerComandante(nome, email, password, parseInt(idPelotao, 10))
      navigate('/comandantes')
    } catch (err) {
      setError(err.message || 'Erro ao registrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-brown-light mb-6 font-display">Registrar Novo Comandante de Pelotão</h2>
      <form onSubmit={handleSubmit} className="bg-brown-dark p-6 rounded-xl border border-brown-light space-y-4">
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Nome <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={nome}
            onChange={(e) => { setNome(e.target.value); setFieldErrors((p) => ({ ...p, nome: null })) }}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.nome ? 'border-red-500' : 'border-brown-light'}`}
            required
          />
          {fieldErrors.nome && <p className="text-red-400 text-xs mt-1">{fieldErrors.nome}</p>}
        </div>
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Email Institucional <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: null })) }}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.email ? 'border-red-500' : 'border-brown-light'}`}
            required
          />
          {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Senha <span className="text-red-400">*</span> (mín. 6 caracteres)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: null })) }}
            minLength={6}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.password ? 'border-red-500' : 'border-brown-light'}`}
            required
          />
          {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
        </div>
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Pelotão <span className="text-red-400">*</span></label>
          <select
            value={idPelotao}
            onChange={(e) => { setIdPelotao(e.target.value); setFieldErrors((p) => ({ ...p, idPelotao: null })) }}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.idPelotao ? 'border-red-500' : 'border-brown-light'}`}
            required
          >
            <option value="">Selecione...</option>
            {pelotoes.map((p) => (
              <option key={p.id_pelotao} value={p.id_pelotao}>
                {p.nome_pelotao}
              </option>
            ))}
          </select>
          {fieldErrors.idPelotao && <p className="text-red-400 text-xs mt-1">{fieldErrors.idPelotao}</p>}
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-army-accent hover:bg-army-light text-white font-bold rounded font-body disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/comandantes')}
            className="px-6 py-2 bg-brown-light text-white font-bold rounded font-body"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
