import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import MapsPage from '@/pages/MapsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PakistanWorker from '@/pages/maps/PakistanWorker'
import PartitionMap from '@/pages/maps/PartitionMap'
import PalestineMap from '@/pages/maps/PalestineMap'
import CricketMap from '@/pages/maps/CricketMap'
import HajjMap from '@/pages/maps/HajjMap'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/maps/pakistan-worker" element={<PakistanWorker />} />
        <Route path="/maps/partition-1947" element={<PartitionMap />} />
        <Route path="/maps/palestine-dastoor" element={<PalestineMap />} />
        <Route path="/maps/cricket-empire" element={<CricketMap />} />
        <Route path="/maps/hajj-roads" element={<HajjMap />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App