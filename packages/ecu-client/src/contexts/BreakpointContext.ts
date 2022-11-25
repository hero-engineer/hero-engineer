import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '../types'

export type BreakpointContextType = {
  breakpoint: BreakpointType | null
  setBreakpoint: Dispatch<SetStateAction<BreakpointType | null>>
  breakpoints: BreakpointType[]
  setBreakpoints: Dispatch<SetStateAction<BreakpointType[]>>
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

export default createContext<BreakpointContextType>({
  breakpoint: null,
  setBreakpoint: () => {},
  breakpoints: [],
  setBreakpoints: () => {},
  width: 0,
  setWidth: () => {},
  isDragging: false,
  setIsDragging: () => {},
})
