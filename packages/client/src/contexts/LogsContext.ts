import { Dispatch, SetStateAction, createContext } from 'react'

import { LogsType } from '~types'

export type LogsContextType = {
  logs: LogsType
  setLogs: Dispatch<SetStateAction<LogsType>>
}

export default createContext<LogsContextType>({
  logs: {
    typescript: false,
    css: false,
  },
  setLogs: () => {},
})
