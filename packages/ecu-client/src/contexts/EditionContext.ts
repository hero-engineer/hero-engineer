import { Dispatch, SetStateAction, createContext } from 'react'

export type EditionContextType = {
  hierarchyIds: string[]
  setHierarchyIds: Dispatch<SetStateAction<string[]>>
}

export default createContext<EditionContextType>({
  hierarchyIds: [],
  setHierarchyIds: () => {},
})
