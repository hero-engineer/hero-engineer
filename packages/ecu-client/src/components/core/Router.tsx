import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Home'
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
            index
            element={<Home />}
          />
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

export default Router
