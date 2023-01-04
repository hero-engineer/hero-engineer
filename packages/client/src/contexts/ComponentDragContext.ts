import { Dispatch, SetStateAction, createContext } from 'react'

import { DragType } from '~types'

export type ComponentDragContextType = {
  dragged: DragType | null,
  setDragged: Dispatch<SetStateAction<DragType | null>>,
}

export default createContext<ComponentDragContextType>({
  dragged: null,
  setDragged: () => {},
})
