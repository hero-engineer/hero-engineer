import { Dispatch, SetStateAction, createContext } from 'react'

export type DragAndDropType = {
  sourceHierarchyIds: string[]
  targetHierarchyIds: string[]
}

export type DragAndDropContextType = {
  dragAndDrop: DragAndDropType
  setDragAndDrop: Dispatch<SetStateAction<DragAndDropType>>
}

export default createContext<DragAndDropContextType>({
  dragAndDrop: {
    sourceHierarchyIds: [],
    targetHierarchyIds: [],
  },
  setDragAndDrop: () => {},
})
