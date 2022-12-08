import { Dispatch, SetStateAction, createContext } from 'react'

import { TabType } from '@types'

export type TabsContextType = {
  tabs: TabType[]
  setTabs: Dispatch<SetStateAction<TabType[]>>
}

export default createContext<TabsContextType>({
  tabs: [],
  setTabs: () => {},
})
