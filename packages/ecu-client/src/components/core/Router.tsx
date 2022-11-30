import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Home from '../scenes/Home'
import Component from '../scenes/Component'
import Components from '../scenes/Components'
import DesignSystem from '../scenes/DesignSystem'
import Packages from '../scenes/Packages'
import Settings from '../scenes/Settings'
import SettingsGeneral from '../scenes/SettingsGeneral'

import Layout from './Layout'
import ResponsiveLayout from './ResponsiveLayout'
import EcuThemeProvider from './EcuThemeProvider'

// The Ecu router
function Router({ children }: any) {
  return (
    <BrowserRouter>
      <EcuThemeProvider>
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
              path="design-system"
              element={(
                <ResponsiveLayout>
                  <DesignSystem />
                </ResponsiveLayout>
              )}
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
              path="settings"
              element={(
                <ResponsiveLayout>
                  <Settings />
                </ResponsiveLayout>
              )}
            >
              <Route
                index
                element={(
                  <Navigate
                    replace
                    to="/_ecu_/settings/general"
                  />
                )}
              />
              <Route
                path="general"
                element={<SettingsGeneral />}
              />
            </Route>
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
      </EcuThemeProvider>
    </BrowserRouter>
  )
}

export default Router
