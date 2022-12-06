import { useContext } from 'react'
import { Div, H1, Switch } from 'honorable'

import ThemeModeContext from '@contexts/ThemeModeContext'

function SettingsGeneral() {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext)

  return (
    <>
      <H1>General Settings</H1>
      <Div mt={2}>
        <Switch
          defaultChecked={themeMode === 'dark'}
          onChange={event => setThemeMode(event.target.checked ? 'dark' : 'light')}
          ml={0.25}
        >
          Dark mode
        </Switch>
      </Div>
    </>
  )
}

export default SettingsGeneral
