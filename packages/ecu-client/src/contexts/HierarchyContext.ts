import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyItemType } from '../types'

export type HierarchyContextType = {
  hierarchy: HierarchyItemType[]
  setHierarchy: Dispatch<SetStateAction<HierarchyItemType[]>>
  componentDelta: number
  setComponentDelta: Dispatch<SetStateAction<number>>
  shouldAdjustComponentDelta: boolean
  setShouldAdjustComponentDelta: Dispatch<SetStateAction<boolean>>
  isHierarchyOnComponent: boolean
  setIsHierarchyOnComponent: Dispatch<SetStateAction<boolean>>
}

export default createContext<HierarchyContextType>({
  hierarchy: [],
  setHierarchy: () => {},
  componentDelta: 0,
  setComponentDelta: () => {},
  shouldAdjustComponentDelta: false,
  setShouldAdjustComponentDelta: () => {},
  isHierarchyOnComponent: false,
  setIsHierarchyOnComponent: () => {},
})
