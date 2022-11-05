import { memo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Component from './Component'
import Components from './Components'
import Layout from './Layout'

function Router({ children }: any) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/__ecu__"
          element={<Layout />}
        >
          <Route
            path="components"
            element={<Components />}
          />
          <Route
            path="component/:componentAddress"
            element={<Component />}
          />
        </Route>
        <Route
          path="*"
          element={children}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default memo(Router)
