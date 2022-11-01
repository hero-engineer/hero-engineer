import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyItemType } from '../types'

export type HierarchyContextType = {
  hierarchy: HierarchyItemType[]
  setHierarchy: Dispatch<SetStateAction<HierarchyItemType[]>>
  hierarchyDepth: number
  setHierarchyDepth: Dispatch<SetStateAction<number>>
  maxHierarchyDepth: number
  setMaxHierarchyDepth: Dispatch<SetStateAction<number>>
}

export default createContext<HierarchyContextType>({
  hierarchy: [],
  setHierarchy: () => {},
  hierarchyDepth: 0,
  setHierarchyDepth: () => {},
  maxHierarchyDepth: 0,
  setMaxHierarchyDepth: () => {},
})
