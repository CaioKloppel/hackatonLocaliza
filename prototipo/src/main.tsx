import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/tokens.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ToastProvider } from './components/ui/Toast'
import { ModoProvider } from './modo/ModoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModoProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ModoProvider>
  </StrictMode>,
)
