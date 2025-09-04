import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import API_URL from '../config/api.js'

export default function QuestionEdit({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    tema_principal: '',
    subtopico: '',
    enunciado: '',
    tipo_questao: 'multipla_escolha',
    url_imagem: '',
    descricao_imagem: '',
    fonte_imagem: '',
    nivel_escolar: 'fundamental_2',
    alternativa_a: '',
    alternativa_b: '',
    alternativa_c: '',
    alternativa_d: '',
    alternativa_e: '',
    resposta_correta: '',
    texto_alternativa_correta: '',
    dica: '',
    fonte_bibliografica: ''
  })

  useEffect(() => {
    if (id) {
      loadQuestion()
    }
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
        
        // Verificar se o usuário pode editar esta questão
        if (data.user_id !== user?.id && user?.role !== 'admin') {
          setError('Você não tem permissão para editar esta questão')
          return
        }
        
        // Verificar se a questão pode ser editada
        if (data.status === 'approved' && user?.role !== 'admin') {
          setError('Questões aprovadas não podem ser editadas')
          return
        }
        
        // Preencher formulário com dados existentes
        setFormData({
          tema_principal: data.tema_principal || '',
          subtopico: data.subtopico || '',
          enunciado: data.enunciado || '',
          tipo_questao: data.tipo_questao || 'multipla_escolha',
          url_imagem: data.url_imagem || '',
          descricao_imagem: data.descricao_imagem || '',
          fonte_imagem: data.fonte_imagem || '',
          nivel_escolar: data.nivel_escolar || 'fundamental_2',
          alternativa_a: data.alternativa_a || '',
          alternativa_b: data.alternativa_b || '',
          alternativa_c: data.alternativa_c || '',
          alternativa_d: data.alternativa_d || '',
          alternativa_e: data.alternativa_e || '',
          resposta_correta: data.resposta_correta || '',
          texto_alternativa_correta: data.texto_alternativa_correta || '',
          dica: data.dica || '',
          fonte_bibliografica: data.fonte_bibliografica || ''
        })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.tema_principal || !formData.subtopico || !formData.enunciado) {
      alert('Por favor, preencha os campos obrigatórios: Tema Principal, Subtópico e Enunciado')
      return
    }

    if (formData.tipo_questao === 'multipla_escolha') {
      if (!formData.alternativa_a || !formData.alternativa_b || !formData.resposta_correta) {
        alert('Para questões de múltipla escolha, preencha ao menos as alternativas A e B, e indique a resposta correta')
        return
      }
    }

    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Questão atualizada com sucesso!')
        navigate('/questions')
      } else {
        const errorData = await response.json()
        alert(`Erro ao atualizar questão: ${errorData.detail || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao salvar questão:', error)
      alert('Erro ao salvar questão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
        <p className="text-gray-600">Você precisa fazer login para editar questões.</p>
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
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/questions" className="btn-primary">
            Voltar às Questões
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/questions" className="btn-secondary flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Questão #{id}
          </h1>
          <p className="text-gray-600">
            Status atual: <span className="font-medium">{question?.status}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Informações Básicas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">
              Tema Principal *
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.tema_principal}
              onChange={(e) => handleChange('tema_principal', e.target.value)}
              placeholder="Ex: Climatologia, Geomorfologia, etc."
              required
            />
          </div>

          <div>
            <label className="form-label">
              Subtópico *
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.subtopico}
              onChange={(e) => handleChange('subtopico', e.target.value)}
              placeholder="Ex: Tipos de clima, Relevo brasileiro, etc."
              required
            />
          </div>

          <div>
            <label className="form-label">
              Nível Escolar *
            </label>
            <select
              className="form-input"
              value={formData.nivel_escolar}
              onChange={(e) => handleChange('nivel_escolar', e.target.value)}
            >
              <option value="fundamental_2">Fundamental II (6º ao 9º ano)</option>
              <option value="medio">Ensino Médio</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Tipo de Questão *
            </label>
            <select
              className="form-input"
              value={formData.tipo_questao}
              onChange={(e) => handleChange('tipo_questao', e.target.value)}
            >
              <option value="multipla_escolha">Múltipla Escolha</option>
              <option value="dissertativa">Dissertativa</option>
              <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
            </select>
          </div>
        </div>

        {/* Enunciado */}
        <div>
          <label className="form-label">
            Enunciado da Questão *
          </label>
          <textarea
            className="form-textarea"
            value={formData.enunciado}
            onChange={(e) => handleChange('enunciado', e.target.value)}
            placeholder="Digite o enunciado completo da questão..."
            rows={4}
            required
          />
          <p className="form-help">
            Digite o texto principal da questão. Seja claro e objetivo.
          </p>
        </div>

        {/* Imagem */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              className="form-input"
              value={formData.url_imagem}
              onChange={(e) => handleChange('url_imagem', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div>
            <label className="form-label">
              Descrição da Imagem
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.descricao_imagem}
              onChange={(e) => handleChange('descricao_imagem', e.target.value)}
              placeholder="Descrição para acessibilidade"
            />
          </div>

          <div>
            <label className="form-label">
              Fonte da Imagem
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.fonte_imagem}
              onChange={(e) => handleChange('fonte_imagem', e.target.value)}
              placeholder="Fonte ou créditos da imagem"
            />
          </div>
        </div>

        {/* Alternativas (apenas para múltipla escolha) */}
        {formData.tipo_questao === 'multipla_escolha' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Alternativas</h3>
            
            {['a', 'b', 'c', 'd', 'e'].map((letter, index) => (
              <div key={letter}>
                <label className="form-label">
                  Alternativa {letter.toUpperCase()} {index < 2 ? '*' : '(opcional)'}
                </label>
                <textarea
                  className="form-textarea"
                  value={formData[`alternativa_${letter}`]}
                  onChange={(e) => handleChange(`alternativa_${letter}`, e.target.value)}
                  placeholder={`Digite a alternativa ${letter.toUpperCase()}...`}
                  rows={2}
                  required={index < 2}
                />
              </div>
            ))}

            <div>
              <label className="form-label">
                Resposta Correta *
              </label>
              <select
                className="form-input"
                value={formData.resposta_correta}
                onChange={(e) => handleChange('resposta_correta', e.target.value)}
                required
              >
                <option value="">Selecione a alternativa correta</option>
                {formData.alternativa_a && <option value="A">A</option>}
                {formData.alternativa_b && <option value="B">B</option>}
                {formData.alternativa_c && <option value="C">C</option>}
                {formData.alternativa_d && <option value="D">D</option>}
                {formData.alternativa_e && <option value="E">E</option>}
              </select>
            </div>
          </div>
        )}

        {/* Informações Complementares */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações Complementares</h3>
          
          <div>
            <label className="form-label">
              Explicação da Resposta Correta
            </label>
            <textarea
              className="form-textarea"
              value={formData.texto_alternativa_correta}
              onChange={(e) => handleChange('texto_alternativa_correta', e.target.value)}
              placeholder="Explique por que esta é a resposta correta..."
              rows={3}
            />
          </div>

          <div>
            <label className="form-label">
              Dica (opcional)
            </label>
            <textarea
              className="form-textarea"
              value={formData.dica}
              onChange={(e) => handleChange('dica', e.target.value)}
              placeholder="Dica para ajudar na resolução..."
              rows={2}
            />
          </div>

          <div>
            <label className="form-label">
              Fonte Bibliográfica
            </label>
            <textarea
              className="form-textarea"
              value={formData.fonte_bibliografica}
              onChange={(e) => handleChange('fonte_bibliografica', e.target.value)}
              placeholder="Referências bibliográficas utilizadas..."
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            * Campos obrigatórios
          </p>
          
          <div className="flex space-x-3">
            <Link to="/questions" className="btn-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}