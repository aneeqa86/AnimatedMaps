import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import MapsPage from '@/pages/MapsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PakistanWorker from '@/pages/maps/PakistanWorker'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/maps/pakistan-worker" element={<PakistanWorker />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App