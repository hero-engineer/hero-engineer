import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyItemType } from '~types'

export type HierarchyContextType = {
  hierarchy: HierarchyItemType[]
  setHierarchy: Dispatch<SetStateAction<HierarchyItemType[]>>
  totalHierarchy: HierarchyItemType | null
  setTotalHierarchy: Dispatch<SetStateAction<HierarchyItemType | null>>
}

export default createContext<HierarchyContextType>({
  hierarchy: [],
  setHierarchy: () => {},
  totalHierarchy: null,
  setTotalHierarchy: () => {},
})
