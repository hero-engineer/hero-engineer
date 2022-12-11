import { useCallback, useContext } from 'react'
import { Div, H1, Switch } from 'honorable'

import LogsContext from '~contexts/LogsContext'

import capitalize from '~utils/capitalize'

function SettingsLogs() {
  const { logs, setLogs } = useContext(LogsContext)

  const handleLogChange = useCallback((key: string, event: any) => {
    setLogs(x => ({
      ...x,
      [key]: event.target.checked,
    }))
  }, [setLogs])

  return (
    <>
      <H1>Logs Settings</H1>
      <Div mt={2}>
        {Object.keys(logs).map(key => (
          <Switch
            key={key}
            checked={logs[key as keyof typeof logs]}
            onChange={event => handleLogChange(key, event)}
            mb={1}
          >
            {capitalize(key)}
          </Switch>
        ))}
      </Div>
    </>
  )
}

export default SettingsLogs
