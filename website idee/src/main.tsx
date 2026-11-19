import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/pages.css'
import './styles/plattegrond.css'
import './styles/admin.css'
import './styles/admin-teksten.css'
import './styles/animaties.css'

import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
