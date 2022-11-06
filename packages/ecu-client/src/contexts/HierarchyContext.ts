import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyItemType } from '../types'

export type HierarchyContextType = {
  hierarchy: HierarchyItemType[]
  setHierarchy: Dispatch<SetStateAction<HierarchyItemType[]>>
  totalHierarchy: HierarchyItemType[]
  setTotalHierarchy: Dispatch<SetStateAction<HierarchyItemType[]>>
  shouldAdjustComponentDelta: boolean
  setShouldAdjustComponentDelta: Dispatch<SetStateAction<boolean>>
}

export default createContext<HierarchyContextType>({
  hierarchy: [],
  setHierarchy: () => {},
  totalHierarchy: [],
  setTotalHierarchy: () => {},
  shouldAdjustComponentDelta: false,
  setShouldAdjustComponentDelta: () => {},
})
