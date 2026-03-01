import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center w-full px-4 py-3 text-left transition-colors duration-200 font-body ${
        isActive ? 'bg-army-accent text-white' : 'text-brown-light hover:bg-army hover:text-white'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
)

export default function Sidebar() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const adminItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/militares', icon: '👥', label: 'Militares' },
    { to: '/pelotoes', icon: '🏛️', label: 'Pelotões' },
    { to: '/comandantes', icon: '🎖️', label: 'Comandantes de Pelotão' },
    { to: '/editar-perfil', icon: '👤', label: 'Editar Perfil' },
    { to: '/registrar-pelotao', icon: '➕', label: 'Registrar Pelotão' },
    { to: '/registrar-comandante', icon: '➕', label: 'Registrar Comandante de Pelotão' },
  ]

  const comandanteItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/militares', icon: '👥', label: 'Militares' },
    { to: '/editar-perfil', icon: '👤', label: 'Editar Perfil' },
    { to: '/registrar-militar', icon: '➕', label: 'Registrar Militar' },
  ]

  const items = role === 'administrador' ? adminItems : comandanteItems

  return (
    <aside className="bg-brown-dark text-white w-64 min-h-screen fixed top-0 left-0 flex flex-col border-r border-brown-light">
      <div className="flex items-center justify-center p-6 border-b border-brown-light">
        <img
          src={`${import.meta.env.BASE_URL}images/EB-logo.png`}
          alt="Exército Brasileiro"
          className="w-12 h-12 object-contain mr-3"
        />
        <span className="text-xl font-bold tracking-wider font-display">CADERNETA</span>
      </div>
      <nav className="flex-1 py-4">
        {items.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <div className="p-4 border-t border-brown-light">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-left text-brown-light hover:bg-red-900/50 hover:text-white transition-colors duration-200 rounded-lg font-body"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  )
}
