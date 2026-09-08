import '../styles/atlas.css'
import { useState } from 'react'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import OnboardingPage from './components/OnboardingPage'
import DashboardLayout from './components/DashboardLayout'

export type Page = 'landing' | 'login' | 'onboarding' | 'dashboard'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#07050f',
      minHeight: '100vh',
      color: '#f1f5f9',
    }}>
      {page === 'landing' && <LandingPage navigate={setPage} />}
      {page === 'login' && <LoginPage navigate={setPage} />}
      {page === 'onboarding' && <OnboardingPage navigate={setPage} />}
      {page === 'dashboard' && <DashboardLayout navigate={setPage} />}
    </div>
  )
}
