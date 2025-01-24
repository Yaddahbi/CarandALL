import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/style/index.css'
import { AuthProvider } from "./AuthContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
  </StrictMode>,
)
