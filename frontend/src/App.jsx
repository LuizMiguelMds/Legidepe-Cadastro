import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import QuestionForm from './pages/QuestionForm'
import Navbar from './components/Navbar'
import QuestionDetail from './pages/QuestionDetail'
import QuestionEdit from './pages/QuestionEdit'
import QuestionList from './pages/QuestionList'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/questions/new" element={<QuestionForm user={user} />} />
            <Route path="/questions/:id" element={<QuestionDetail user={user} />} />
            <Route path="/questions/edit/:id" element={<QuestionEdit user={user} />} />
            <Route path="/questions" element={<QuestionList user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App