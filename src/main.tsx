import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { CommunityProvider } from './context/CommunityContext'
import { ContentProvider } from './context/ContentContext'
import { ToastProvider } from './components/Toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ContentProvider>
          <CommunityProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CommunityProvider>
        </ContentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
