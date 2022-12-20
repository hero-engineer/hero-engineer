import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '~types'

export type BreakpointContextType = {
  breakpoint: BreakpointType
  setBreakpoint: Dispatch<SetStateAction<BreakpointType>>
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  height: number | null
  setHeight: Dispatch<SetStateAction<number | null>>
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
  width: 0,
  setWidth: () => {},
  height: null,
  setHeight: () => {},
  isDragging: false,
  setIsDragging: () => {},
})
