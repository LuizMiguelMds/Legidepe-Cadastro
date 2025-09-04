import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Clock, CheckCircle, XCircle, Image, BookOpen, Target, Calendar, User } from 'lucide-react'
import API_URL from '../config/api.js'

export default function QuestionDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadQuestion()
  }, [id])

  const loadQuestion = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/questions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setQuestion(data)
      } else if (response.status === 404) {
        setError('Questão não encontrada')
      } else {
        setError('Erro ao carregar questão')
      }
    } catch (error) {
      console.error('Erro ao carregar questão:', error)
      setError('Erro ao carregar questão')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-2" />
            Pendente
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovada
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-2" />
            Rejeitada
          </span>
        )
      default:
        return <span className="text-gray-500">{status}</span>
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
        <p className="text-gray-600">Você precisa fazer login para ver esta questão.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando questão...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/questions')}
            className="btn-primary"
          >
            Voltar às Questões
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/questions"
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Questão #{question.id}
            </h1>
            <p className="text-gray-600">Visualização detalhada</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getStatusBadge(question.status)}
          {(question.status === 'pending' || question.status === 'rejected') && (
            <Link
              to={`/questions/edit/${question.id}`}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Metadata */}
        <div className="border-b border-gray-200 p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Criada: {formatDate(question.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>Nível: {question.nivel_escolar}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              <span>Tipo: {question.tipo_questao}</span>
            </div>
          </div>
        </div>

        {/* Topic */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Tema e Subtópico</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">{question.tema_principal}</p>
              <p className="text-blue-600">{question.subtopico}</p>
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enunciado</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {question.enunciado}
            </p>
          </div>
        </div>

        {/* Image */}
        {/* Imagem */}
        {question.url_imagem && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Imagem da Questão
            </h2>
            <div className="space-y-4">
              <img
                src={`${API_URL}${question.url_imagem}`}
                alt={question.descricao_imagem || 'Imagem da questão'}
                className="max-w-full h-auto rounded-lg border"
              />
              {question.descricao_imagem && (
                <p className="text-sm text-gray-600 italic">
                  {question.descricao_imagem}
                </p>
              )}
              {question.fonte_imagem && (
                <p className="text-xs text-gray-500">
                  Fonte: {question.fonte_imagem}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {question.tipo_questao === 'multipla_escolha' && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alternativas</h2>
            <div className="space-y-3">
              {['a', 'b', 'c', 'd', 'e'].map(letter => {
                const alternativa = question[`alternativa_${letter}`]
                if (!alternativa) return null
                
                const isCorrect = question.resposta_correta === letter.toUpperCase()
                
                return (
                  <div
                    key={letter}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`font-bold text-lg ${
                        isCorrect ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {letter.toUpperCase()})
                      </span>
                      <p className={`flex-1 ${
                        isCorrect ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {alternativa}
                      </p>
                      {isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Correct Answer Explanation */}
        {question.texto_alternativa_correta && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Explicação da Resposta Correta
            </h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                {question.texto_alternativa_correta}
              </p>
            </div>
          </div>
        )}

        {/* Hint */}
        {question.dica && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dica</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                {question.dica}
              </p>
            </div>
          </div>
        )}

        {/* Bibliography */}
        {question.fonte_bibliografica && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Fonte Bibliográfica
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">
                {question.fonte_bibliografica}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}