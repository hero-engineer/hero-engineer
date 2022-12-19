import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Layout from '~components/layout/Layout'
import ResponsiveLayout from '~components/layout/ResponsiveLayout'
import Home from '~components/scene-home/Home'
import Component from '~components/scene-component/Component'
import Components from '~components/scene-components/Components'
import Design from '~components/scene-design/Design'
import DesignSystem from '~components/scene-design/DesignSystem'
import DesignRootCss from '~components/scene-design/DesignRootCss'
import DesignFavicon from '~components/scene-design/DesignFavicon'
import Settings from '~components/scene-settings/Settings'
import SettingsGeneral from '~components/scene-settings/SettingsGeneral'
import SettingsLogs from '~components/scene-settings/SettingsLogs'
import Packages from '~components/scene-packages/Packages'
import ProviderComponent from '~components/providers/ProviderComponent'
import ProviderTheme from '~components/providers/ProviderTheme'

// The Hero Engineer router
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
              <Route
                path="logs"
                element={<SettingsLogs />}
              />
            </Route>
            <Route
              path="~/*"
              element={(
                <ProviderComponent>
                  <Component />
                </ProviderComponent>
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
      </ProviderTheme>
    </BrowserRouter>
  )
}

export default Router
