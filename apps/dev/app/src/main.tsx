import 'normalize.css'
import './index.css'

import ReactDOM from 'react-dom/client'
import HeroEngineer from '@hero-engineer/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HeroEngineer env={import.meta.env}>
    <App />
  </HeroEngineer>
)
