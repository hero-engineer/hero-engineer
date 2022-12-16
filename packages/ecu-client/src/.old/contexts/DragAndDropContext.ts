import { Dispatch, SetStateAction, createContext } from 'react'

export type DragAndDropType = {
  sourceHierarchyId: string
  targetHierarchyId: string
  sourceComponentDelta: number
  targetComponentDelta: number
}

export type DragAndDropContextType = {
  dragAndDrop: DragAndDropType
  setDragAndDrop: Dispatch<SetStateAction<DragAndDropType>>
}

export default createContext<DragAndDropContextType>({
  dragAndDrop: {
    sourceHierarchyId: '',
    targetHierarchyId: '',
    sourceComponentDelta: 0,
    targetComponentDelta: 0,
  },
  setDragAndDrop: () => {},
})
