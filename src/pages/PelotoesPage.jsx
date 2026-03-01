import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function PelotoesPage() {
  const { role } = useAuth()
  const [pelotoes, setPelotoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editError, setEditError] = useState('')

  useEffect(() => {
    fetchPelotoes()
  }, [])

  const fetchPelotoes = async () => {
    try {
      setLoading(true)
      const { data: pelData, error: pelError } = await supabase.from('pelotao').select('*')
      if (pelError) throw pelError
      const { data: cmdData, error: cmdError } = await supabase.from('comandante').select('id_pelotao, nome')
      if (cmdError) throw cmdError
      const cmdMap = Object.fromEntries((cmdData || []).map((c) => [c.id_pelotao, c.nome]))
      const rows = (pelData || []).map((p) => ({
        ...p,
        comandante_nome: cmdMap[p.id_pelotao] || null,
      }))
      setPelotoes(rows)
    } catch (err) {
      console.error('Erro ao carregar pelotões:', err)
      setPelotoes([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setEditing(p.id_pelotao)
    setEditNome(p.nome_pelotao || '')
    setEditError('')
  }

  const handleSaveEdit = async () => {
    const nomeTrimmed = editNome?.trim()
    if (!nomeTrimmed) {
      setEditError('Nome é obrigatório.')
      return
    }
    setEditError('')
    const { error } = await supabase.from('pelotao').update({ nome_pelotao: nomeTrimmed }).eq('id_pelotao', editing)
    if (error) {
      setEditError(error.message || 'Erro ao salvar.')
      return
    }
    setEditing(null)
    fetchPelotoes()
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir este pelotão?')) return
    await supabase.from('pelotao').delete().eq('id_pelotao', id)
    fetchPelotoes()
  }

  if (role !== 'administrador') {
    return <p className="text-brown-light">Acesso negado.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-brown-light font-display">Pelotões</h2>
        <Link
          to="/registrar-pelotao"
          className="px-4 py-2 bg-army-accent text-white rounded font-body hover:bg-army-light"
        >
          Registrar Pelotão
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
                <th className="text-left py-3 px-4 font-body">Comandante de Pelotão</th>
                <th className="text-left py-3 px-4 font-body">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {pelotoes.map((p) => (
                <tr key={p.id_pelotao} className="border-t border-brown-light hover:bg-army/30">
                  <td className="py-3 px-4">{p.id_pelotao}</td>
                  <td className="py-3 px-4">
                    {editing === p.id_pelotao ? (
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
                      p.nome_pelotao
                    )}
                  </td>
                  <td className="py-3 px-4">{p.comandante_nome || '-'}</td>
                  <td className="py-3 px-4">
                    {editing === p.id_pelotao ? (
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
                        <button onClick={() => handleEdit(p)} className="text-army-accent hover:underline mr-2 text-sm">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(p.id_pelotao)} className="text-red-400 hover:underline text-sm">
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
