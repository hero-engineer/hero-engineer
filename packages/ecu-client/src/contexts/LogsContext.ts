import { Dispatch, SetStateAction, createContext } from 'react'

import { LogsType } from '~types'

export type LogsContextType = {
  logs: LogsType
  setLogs: Dispatch<SetStateAction<LogsType>>
}

export default createContext<LogsContextType>({
  logs: {
    hierarchy: false,
  },
  setLogs: () => {},
})
