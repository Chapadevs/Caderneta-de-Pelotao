import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const { role, profile } = useAuth()
  const [stats, setStats] = useState({
    totalMilitares: 0,
    totalPelotoes: 0,
    totalComandantes: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      let milQuery = supabase.from('militar').select('*', { count: 'exact', head: true })
      if (role === 'comandante' && profile?.id_pelotao) {
        milQuery = milQuery.eq('id_pelotao', profile.id_pelotao)
      }
      const { count: milCount } = await milQuery

      const { count: pelCount } = await supabase.from('pelotao').select('*', { count: 'exact', head: true })
      const { count: cmdCount } = await supabase.from('comandante').select('*', { count: 'exact', head: true })
      setStats({
        totalMilitares: milCount || 0,
        totalPelotoes: pelCount || 0,
        totalComandantes: cmdCount || 0,
      })
    }
    fetchStats()
  }, [role, profile?.id_pelotao])

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-brown-dark p-6 rounded-xl shadow-lg border-l-4 ${color} transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brown-light uppercase font-body">{label}</p>
          <p className="text-3xl font-bold text-white font-display">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  )

  const statsData = [
    { icon: '👥', label: 'Total de Militares', value: stats.totalMilitares.toLocaleString('pt-BR'), color: 'border-army-accent' },
    { icon: '🎖️', label: 'Pelotões', value: stats.totalPelotoes.toString(), color: 'border-army-accent' },
    { icon: '🛡️', label: 'Comandantes de Pelotão', value: stats.totalComandantes.toString(), color: 'border-army-accent' },
    { icon: '📋', label: 'Efetivo Ativo', value: stats.totalMilitares.toLocaleString('pt-BR'), color: 'border-army-accent' },
  ]

  const QuickActionButton = ({ to, icon, label }) => (
    <Link
      to={to}
      className="bg-army-accent text-white py-3 px-6 rounded-lg shadow-md hover:bg-army-light hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center font-body"
    >
      {icon}
      <span className="ml-2 font-semibold">{label}</span>
    </Link>
  )

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl text-brown-light mb-4 font-display">Visão Geral</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <section className="bg-brown-dark p-6 rounded-xl shadow-lg border border-brown-light">
        <h2 className="text-2xl text-brown-light mb-4 font-display">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          {role === 'comandante' && (
            <QuickActionButton
              to="/registrar-militar"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
              label="Registrar Novo Militar"
            />
          )}
          {role === 'administrador' && (
            <>
              <QuickActionButton
                to="/registrar-pelotao"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
                label="Registrar Pelotão"
              />
              <QuickActionButton
                to="/registrar-comandante"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
                label="Registrar Comandante de Pelotão"
              />
            </>
          )}
          <QuickActionButton
            to="/militares"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            }
            label="Ver Efetivo"
          />
        </div>
      </section>

      <section className="relative bg-black rounded-xl shadow-lg overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/logobtl.jpg`}
          alt="Caderneta do Comandante de Pelotão"
          className="w-full object-contain max-h-64 md:max-h-72 lg:max-h-80 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-army-dark to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h3 className="text-4xl font-bold text-white font-display">Caderneta do Comandante de Pelotão</h3>
          <p className="text-lg text-army-accent mt-2 font-body">A melhor unidade de guerra do mundo!</p>
        </div>
      </section>
    </div>
  )
}
