import { Dispatch, SetStateAction, createContext } from 'react'

export type DragHierarchyPositionType = 'before' | 'after' | 'within' | null

export type EditionContextType = {
  hierarchyIds: string[]
  setHierarchyIds: Dispatch<SetStateAction<string[]>>
  dragHierarchyPosition: DragHierarchyPositionType
  setDragHierarchyPosition: Dispatch<SetStateAction<DragHierarchyPositionType>>
}

export default createContext<EditionContextType>({
  hierarchyIds: [],
  setHierarchyIds: () => {},
  dragHierarchyPosition: null,
  setDragHierarchyPosition: () => {},
})
