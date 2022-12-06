import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyItemType } from '@types'

export type LastEditedComponentContextType = {
  lastEditedComponent: HierarchyItemType | null
  setLastEditedComponent: Dispatch<SetStateAction<HierarchyItemType | null>>
}

export default createContext<LastEditedComponentContextType>({
  lastEditedComponent: null,
  setLastEditedComponent: () => {},
})
