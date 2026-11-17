import FinancialSummary from './pages/FinancialSummary'
import FinancialDetails from './pages/FinancialDetails'
import LivingSituation from './pages/LivingSituation'
import Onboarding from './pages/Onboarding'
import Welcome from './pages/Welcome'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/financial-summary" element={<FinancialSummary />} />
        <Route path="/financial-details" element={<FinancialDetails />} />
        <Route path="/living-situation" element={<LivingSituation />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
