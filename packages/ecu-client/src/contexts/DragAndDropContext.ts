import { Dispatch, SetStateAction, createContext } from 'react'

export type DragAndDropType = {
  sourceHierarchyId: string
  targetHierarchyId: string
}

export type DragAndDropContextType = {
  dragAndDrop: DragAndDropType
  setDragAndDrop: Dispatch<SetStateAction<DragAndDropType>>
}

export default createContext<DragAndDropContextType>({
  dragAndDrop: {
    sourceHierarchyId: '',
    targetHierarchyId: '',
  },
  setDragAndDrop: () => {},
})
