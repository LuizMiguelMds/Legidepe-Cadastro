import { Link } from 'react-router-dom'
import { 
  Plus, 
  List, 
  Eye, 
  BookOpen, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Shield
} from 'lucide-react'

export default function Home({ user }) {
  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sistema de Questões de Geografia
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Plataforma colaborativa para criação de questões de geografia do
              Ensino Fundamental II ao Médio
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/questions/new" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Nova Questão
                </Link>
                <Link to="/questions" className="btn-secondary-white">
                  <List className="h-5 w-5 mr-2" />
                  Minhas Questões
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Começar Agora
                </Link>
                <Link to="/login" className="btn-secondary-white">
                  Fazer Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-gray-600">
            Uma plataforma completa para criar e gerenciar questões de geografia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Banco de Questões
            </h3>
            <p className="text-gray-600">
              Crie questões organizadas com validação automática e interface intuitiva
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Colaborativo
            </h3>
            <p className="text-gray-600">
              Professores e alunos contribuem juntos para construir um banco de qualidade
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Qualidade
            </h3>
            <p className="text-gray-600">
              Sistema de aprovação garante excelência e organização das questões
            </p>
          </div>
        </div>

        {/* Action Cards */}
        {user ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nova Questão */}
            <Link to="/questions/new" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Criar Nova Questão
                </h3>
                <p className="text-gray-600 text-sm">
                  Use nosso formulário intuitivo para cadastrar questões de geografia
                </p>
              </div>
            </Link>

            {/* Minhas Questões */}
            <Link to="/questions" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <List className="h-6 w-6 text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Minhas Questões
                </h3>
                <p className="text-gray-600 text-sm">
                  Visualize, edite e acompanhe o status das suas questões cadastradas
                </p>
              </div>
            </Link>

            {/* Admin Panel (apenas para admins) */}
            {user.role === 'admin' && (
              <Link to="/admin" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 group-hover:border-purple-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Painel Admin
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Aprove questões, gerencie usuários e exporte dados do sistema
                  </p>
                </div>
              </Link>
            )}
          </div>
        ) : (
          // Para usuários não logados
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Comece a contribuir hoje
            </h3>
            <p className="text-gray-600 mb-6">
              Faça login ou crie uma conta para começar a cadastrar questões de geografia
              e ajudar outros educadores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary px-6 py-3">
                Criar Conta Gratuita
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3">
                Fazer Login
              </Link>
            </div>
          </div>
        )}
      </div>

          {/* Stats Section (se usuário logado) */}
          {user && (
            <div className="stats-section py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Bem-vindo de volta, {user.username}!
                  </h3>
                  <p className="text-gray-700 mt-2">
                    Continue contribuindo para o banco de questões
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer-section py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-lg font-semibold">Geografia Legidepe</span>
              </div>
              <p className="text-gray-400">
                Desenvolvido pelo Laboratório Legidepe para facilitar o ensino de geografia
              </p>
            </div>
          </div>
        </footer>
      </div>
  )
}