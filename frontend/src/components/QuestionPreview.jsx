import { CheckCircle, X, ArrowLeft } from 'lucide-react'

export default function QuestionPreview({ question, onClose, onNewQuestion }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Questão Cadastrada com Sucesso!</h2>
              <p className="text-green-100">ID #{question.id} • Status: Aguardando aprovação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-green-100 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-600">Criada em</p>
              <p className="text-gray-900">{formatDate(question.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Nível</p>
              <p className="text-gray-900">{question.nivel_escolar}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tipo</p>
              <p className="text-gray-900">{question.tipo_questao}</p>
            </div>
          </div>

          {/* Tema e Subtópico */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tema e Subtópico</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium text-lg">{question.tema_principal}</p>
              <p className="text-blue-600">{question.subtopico}</p>
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Enunciado</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {question.enunciado}
              </p>
            </div>
          </div>

          {/* Imagem */}
          {question.url_imagem && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                Imagem da Questão
              </h3>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <img
                  src={`http://localhost:8000${question.url_imagem}`}
                  alt={question.descricao_imagem || 'Imagem da questão'}
                  className="max-w-full h-auto rounded-lg"
                />
                {question.descricao_imagem && (
                  <p className="text-sm text-gray-600 italic mt-2">
                    {question.descricao_imagem}
                  </p>
                )}
                {question.fonte_imagem && (
                  <p className="text-xs text-gray-500 mt-1">
                    Fonte: {question.fonte_imagem}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Alternativas */}
          {question.tipo_questao === 'multipla_escolha' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Alternativas</h3>
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

          {/* Explicação da resposta */}
          {question.texto_alternativa_correta && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Explicação da Resposta Correta
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  {question.texto_alternativa_correta}
                </p>
              </div>
            </div>
          )}

          {/* Dica */}
          {question.dica && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dica</h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  {question.dica}
                </p>
              </div>
            </div>
          )}

          {/* Informações adicionais */}
          {(question.ano_questao || question.banca || question.fonte_bibliografica) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações Adicionais</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {question.ano_questao && (
                  <p><span className="font-medium">Ano:</span> {question.ano_questao}</p>
                )}
                {question.banca && (
                  <p><span className="font-medium">Banca:</span> {question.banca}</p>
                )}
                {question.fonte_bibliografica && (
                  <p><span className="font-medium">Fonte Bibliográfica:</span> {question.fonte_bibliografica}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Esta questão será revisada por um administrador antes de ser aprovada.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Fechar</span>
            </button>
            <button
              onClick={onNewQuestion}
              className="btn-primary"
            >
              Criar Nova Questão
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}