import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateMilitar } from '../lib/formValidation'

export default function RegistrarMilitarPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({
    nome: '',
    tipo_sanguineo: '',
    data_aniversario: '',
    endereco: '',
    telefone: '',
    fiib: '',
    faat: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const validation = validateMilitar({ nome: form.nome })
    if (validation) {
      setFieldErrors(validation)
      setError(Object.values(validation).join(' '))
      return
    }

    setLoading(true)
    try {
      const payload = {
        nome: form.nome.trim(),
        tipo_sanguineo: form.tipo_sanguineo?.trim() || null,
        data_aniversario: form.data_aniversario || null,
        endereco: String(form.endereco ?? '').trim() || null,
        telefone: form.telefone?.trim() || null,
        fiib: form.fiib?.trim() || null,
        faat: form.faat?.trim() || null,
        id_pelotao: profile?.id_pelotao,
      }
      await supabase.from('militar').insert(payload)
      navigate('/militares')
    } catch (err) {
      setError(err.message || 'Erro ao registrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-brown-light mb-6 font-display">Registrar Novo Militar</h2>
      <form onSubmit={handleSubmit} className="bg-brown-dark p-6 rounded-xl border border-brown-light space-y-4">
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Nome <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => { setForm({ ...form, nome: e.target.value }); setFieldErrors((prev) => ({ ...prev, nome: null })) }}
            className={`w-full px-4 py-2 bg-army-dark border rounded text-gray-100 focus:outline-none focus:border-army-accent ${fieldErrors.nome ? 'border-red-500' : 'border-brown-light'}`}
            placeholder="Nome completo"
            required
          />
          {fieldErrors.nome && <p className="text-red-400 text-xs mt-1">{fieldErrors.nome}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-brown-light text-sm font-bold mb-2 font-body">Tipo Sanguíneo</label>
            <input
              type="text"
              value={form.tipo_sanguineo}
              onChange={(e) => setForm({ ...form, tipo_sanguineo: e.target.value })}
              placeholder="Ex: O+"
              className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
            />
          </div>
          <div>
            <label className="block text-brown-light text-sm font-bold mb-2 font-body">Data de Aniversário</label>
            <input
              type="date"
              value={form.data_aniversario}
              onChange={(e) => setForm({ ...form, data_aniversario: e.target.value })}
              className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
            />
          </div>
        </div>
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Endereço</label>
          <input
            type="text"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
          />
        </div>
        <div>
          <label className="block text-brown-light text-sm font-bold mb-2 font-body">Telefone</label>
          <input
            type="text"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-brown-light text-sm font-bold mb-2 font-body">FIIB</label>
            <input
              type="text"
              value={form.fiib}
              onChange={(e) => setForm({ ...form, fiib: e.target.value })}
              className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
            />
          </div>
          <div>
            <label className="block text-brown-light text-sm font-bold mb-2 font-body">FAAT</label>
            <input
              type="text"
              value={form.faat}
              onChange={(e) => setForm({ ...form, faat: e.target.value })}
              className="w-full px-4 py-2 bg-army-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent"
            />
          </div>
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
            onClick={() => navigate('/militares')}
            className="px-6 py-2 bg-brown-light text-white font-bold rounded font-body"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
