import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { profile, role } = useAuth()
  const displayName = profile?.nome || 'Usuário'

  return (
    <header className="bg-army border-b border-brown-light px-6 py-4 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <span className="text-brown-light text-sm font-body">
          Bem-vindo, {displayName}
          {role === 'administrador' ? ' (Administrador)' : ' (Comandante de Pelotão)'}
        </span>
        <img
          src={`${import.meta.env.BASE_URL}images/logobtl.jpg`}
          alt="Logo BTL"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  )
}
