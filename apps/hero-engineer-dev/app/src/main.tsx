import './index.css'

import ReactDOM from 'react-dom/client'
import HeroEngineer from '@hero-engineer/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HeroEngineer
    mode={import.meta.env.MODE}
    hot={import.meta.hot}
  >
    <App />
  </HeroEngineer>
)
