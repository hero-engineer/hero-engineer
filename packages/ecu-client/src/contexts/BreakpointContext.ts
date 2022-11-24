import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '../types'

export type BreakpointContextType = {
  breakpoint: BreakpointType | null
  setBreakpoint: Dispatch<SetStateAction<BreakpointType | null>>
}

export default createContext<BreakpointContextType>({
  breakpoint: null,
  setBreakpoint: () => {},
})
