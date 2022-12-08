import { Dispatch, SetStateAction, createContext } from 'react'

import { TabType } from '~types'

export type BottomTabsContextType = {
  tabs: TabType[]
  setTabs: Dispatch<SetStateAction<TabType[]>>
  currentTabIndex: number
  setCurrentTabIndex: Dispatch<SetStateAction<number>>
}

export default createContext<BottomTabsContextType>({
  tabs: [],
  setTabs: () => {},
  currentTabIndex: -1,
  setCurrentTabIndex: () => {},
})
