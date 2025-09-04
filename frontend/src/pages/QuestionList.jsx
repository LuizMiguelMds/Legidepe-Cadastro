import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Edit, Clock, CheckCircle, XCircle, Plus, Filter } from 'lucide-react'

export default function QuestionList({ user }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    loadQuestions()
    loadStats()
  }, [statusFilter])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`http://localhost:8000/questions/my?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('DADOS DA API:', data) // DEBUG - Ver dados retornados
        setQuestions(data)
      }
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const [total, pending, approved, rejected] = await Promise.all([
        fetch('http://localhost:8000/questions/count', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8000/questions/count?status=pending', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8000/questions/count?status=approved', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8000/questions/count?status=rejected', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      
      const [totalData, pendingData, approvedData, rejectedData] = await Promise.all([
        total.json(), pending.json(), approved.json(), rejected.json()
      ])
      
      setStats({
        total: totalData.total,
        pending: pendingData.total,
        approved: approvedData.total,
        rejected: rejectedData.total
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovada
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitada
          </span>
        )
      default:
        return <span className="text-gray-500">{status}</span>
    }
  }

  const filteredQuestions = questions.filter(question =>
    question.tema_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.subtopico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.enunciado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
        <p className="text-gray-600">Você precisa fazer login para ver as questões.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Questões</h1>
          <p className="text-gray-600 mt-2">Gerencie suas questões cadastradas</p>
        </div>
        <Link to="/questions/new" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Questão</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Buscar por tema, subtópico ou enunciado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Filtrar por Status</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovada</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando questões...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => {
              return (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {question.tema_principal} - {question.subtopico}
                        </h3>
                        {getStatusBadge(question.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {question.enunciado}
                      </p>
                      
                      {/* Seção da imagem com debug visual */}
                      {question.url_imagem ? (
                        <div className="mb-3">
                          <img
                            src={`http://localhost:8000${question.url_imagem}`}
                            alt={question.descricao_imagem || 'Imagem da questão'}
                            className="w-32 h-24 object-cover rounded border"
                            onError={(e) => {
                              console.log('ERRO AO CARREGAR IMAGEM:', e.target.src);
                              e.target.style.border = '2px solid red';
                              e.target.alt = 'Erro ao carregar imagem';
                            }}
                            onLoad={() => {
                              console.log('IMAGEM CARREGADA COM SUCESSO:', question.url_imagem);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mb-3 p-2 bg-gray-100 border border-dashed border-gray-300 rounded text-center">
                          <p className="text-xs text-gray-500">Sem imagem</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: #{question.id}</span>
                        <span>Nível: {question.nivel_escolar}</span>
                        {question.ano_questao && <span>Ano: {question.ano_questao}</span>}
                        {question.banca && <span>Banca: {question.banca}</span>}
                        <span>
                          Criada: {new Date(question.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/questions/${question.id}`}
                        className="btn-secondary flex items-center space-x-1 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver</span>
                      </Link>
                      {(question.status === 'pending' || question.status === 'rejected') && (
                        <Link
                          to={`/questions/edit/${question.id}`}
                          className="btn-secondary flex items-center space-x-1 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Você ainda não criou nenhuma questão'}
            </p>
            <Link to="/questions/new" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Questão
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}