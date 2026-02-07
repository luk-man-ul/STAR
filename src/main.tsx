import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

// Import seed function for easy access from browser console
import { seedServices } from './seedFirebase'
import { checkFirebaseSetup } from './checkFirebase'

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).seedServices = seedServices;
  (window as any).checkFirebaseSetup = checkFirebaseSetup;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)