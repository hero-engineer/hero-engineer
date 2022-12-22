import { Dispatch, SetStateAction, createContext } from 'react'

export type BreakpointDimensionsContextType = {
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  height: number | null
  setHeight: Dispatch<SetStateAction<number | null>>
  isDraggingWidth: boolean
  setIsDraggingWidth: Dispatch<SetStateAction<boolean>>
  isDraggingHeight: boolean
  setIsDraggingHeight: Dispatch<SetStateAction<boolean>>
}

export default createContext<BreakpointDimensionsContextType>({
  width: 0,
  setWidth: () => {},
  height: null,
  setHeight: () => {},
  isDraggingWidth: false,
  setIsDraggingWidth: () => {},
  isDraggingHeight: false,
  setIsDraggingHeight: () => {},
})
