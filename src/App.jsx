import { Routes, Route } from 'react-router-dom'
import BackgroundCanvas from './components/BackgroundCanvas'
import Home from './pages/Home'
import Projects from './pages/Projects'

function App() {
  return (
    <>
      <BackgroundCanvas />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  )
}

export default App
