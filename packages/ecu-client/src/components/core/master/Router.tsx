import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Home from '~scenes/Home'
import Component from '~scenes/Component'
import Components from '~scenes/Components'
import Design from '~scenes/Design'
import DesignSystem from '~scenes/DesignSystem'
import DesignRootCss from '~scenes/DesignRootCss'
import DesignFavicon from '~scenes/DesignFavicon'
import Packages from '~scenes/Packages'
import Settings from '~scenes/Settings'
import SettingsGeneral from '~scenes/SettingsGeneral'

import Component2 from '~core/full-ast/Component'

import ProviderTheme from '../providers/ProviderTheme'
import ResponsiveLayout from '../layout/ResponsiveLayout'
import Layout from '../layout/Layout'

// The Ecu router
function Router({ children }: any) {
  return (
    <BrowserRouter>
      <ProviderTheme>
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
              path="design"
              element={(
                <ResponsiveLayout>
                  <Design />
                </ResponsiveLayout>
              )}
            >
              <Route
                index
                element={(
                  <Navigate
                    replace
                    to="system"
                  />
                )}
              />
              <Route
                path="system"
                element={<DesignSystem />}
              />
              <Route
                path="root-css"
                element={<DesignRootCss />}
              />
              <Route
                path="favicon"
                element={<DesignFavicon />}
              />
            </Route>
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
                    to="general"
                  />
                )}
              />
              <Route
                path="general"
                element={<SettingsGeneral />}
              />
            </Route>
            <Route
              path="~/*"
              element={<Component2 />}
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
      </ProviderTheme>
    </BrowserRouter>
  )
}

export default Router
