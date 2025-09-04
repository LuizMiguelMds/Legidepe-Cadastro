import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Users, 
  FileText, 
  Clock,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react'

export default function AdminPanel({ user }) {
  const [questions, setQuestions] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    total_questions: 0,
    pending_questions: 0,
    total_users: 0,
    approved_today: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData()
    }
  }, [user, statusFilter])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Carregar questões
      const questionsResponse = await fetch(
        `http://localhost:8000/admin/questions?status=${statusFilter}`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      // Carregar estatísticas
      const statsResponse = await fetch(
        'http://localhost:8000/admin/stats', 
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      // Carregar usuários (apenas se na aba de usuários)
      if (activeTab === 'users') {
        const usersResponse = await fetch(
          'http://localhost:8000/admin/users', 
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }
      }
      
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json()
        setQuestions(questionsData)
      }
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionAction = async (questionId, action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:8000/admin/questions/${questionId}/${action}`, 
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      
      if (response.ok) {
        // Recarregar dados
        loadAdminData()
        
        // Mostrar notificação de sucesso
        const actionText = action === 'approve' ? 'aprovada' : 'rejeitada'
        alert(`Questão ${actionText} com sucesso!`)
      }
    } catch (error) {
      console.error('Erro ao processar ação:', error)
      alert('Erro ao processar ação. Tente novamente.')
    }
  }

  const exportData = async (format = 'xlsx') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:8000/admin/export?format=${format}`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `questoes_geografia_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('Erro ao exportar dados. Tente novamente.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie questões e usuários do sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportData('xlsx')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={() => exportData('json')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Questões</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_questions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_questions}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários</p>
              <p className="text-3xl font-bold text-green-600">{stats.total_users}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas Hoje</p>
              <p className="text-3xl font-bold text-purple-600">{stats.approved_today}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => {
                setActiveTab('pending')
                setStatusFilter('pending')
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Questões Pendentes
            </button>
            <button
              onClick={() => {
                setActiveTab('approved')
                setStatusFilter('approved')
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Questões Aprovadas
            </button>
            <button
              onClick={() => {
                setActiveTab('rejected')
                setStatusFilter('rejected')
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Questões Rejeitadas
            </button>
            <button
              onClick={() => {
                setActiveTab('users')
                loadAdminData()
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Usuários
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : activeTab === 'users' ? (
            // Users Tab
            <div className="space-y-4">
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Questões
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cadastro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Função
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.question_count || 0} questões
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(user.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Usuário'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum usuário encontrado</p>
              )}
            </div>
          ) : (
            // Questions Tab
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map(question => (
                  <div key={question.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {question.tema_principal} - {question.subtopico}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Por: {question.user?.username} • ID: #{question.id} • 
                          {formatDate(question.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-3">
                        {question.enunciado}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {question.nivel_escolar}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {question.tipo_questao}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/questions/${question.id}`}
                          className="btn-secondary flex items-center space-x-1 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver</span>
                        </Link>
                        
                        {question.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleQuestionAction(question.id, 'approve')}
                              className="btn-success flex items-center space-x-1 text-sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Aprovar</span>
                            </button>
                            <button
                              onClick={() => handleQuestionAction(question.id, 'reject')}
                              className="btn-danger flex items-center space-x-1 text-sm"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Rejeitar</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma questão encontrada
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'pending' 
                      ? 'Não há questões pendentes no momento'
                      : `Não há questões ${activeTab === 'approved' ? 'aprovadas' : 'rejeitadas'} no momento`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}