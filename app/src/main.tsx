import React from 'react'
import ReactDOM from 'react-dom/client'
import { EcuMaster } from 'ecu-client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <EcuMaster mode={import.meta.env.MODE}>
    <App />
  </EcuMaster>
)
