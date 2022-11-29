import { Dispatch, SetStateAction, createContext } from 'react'

export type EditionContextType = {
  hierarchyId: string
  setHierarchyId: Dispatch<SetStateAction<string>>
  componentDelta: number
  setComponentDelta: Dispatch<SetStateAction<number>>
}

export default createContext<EditionContextType>({
  hierarchyId: '',
  setHierarchyId: () => {},
  componentDelta: 0,
  setComponentDelta: () => {},
})
