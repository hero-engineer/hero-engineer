import './index.css'

import ReactDOM from 'react-dom/client'
import { EcuMaster } from 'ecu'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <EcuMaster
    mode={import.meta.env.MODE}
    hot={import.meta.hot}
  >
    <App />
  </EcuMaster>
)
