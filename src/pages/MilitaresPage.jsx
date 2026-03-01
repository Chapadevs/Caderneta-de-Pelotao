import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { validateMilitar } from '../lib/formValidation'

function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const s = String(dateStr).split('T')[0]
  const parts = s.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return new Date(dateStr)
  return new Date(parts[0], parts[1] - 1, parts[2])
}

function formatDate(d) {
  if (!d) return '-'
  const date = parseLocalDate(d)
  return date.toLocaleDateString('pt-BR')
}

function getBirthdayStatus(dataAniversario) {
  if (!dataAniversario) return { label: '-', color: 'bg-gray-600' }
  const today = new Date()
  const bday = parseLocalDate(dataAniversario)
  bday.setFullYear(today.getFullYear())
  const diff = (bday - today) / (1000 * 60 * 60 * 24)
  if (diff === 0) return { label: 'Hoje', color: 'bg-army-accent' }
  if (diff > 0 && diff <= 7) return { label: 'Esta semana', color: 'bg-yellow-600' }
  if (diff > 0 && diff <= 30) return { label: 'Este mês', color: 'bg-brown-light' }
  return { label: '-', color: 'bg-gray-600' }
}

export default function MilitaresPage() {
  const { role, profile } = useAuth()
  const [militares, setMilitares] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('todos')
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({})
  const [editError, setEditError] = useState('')
  const [viewingMilitar, setViewingMilitar] = useState(null)

  useEffect(() => {
    fetchMilitares()
  }, [role, profile])

  const fetchMilitares = async () => {
    try {
      setLoading(true)
      let query = supabase.from('militar').select('*, pelotao(nome_pelotao)')
      if (role === 'comandante' && profile?.id_pelotao) {
        query = query.eq('id_pelotao', profile.id_pelotao)
      }
      const { data, error } = await query
      if (error) throw error
      setMilitares(data || [])
    } catch (err) {
      console.error('Erro ao carregar militares:', err)
      setMilitares([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = militares.filter((m) => {
    const matchSearch = !search || m.nome?.toLowerCase().includes(search.toLowerCase())
    if (tab === 'todos') return matchSearch
    const today = new Date()
    const bday = parseLocalDate(m.data_aniversario)
    if (!bday) return false
    bday.setFullYear(today.getFullYear())
    const diff = (bday - today) / (1000 * 60 * 60 * 24)
    if (tab === 'hoje') return diff === 0 && matchSearch
    if (tab === 'semana') return diff > 0 && diff <= 7 && matchSearch
    if (tab === 'mes') return diff > 0 && diff <= 30 && matchSearch
    return matchSearch
  })

  const handleDelete = async (id, skipConfirm = false) => {
    if (!skipConfirm && !confirm('Excluir este militar?')) return
    await supabase.from('militar').delete().eq('militar_id', id)
    fetchMilitares()
  }

  const handleEdit = (m) => {
    setEditing(m.militar_id)
    setEditError('')
    setFormData({
      nome: m.nome || '',
      tipo_sanguineo: m.tipo_sanguineo || '',
      data_aniversario: m.data_aniversario ? m.data_aniversario.split('T')[0] : '',
      endereco: m.endereco || '',
      telefone: m.telefone || '',
      fiib: m.fiib || '',
      faat: m.faat || '',
    })
  }

  const handleSaveEdit = async () => {
    setEditError('')
    const validation = validateMilitar({ nome: formData.nome })
    if (validation) {
      setEditError(Object.values(validation).join(' '))
      return
    }

    const payload = {
      nome: formData.nome?.trim() || '',
      tipo_sanguineo: formData.tipo_sanguineo?.trim() || null,
      data_aniversario: formData.data_aniversario || null,
      endereco: String(formData.endereco ?? '').trim() || null,
      telefone: formData.telefone?.trim() || null,
      fiib: formData.fiib?.trim() || null,
      faat: formData.faat?.trim() || null,
    }
    const { error } = await supabase.from('militar').update(payload).eq('militar_id', editing)
    if (error) {
      setEditError(error.message || 'Erro ao salvar.')
      return
    }
    setEditing(null)
    fetchMilitares()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-brown-light font-display">Gerenciar Efetivo</h2>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-brown-dark border border-brown-light rounded text-gray-100 focus:outline-none focus:border-army-accent font-body w-64"
        />
        <div className="flex flex-col gap-2">
          <span className="text-brown-light text-sm font-body font-bold">Aniversário:</span>
          <div className="flex gap-2">
            {['todos', 'hoje', 'semana', 'mes'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded font-body text-sm ${
                  tab === t ? 'bg-army-accent text-white' : 'bg-brown-dark text-brown-light hover:bg-army'
                }`}
              >
                {t === 'todos' ? 'Todos' : t === 'hoje' ? 'Hoje' : t === 'semana' ? 'Esta semana' : 'Este mês'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-brown-light">Carregando...</p>
      ) : (
        <div className="bg-brown-dark rounded-xl border border-brown-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-army text-white">
                <tr>
                  <th className="text-left py-3 px-4 font-body">Nome</th>
                  <th className="text-left py-3 px-4 font-body">Pelotão</th>
                  <th className="text-left py-3 px-4 font-body">Tipo Sanguíneo</th>
                  <th className="text-left py-3 px-4 font-body">Data de nascimento</th>
                  <th className="text-left py-3 px-4 font-body">Status</th>
                  <th className="text-left py-3 px-4 font-body">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filtered.map((m) => (
                  <tr key={m.militar_id} className="border-t border-brown-light hover:bg-army/30">
                    {editing === m.militar_id ? (
                      <>
                        <td colSpan={6} className="p-4">
                          {editError && (
                            <div className="mb-3 p-2 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">{editError}</div>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <input
                              placeholder="Nome *"
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <input
                              placeholder="Tipo sanguíneo"
                              value={formData.tipo_sanguineo}
                              onChange={(e) => setFormData({ ...formData, tipo_sanguineo: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <input
                              type="date"
                              value={formData.data_aniversario}
                              onChange={(e) => setFormData({ ...formData, data_aniversario: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100 [color-scheme:dark]"
                            />
                            <input
                              placeholder="Endereço"
                              value={formData.endereco}
                              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <input
                              placeholder="Telefone"
                              value={formData.telefone}
                              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <input
                              placeholder="FIIB"
                              value={formData.fiib}
                              onChange={(e) => setFormData({ ...formData, fiib: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <input
                              placeholder="FAAT"
                              value={formData.faat}
                              onChange={(e) => setFormData({ ...formData, faat: e.target.value })}
                              className="px-3 py-2 bg-army-dark border border-brown-light rounded text-gray-100"
                            />
                            <div className="col-span-2 flex gap-2">
                              <button onClick={handleSaveEdit} className="px-4 py-2 bg-army-accent rounded font-body">
                                Salvar
                              </button>
                              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-brown-light rounded font-body">
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-body">{m.nome}</td>
                        <td className="py-3 px-4 font-body">{m.pelotao?.nome_pelotao || '-'}</td>
                        <td className="py-3 px-4 font-body">{m.tipo_sanguineo || '-'}</td>
                        <td className="py-3 px-4 font-body">{formatDate(m.data_aniversario)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getBirthdayStatus(m.data_aniversario).color}`}>
                            {getBirthdayStatus(m.data_aniversario).label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setViewingMilitar(m)}
                            className="px-3 py-1 bg-army-accent hover:bg-army-light text-white rounded font-body text-sm"
                          >
                            Ver mais
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-brown-light py-8">Nenhum militar encontrado.</p>
          )}
        </div>
      )}

      {viewingMilitar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setViewingMilitar(null)}>
          <div
            className="bg-brown-dark border border-brown-light rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-display text-white">Informações do Militar</h3>
              <button
                onClick={() => setViewingMilitar(null)}
                className="text-brown-light hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 font-body text-gray-300">
              <div><span className="text-brown-light font-bold">Nome:</span> {viewingMilitar.nome || '-'}</div>
              <div><span className="text-brown-light font-bold">Pelotão:</span> {viewingMilitar.pelotao?.nome_pelotao || '-'}</div>
              <div><span className="text-brown-light font-bold">Tipo Sanguíneo:</span> {viewingMilitar.tipo_sanguineo || '-'}</div>
              <div><span className="text-brown-light font-bold">Data de nascimento:</span> {formatDate(viewingMilitar.data_aniversario)}</div>
              <div>
                <span className="text-brown-light font-bold">Status:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${getBirthdayStatus(viewingMilitar.data_aniversario).color}`}>
                  {getBirthdayStatus(viewingMilitar.data_aniversario).label}
                </span>
              </div>
              <div><span className="text-brown-light font-bold">Endereço:</span> {viewingMilitar.endereco || '-'}</div>
              <div><span className="text-brown-light font-bold">Telefone:</span> {viewingMilitar.telefone || '-'}</div>
              <div><span className="text-brown-light font-bold">FIIB:</span> {viewingMilitar.fiib || '-'}</div>
              <div><span className="text-brown-light font-bold">FAAT:</span> {viewingMilitar.faat || '-'}</div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-brown-light">
              <button
                onClick={() => {
                  handleEdit(viewingMilitar)
                  setViewingMilitar(null)
                }}
                className="px-4 py-2 bg-army-accent hover:bg-army-light text-white rounded font-body"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm('Excluir este militar?')) {
                    handleDelete(viewingMilitar.militar_id, true)
                    setViewingMilitar(null)
                  }
                }}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 rounded font-body"
              >
                Excluir
              </button>
              <button
                onClick={() => setViewingMilitar(null)}
                className="px-4 py-2 bg-brown-light hover:bg-brown-dark text-white rounded font-body"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
