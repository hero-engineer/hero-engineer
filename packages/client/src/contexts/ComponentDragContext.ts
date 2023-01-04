import { Dispatch, SetStateAction, createContext } from 'react'

export type ComponentDragContextType = {
  draggedHierarchyId: string,
  setDraggedHierarchyId: Dispatch<SetStateAction<string>>,
}

export default createContext<ComponentDragContextType>({
  draggedHierarchyId: '',
  setDraggedHierarchyId: () => {},
})
