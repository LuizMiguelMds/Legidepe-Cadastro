import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Plus, 
  List, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Home,
  ChevronDown
} from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/')
    setIsProfileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const NavLink = ({ to, children, icon: Icon, className = "" }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } ${className}`}
      onClick={() => setIsMenuOpen(false)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  )

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo - mais à esquerda */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Geografia Legidepe</h1>
            </div>
          </Link>

          {/* Desktop Navigation - Centro */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            {user && (
              <>
                {/* Menu Questões */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <List className="h-4 w-4" />
                    <span>Questões</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/questions/new"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">Nova Questão</div>
                          <div className="text-xs text-gray-500">Criar questão de geografia</div>
                        </div>
                      </Link>
                      <Link
                        to="/questions"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <List className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Minhas Questões</div>
                          <div className="text-xs text-gray-500">Ver questões cadastradas</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Admin Panel (apenas para admins) - mais à direita */}
                {user.role === 'admin' && (
                  <NavLink to="/admin" icon={Shield} className="ml-4">
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* User Menu / Login - extrema direita */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-blue-100 p-1 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-3 px-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/questions"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <List className="h-4 w-4" />
                        <span>Minhas Questões</span>
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Painel Admin</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              <NavLink to="/" icon={Home} className="block">
                Início
              </NavLink>

              {user && (
                <>
                  <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Questões
                    </p>
                  </div>
                  
                  <NavLink to="/questions/new" icon={Plus} className="block ml-4">
                    Nova Questão
                  </NavLink>
                  
                  <NavLink to="/questions" icon={List} className="block ml-4">
                    Minhas Questões
                  </NavLink>

                  {user.role === 'admin' && (
                    <>
                      <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Administração
                        </p>
                      </div>
                      <NavLink to="/admin" icon={Shield} className="block ml-4">
                        Painel Admin
                      </NavLink>
                    </>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar dropdowns */}
      {(isProfileMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}