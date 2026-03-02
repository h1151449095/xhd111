import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Admin from './pages/Admin.jsx'
import VpsPanel from './pages/VpsPanel.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admina" element={<Admin />} />
        <Route path="/vps" element={<VpsPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App