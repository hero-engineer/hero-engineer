import { Dispatch, SetStateAction, createContext } from 'react'

import { TabType } from '~types'

export type BottomTabsContextType = {
  tabs: TabType[]
  setTabs: Dispatch<SetStateAction<TabType[]>>
}

export default createContext<BottomTabsContextType>({
  tabs: [],
  setTabs: () => {},
})
