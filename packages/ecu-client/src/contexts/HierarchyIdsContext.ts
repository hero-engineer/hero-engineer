import { Dispatch, SetStateAction, createContext } from 'react'

export type HierarchyIdsContextType = {
  hierarchyIds: string[]
  setHierarchyIds: Dispatch<SetStateAction<string[]>>
  componentRootLimitedIds: string[]
  setComponentRootLimitedIds: Dispatch<SetStateAction<string[]>>
}

export default createContext<HierarchyIdsContextType>({
  hierarchyIds: [],
  setHierarchyIds: () => {},
  componentRootLimitedIds: [],
  setComponentRootLimitedIds: () => {},
})
