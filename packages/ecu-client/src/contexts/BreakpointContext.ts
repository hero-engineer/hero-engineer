import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '../types'

export type BreakpointContextType = {
  width: number | '100%'
  setWidth: Dispatch<SetStateAction<number | '100%'>>
  breakpoint: BreakpointType | null
  setBreakpoint: Dispatch<SetStateAction<BreakpointType | null>>
  breakpoints: BreakpointType[]
  setBreakpoints: Dispatch<SetStateAction<BreakpointType[]>>
}

export default createContext<BreakpointContextType>({
  width: '100%',
  setWidth: () => {},
  breakpoint: null,
  setBreakpoint: () => {},
  breakpoints: [],
  setBreakpoints: () => {},
})
