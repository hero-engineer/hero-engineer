import { useCallback, useContext } from 'react'
import { Button, Div, H1, Switch } from 'honorable'

import ThemeModeContext from '~contexts/ThemeModeContext'
import WarningsContext from '~contexts/WarningsContext'

function SettingsGeneral() {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext)
  const { warnings, setWarnings } = useContext(WarningsContext)

  const handleResetWarnings = useCallback(() => {
    setWarnings(x => {
      const nextWarnings = { ...x }

      Object.keys(nextWarnings).forEach(warningKey => {
        nextWarnings[warningKey as keyof typeof nextWarnings] = true
      })

      return nextWarnings
    })
  }, [setWarnings])

  return (
    <>
      <H1>General Settings</H1>
      <Div
        xflex="y1"
        gap={1}
        mt={2}
      >
        <Switch
          defaultChecked={themeMode === 'dark'}
          onChange={event => setThemeMode(event.target.checked ? 'dark' : 'light')}
          ml={0.25}
        >
          Dark mode
        </Switch>
        {Object.values(warnings).some(x => !x) && (
          <Button onClick={handleResetWarnings}>
            Reset warnings
          </Button>
        )}
      </Div>
    </>
  )
}

export default SettingsGeneral
