import { Dispatch, SetStateAction, createContext } from 'react'

import { HierarchyType } from '~types'

export type HierarchyContextType = {
  hierarchy: HierarchyType | null
  setHierarchy: Dispatch<SetStateAction<HierarchyType | null>>
}

export default createContext<HierarchyContextType>({
  hierarchy: null,
  setHierarchy: () => {},
})
