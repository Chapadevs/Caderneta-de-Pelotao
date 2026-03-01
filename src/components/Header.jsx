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
        <div className="w-10 h-10 bg-army-accent rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{displayName.charAt(0)}</span>
        </div>
      </div>
    </header>
  )
}
