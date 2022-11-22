import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from '../scenes/Home'
import Component from '../scenes/Component'
import Components from '../scenes/Components'
import Packages from '../scenes/Packages'

import Layout from './Layout'
import ResponsiveLayout from './ResponsiveLayout'

// The Ecu router
function Router({ children }: any) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="_ecu_"
          element={<Layout />}
        >
          <Route
            index
            element={(
              <ResponsiveLayout>
                <Home />
              </ResponsiveLayout>
            )}
          />
          <Route
            path="components"
            element={(
              <ResponsiveLayout>
                <Components />
              </ResponsiveLayout>
            )}
          />
          <Route
            path="component/:fileAddress/:componentAddress"
            element={<Component />}
          />
          <Route
            path="packages"
            element={(
              <ResponsiveLayout>
                <Packages />
              </ResponsiveLayout>
            )}
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
