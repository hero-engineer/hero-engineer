import { Dispatch, SetStateAction, createContext } from 'react'

export type BreakpointDimensionsContextType = {
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  height: number | null
  setHeight: Dispatch<SetStateAction<number | null>>
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

export default createContext<BreakpointDimensionsContextType>({
  width: 0,
  setWidth: () => {},
  height: null,
  setHeight: () => {},
  isDragging: false,
  setIsDragging: () => {},
})
