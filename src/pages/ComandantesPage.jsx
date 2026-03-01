import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function ComandantesPage() {
  const { role } = useAuth()
  const [comandantes, setComandantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editError, setEditError] = useState('')

  useEffect(() => {
    fetchComandantes()
  }, [])

  const fetchComandantes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('comandante').select('*, pelotao!fk_comandante_pelotao(nome_pelotao)')
      if (error) throw error
      setComandantes(data || [])
    } catch (err) {
      console.error('Erro ao carregar Comandantes de Pelotão:', err)
      setComandantes([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (c) => {
    setEditing(c.comandante_id)
    setEditNome(c.nome || '')
    setEditError('')
  }

  const handleSaveEdit = async () => {
    const nomeTrimmed = editNome?.trim()
    if (!nomeTrimmed) {
      setEditError('Nome é obrigatório.')
      return
    }
    setEditError('')
    const { error } = await supabase.from('comandante').update({ nome: nomeTrimmed }).eq('comandante_id', editing)
    if (error) {
      setEditError(error.message || 'Erro ao salvar.')
      return
    }
    setEditing(null)
    fetchComandantes()
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir este Comandante de Pelotão?')) return
    await supabase.from('comandante').delete().eq('comandante_id', id)
    fetchComandantes()
  }

  if (role !== 'administrador') {
    return <p className="text-brown-light">Acesso negado.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-brown-light font-display">Comandantes de Pelotão</h2>
        <Link
          to="/registrar-comandante"
          className="px-4 py-2 bg-army-accent text-white rounded font-body hover:bg-army-light"
        >
          Registrar Comandante de Pelotão
        </Link>
      </div>
      {loading ? (
        <p className="text-brown-light">Carregando...</p>
      ) : (
        <div className="bg-brown-dark rounded-xl border border-brown-light overflow-hidden">
          <table className="w-full">
            <thead className="bg-army text-white">
              <tr>
                <th className="text-left py-3 px-4 font-body">ID</th>
                <th className="text-left py-3 px-4 font-body">Nome</th>
                <th className="text-left py-3 px-4 font-body">Email</th>
                <th className="text-left py-3 px-4 font-body">Pelotão</th>
                <th className="text-left py-3 px-4 font-body">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {comandantes.map((c) => (
                <tr key={c.comandante_id} className="border-t border-brown-light hover:bg-army/30">
                  <td className="py-3 px-4">{c.comandante_id}</td>
                  <td className="py-3 px-4">
                    {editing === c.comandante_id ? (
                      <div>
                        <input
                          value={editNome}
                          onChange={(e) => { setEditNome(e.target.value); setEditError('') }}
                          className={`px-2 py-1 bg-army-dark border rounded text-gray-100 w-full ${editError ? 'border-red-500' : 'border-brown-light'}`}
                          placeholder="Nome"
                        />
                        {editError && <p className="text-red-400 text-xs mt-1">{editError}</p>}
                      </div>
                    ) : (
                      c.nome
                    )}
                  </td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.pelotao?.nome_pelotao || '-'}</td>
                  <td className="py-3 px-4">
                    {editing === c.comandante_id ? (
                      <>
                        <button onClick={handleSaveEdit} className="text-army-accent hover:underline mr-2 text-sm">
                          Salvar
                        </button>
                        <button onClick={() => setEditing(null)} className="text-brown-light hover:underline text-sm">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(c)} className="text-army-accent hover:underline mr-2 text-sm">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(c.comandante_id)} className="text-red-400 hover:underline text-sm">
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
