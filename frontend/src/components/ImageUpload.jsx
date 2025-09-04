import { useState, useRef } from 'react'
import { Upload, X, Image, AlertCircle, CheckCircle } from 'lucide-react'

export default function ImageUpload({ onImageUpload, currentImage, onImageRemove }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    setError('')
    
    // Validações
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setUploading(true)
    
    try {
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = {
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        }
        onImageUpload(imageData)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      setError('Erro ao processar a imagem')
    } finally {
      setUploading(false)
    }
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setError('')
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {currentImage ? (
        // Preview da imagem carregada
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={currentImage.preview || currentImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Imagem carregada</span>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {currentImage.name && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Nome:</span> {currentImage.name}</p>
                  <p><span className="font-medium">Tamanho:</span> {formatFileSize(currentImage.size)}</p>
                </div>
              )}
              
              <button
                type="button"
                onClick={openFileSelector}
                className="mt-3 btn-secondary text-sm"
              >
                Trocar Imagem
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Área de upload
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Processando imagem...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  {error ? (
                    <AlertCircle className="h-12 w-12 text-red-400" />
                  ) : (
                    <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {dragActive ? 'Solte a imagem aqui' : 'Upload de Imagem'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Arraste e solte uma imagem aqui, ou clique para selecionar
                  </p>
                  
                  <button
                    type="button"
                    onClick={openFileSelector}
                    className="btn-primary"
                    disabled={uploading}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Selecionar Imagem
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}