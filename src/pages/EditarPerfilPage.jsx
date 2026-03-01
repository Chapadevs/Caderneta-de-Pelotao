import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateEditarPerfil } from '../lib/formValidation'

export default function EditarPerfilPage() {
  const { profile, role } = useAuth()
  const [nome, setNome] = useState(profile?.nome || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setFieldErrors({})

    const validation = validateEditarPerfil({ nome, password })
    if (validation) {
      setFieldErrors(validation)
      setMessage(Object.values(validation).join(' '))
      return
    }

    setLoading(true)
    try {
      const table = role === 'administrador' ? 'administrador' : 'comandante'
      const idCol = role === 'administrador' ? 'administrador_id' : 'comandante_id'
      await supabase.from(table).update({ nome: nome.trim() }).eq(idCol, profile?.id)

      if (password && password.length >= 6) {
        await supabase.auth.updateUser({ password })
      }
      setMessage('Perfil atualizado com sucesso.')
      setPassword('')
    } catch (err) {
      setMessage(err.message || 'Erro ao atualizar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-brown-light mb-6 font-display">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="bg-brown-dark p-6 rounded-xl border border-brown-light space-y-4">
        {message && (
          <div className={`p-3 rounded text-sm ${message.includes('sucesso') ? 'bg-army-accent/30 text-army-accent' : 'bg-red-900/50 text-red-200'}`}>
            {message}
          </div>
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
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Nova senha (deixe em branco para manter)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: null })) }}
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.password ? 'border-red-500' : 'border-brown-light'}`}
          />
          {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-army-accent hover:bg-army-light text-white font-bold rounded font-body disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}
