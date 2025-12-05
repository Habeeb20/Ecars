import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import {AuthProvider} from "./contexts/AuthContext"
import { Toaster } from 'sonner'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
    <AuthProvider>
      <App />
       <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
    </AuthProvider>
  </ThemeProvider>

  </StrictMode>,
)
