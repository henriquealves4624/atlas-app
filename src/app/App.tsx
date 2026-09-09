import '../styles/atlas.css'
import { useState } from 'react'
import LoginPage from './components/LoginPage'
import AppShell from './components/AppShell'
import { AtlasProvider } from './store'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#07050f',
      minHeight: '100vh',
      color: '#f1f5f9',
    }}>
      {authenticated ? (
        <AtlasProvider>
          <AppShell onLogout={() => setAuthenticated(false)} />
        </AtlasProvider>
      ) : (
        <LoginPage onEnter={() => setAuthenticated(true)} />
      )}
    </div>
  )
}
