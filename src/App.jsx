import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MilitaresPage from './pages/MilitaresPage'
import RegistrarMilitarPage from './pages/RegistrarMilitarPage'
import RegistrarPelotaoPage from './pages/RegistrarPelotaoPage'
import RegistrarComandantePage from './pages/RegistrarComandantePage'
import PelotoesPage from './pages/PelotoesPage'
import ComandantesPage from './pages/ComandantesPage'
import EditarPerfilPage from './pages/EditarPerfilPage'

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-army-dark flex items-center justify-center">
        <p className="text-army-accent font-body">Carregando...</p>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-army-dark flex items-center justify-center">
        <p className="text-army-accent font-body">Carregando...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <DashboardPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/militares"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <MilitaresPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/pelotoes"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <PelotoesPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/comandantes"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <ComandantesPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/registrar-militar"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <RegistrarMilitarPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/registrar-pelotao"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <RegistrarPelotaoPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/registrar-comandante"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <RegistrarComandantePage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route
        path="/editar-perfil"
        element={
          <ProtectedLayout>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="p-6 md:p-8 lg:p-10 bg-army-dark min-h-screen">
                  <EditarPerfilPage />
                </main>
              </div>
            </div>
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <div className="bg-army-dark text-gray-100 min-h-screen" style={{ fontFamily: '"Inter", sans-serif' }}>
      <BrowserRouter basename="/">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
