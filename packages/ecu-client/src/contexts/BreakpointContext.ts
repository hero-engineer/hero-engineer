import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '../types'

export type BreakpointContextType = {
  breakpoint: BreakpointType
  setBreakpoint: Dispatch<SetStateAction<BreakpointType>>
  breakpoints: BreakpointType[]
  setBreakpoints: Dispatch<SetStateAction<BreakpointType[]>>
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

export default createContext<BreakpointContextType>({
  breakpoint: {
    id: '',
    name: '',
    base: 0,
    min: 0,
    max: 0,
    scale: 0,
    media: '',
  },
  setBreakpoint: () => {},
  breakpoints: [],
  setBreakpoints: () => {},
  width: 0,
  setWidth: () => {},
  isDragging: false,
  setIsDragging: () => {},
})
