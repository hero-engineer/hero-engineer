import React from 'react'
import ReactDOM from 'react-dom/client'
import Ecu from 'ecu'

import App from './App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

console.log('root', root)

Ecu.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
