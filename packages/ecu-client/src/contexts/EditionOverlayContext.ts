import { Dispatch, SetStateAction, createContext } from 'react'

export type ElementWithHierarchyId = {
  hierarchyId: string
  element: HTMLElement | null
}

export type EditionOverlayContextType = {
  elementRegistry: ElementWithHierarchyId[]
  setElementRegistry: Dispatch<SetStateAction<ElementWithHierarchyId[]>>
}

export default createContext<EditionOverlayContextType>({
  elementRegistry: [],
  setElementRegistry: () => {},
})
