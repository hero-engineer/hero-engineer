import { Dispatch, SetStateAction, createContext } from 'react'

import { BreakpointType } from '~types'

export type BreakpointContextType = {
  breakpoint: BreakpointType
  setBreakpoint: Dispatch<SetStateAction<BreakpointType>>
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
})
