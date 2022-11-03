import { Dispatch, SetStateAction, createContext } from 'react'

export type HierarchyIdsContextType = {
  hierarchyIds: string[]
  setHierarchyIds: Dispatch<SetStateAction<string[]>>
  componentRootHierarchyIds: string[]
  setComponentRootHierarchyIds: Dispatch<SetStateAction<string[]>>
}

export default createContext<HierarchyIdsContextType>({
  hierarchyIds: [],
  setHierarchyIds: () => {},
  componentRootHierarchyIds: [],
  setComponentRootHierarchyIds: () => {},
})
