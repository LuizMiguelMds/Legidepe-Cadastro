import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, AlertCircle } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

export default function QuestionForm({ user }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageData, setImageData] = useState(null)

  const [formData, setFormData] = useState({
    tema_principal: '',
    subtopico: '',
    enunciado: '',
    tipo_questao: 'multipla_escolha',
    nivel_escolar: 'fundamental_2',
    alternativa_a: '',
    alternativa_b: '',
    alternativa_c: '',
    alternativa_d: '',
    alternativa_e: '',
    resposta_correta: '',
    texto_alternativa_correta: '',
    dica: '',
    fonte_bibliografica: '',
    descricao_imagem: '',
    fonte_imagem: '',
    ano_questao: new Date().getFullYear(),
    banca: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleImageUpload = (image) => {
    setImageData(image)
    setError('')
  }

  const handleImageRemove = () => {
    setImageData(null)
  }

  const uploadImage = async (questionId) => {
    if (!imageData?.file) return null

    const formDataUpload = new FormData()
    formDataUpload.append('file', imageData.file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/questions/${questionId}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        throw new Error('Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload da imagem:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.tema_principal || !formData.subtopico || !formData.enunciado) {
      setError('Por favor, preencha todos os campos obrigatórios: Tema Principal, Subtópico e Enunciado')
      return
    }

    if (formData.tipo_questao === 'multipla_escolha') {
      if (!formData.alternativa_a?.trim() || !formData.alternativa_b?.trim() || !formData.resposta_correta) {
        setError('Para questões de múltipla escolha, preencha ao menos as alternativas A e B, e indique a resposta correta')
        return
      }
    }

    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      
      // 1. Criar a questão primeiro
      const response = await fetch('http://localhost:8000/questions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao criar questão')
      }

      const createdQuestion = await response.json()

      // 2. Se há imagem, fazer upload
      let imageUrl = null
      if (imageData?.file) {
        try {
          imageUrl = await uploadImage(createdQuestion.id)
        } catch (uploadError) {
          console.error('Erro no upload da imagem:', uploadError)
          setSuccess('Questão criada com sucesso, mas houve um problema no upload da imagem. Você pode adicionar a imagem depois editando a questão.')
        }
      }

      // 3. Se upload foi bem-sucedido, atualizar questão com URL da imagem
      if (imageUrl) {
        try {
          const updateResponse = await fetch(`http://localhost:8000/questions/${createdQuestion.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              url_imagem: imageUrl,
              descricao_imagem: formData.descricao_imagem,
              fonte_imagem: formData.fonte_imagem
            })
          })

          if (!updateResponse.ok) {
            console.error('Erro ao atualizar questão com imagem')
          }
        } catch (updateError) {
          console.error('Erro ao atualizar questão:', updateError)
        }
      }

      if (!success) {
        setSuccess(`Questão criada com sucesso! ID: ${createdQuestion.id}`)
      }
      
      // Resetar formulário após alguns segundos
      setTimeout(() => {
        navigate(`/questions/${createdQuestion.id}`)
      }, 3000)

    } catch (error) {
      console.error('Erro ao criar questão:', error)
      setError(error.message || 'Erro ao criar questão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
        <p className="text-gray-600">Você precisa fazer login para cadastrar questões.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Nova Questão de Geografia</h1>
        <p className="text-blue-100">Preencha todos os campos obrigatórios</p>
      </div>

      {/* Mensagens de sucesso/erro */}
      {success && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center space-x-2">
          <div className="bg-green-100 p-1 rounded-full">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Informações Básicas */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas *</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tema Principal *</label>
              <select
                className="form-input"
                value={formData.tema_principal}
                onChange={(e) => handleInputChange('tema_principal', e.target.value)}
                required
              >
                <option value="">Selecione o tema...</option>
                <option value="Cartografia">Cartografia</option>
                <option value="Geografia Física">Geografia Física</option>
                <option value="Geografia Humana">Geografia Humana</option>
                <option value="Geologia">Geologia</option>
                <option value="Climatologia">Climatologia</option>
                <option value="Hidrografia">Hidrografia</option>
                <option value="Biogeografia">Biogeografia</option>
                <option value="Geomorfologia">Geomorfologia</option>
                <option value="Urbanização">Urbanização</option>
                <option value="População">População</option>
                <option value="Economia">Economia</option>
                <option value="Geopolítica">Geopolítica</option>
              </select>
            </div>

            <div>
              <label className="form-label">Subtópico *</label>
              <input
                type="text"
                className="form-input"
                value={formData.subtopico}
                onChange={(e) => handleInputChange('subtopico', e.target.value)}
                placeholder="Ex: Tipos de clima, Relevo brasileiro..."
                required
              />
            </div>

            <div>
              <label className="form-label">Tipo de Questão *</label>
              <select
                className="form-input"
                value={formData.tipo_questao}
                onChange={(e) => handleInputChange('tipo_questao', e.target.value)}
              >
                <option value="multipla_escolha">Múltipla Escolha</option>
                <option value="dissertativa">Dissertativa</option>
                <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
              </select>
            </div>

            <div>
              <label className="form-label">Nível Escolar *</label>
              <select
                className="form-input"
                value={formData.nivel_escolar}
                onChange={(e) => handleInputChange('nivel_escolar', e.target.value)}
              >
                <option value="fundamental_2">Fundamental II (6º ao 9º ano)</option>
                <option value="medio">Ensino Médio</option>
              </select>
            </div>

            <div>
              <label className="form-label">Ano da Questão</label>
              <input
                type="number"
                className="form-input"
                value={formData.ano_questao}
                onChange={(e) => handleInputChange('ano_questao', parseInt(e.target.value))}
                placeholder="2025"
                min="2000"
                max="2030"
              />
            </div>

            <div>
              <label className="form-label">Banca/Instituição</label>
              <input
                type="text"
                className="form-input"
                value={formData.banca}
                onChange={(e) => handleInputChange('banca', e.target.value)}
                placeholder="Ex: ENEM, FUVEST, UERJ..."
              />
            </div>
          </div>
        </div>

        {/* Enunciado */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enunciado *</h2>
          <textarea
            className="form-textarea"
            value={formData.enunciado}
            onChange={(e) => handleInputChange('enunciado', e.target.value)}
            placeholder="Digite o enunciado completo da questão..."
            rows={4}
            required
          />
          <p className="form-help">
            Digite o texto principal da questão. Seja claro e objetivo.
          </p>
        </div>

        {/* Upload de Imagem */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagem da Questão (Opcional)</h2>
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={imageData}
            onImageRemove={handleImageRemove}
          />
          
          {imageData && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="form-label">Descrição da Imagem (para acessibilidade)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.descricao_imagem}
                  onChange={(e) => handleInputChange('descricao_imagem', e.target.value)}
                  placeholder="Descreva o conteúdo da imagem..."
                />
              </div>
              
              <div>
                <label className="form-label">Fonte da Imagem</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fonte_imagem}
                  onChange={(e) => handleInputChange('fonte_imagem', e.target.value)}
                  placeholder="Fonte ou créditos da imagem..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Alternativas (apenas para múltipla escolha) */}
        {formData.tipo_questao === 'multipla_escolha' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alternativas</h2>
            <div className="space-y-4">
              {['a', 'b', 'c', 'd', 'e'].map((letter, index) => (
                <div key={letter}>
                  <label className="form-label">
                    Alternativa {letter.toUpperCase()} {index < 2 ? '*' : '(opcional)'}
                  </label>
                  <textarea
                    className="form-textarea"
                    value={formData[`alternativa_${letter}`]}
                    onChange={(e) => handleInputChange(`alternativa_${letter}`, e.target.value)}
                    placeholder={`Digite a alternativa ${letter.toUpperCase()}...`}
                    rows={2}
                    required={index < 2}
                  />
                </div>
              ))}

              <div>
                <label className="form-label">Resposta Correta *</label>
                <select
                  className="form-input"
                  value={formData.resposta_correta}
                  onChange={(e) => handleInputChange('resposta_correta', e.target.value)}
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
          </div>
        )}

        {/* Informações Complementares */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Complementares</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Explicação da Resposta Correta</label>
              <textarea
                className="form-textarea"
                value={formData.texto_alternativa_correta}
                onChange={(e) => handleInputChange('texto_alternativa_correta', e.target.value)}
                placeholder="Explique por que esta é a resposta correta..."
                rows={3}
              />
            </div>

            <div>
              <label className="form-label">Dica (opcional)</label>
              <textarea
                className="form-textarea"
                value={formData.dica}
                onChange={(e) => handleInputChange('dica', e.target.value)}
                placeholder="Dica para ajudar na resolução..."
                rows={2}
              />
            </div>

            <div>
              <label className="form-label">Fonte Bibliográfica</label>
              <textarea
                className="form-textarea"
                value={formData.fonte_bibliografica}
                onChange={(e) => handleInputChange('fonte_bibliografica', e.target.value)}
                placeholder="Referências bibliográficas utilizadas..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">* Campos obrigatórios</p>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 px-8 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Salvar Questão</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}