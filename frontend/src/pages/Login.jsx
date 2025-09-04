import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, AlertCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Dados enviados:', formData)
      
      const formDataToSend = new URLSearchParams({
        username: formData.username,
        password: formData.password
      })
      
      console.log('FormData string:', formDataToSend.toString())

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      })

      console.log('Response status:', response.status)

      const responseText = await response.text()
      console.log('Response text:', responseText)

      if (response.ok) {
        const data = JSON.parse(responseText)
        console.log('Login success:', data)
        
        localStorage.setItem('token', data.access_token)
        setUser({ 
          username: formData.username,
          role: 'user'
        })
        navigate('/')
      } else {
        console.log('Login failed:', responseText)
        setError(`Erro: ${response.status} - ${responseText}`)
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Erro ao conectar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-gray-600">Entre na sua conta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-700 mr-2 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Nome de usuário</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="form-label">Senha</label>
            <input
              type="password"
              required
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">
            <strong>Credenciais de teste:</strong><br />
            Usuário: <code>admin</code><br />
            Senha: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login