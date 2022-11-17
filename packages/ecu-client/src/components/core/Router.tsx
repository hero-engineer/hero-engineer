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
          path="/_ecu_"
          element={<Layout />}
        >
          <Route
            path="components"
            element={<Components />}
          />
          <Route
            path="component/:fileAddress/:componentAddress"
            element={<Component />}
          />
          <Route
            path="*"
            element={<div>Not found</div>}
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
