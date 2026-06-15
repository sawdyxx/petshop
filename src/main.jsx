import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import { LanguageProvider } from './context/LanguageContext'
import { ShopProvider } from './context/ShopContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <AdminProvider>
          <ShopProvider>
            <App />
          </ShopProvider>
        </AdminProvider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
