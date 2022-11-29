import { CSSProperties, Dispatch, SetStateAction, createContext } from 'react'

export type CssClassesContextType = {
  className: string
  setClassName: Dispatch<SetStateAction<string>>
  breakpointToStyles: Record<string, CSSProperties>
  setBreakpointToStyle: Dispatch<SetStateAction<Record<string, CSSProperties>>>
}

export default createContext<CssClassesContextType>({
  className: '',
  setClassName: () => {},
  breakpointToStyles: {},
  setBreakpointToStyle: () => {},
})
