import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validatePelotao } from '../lib/formValidation'

export default function RegistrarPelotaoPage() {
  const { role } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    const validation = validatePelotao({ nome })
    if (validation) {
      setFieldErrors(validation)
      setError(Object.values(validation).join(' '))
      return
    }
    setLoading(true)
    try {
      await supabase.from('pelotao').insert({ nome_pelotao: nome.trim() })
      navigate('/pelotoes')
    } catch (err) {
      setError(err.message || 'Erro ao registrar.')
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'administrador') {
    return <p className="text-brown-light">Acesso negado. Apenas administradores podem registrar pelotões.</p>
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-brown-light mb-6 font-display">Registrar Novo Pelotão</h2>
      <form onSubmit={handleSubmit} className="bg-brown-dark p-6 rounded-xl border border-brown-light">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Nome do Pelotão <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={nome}
            onChange={(e) => { setNome(e.target.value); setFieldErrors((p) => ({ ...p, nome: null })) }}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.nome ? 'border-red-500' : 'border-brown-light'}`}
            placeholder="Ex: 1º Pelotão"
            required
          />
          {fieldErrors.nome && <p className="text-red-400 text-xs mt-1">{fieldErrors.nome}</p>}
        </div>
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-army-accent hover:bg-army-light text-white font-bold rounded font-body disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/pelotoes')}
            className="px-6 py-2 bg-brown-light text-white font-bold rounded font-body"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
