import { CSSProperties, Dispatch, SetStateAction, createContext } from 'react'

export type CssClassesContextType = {
  className: string
  setClassName: Dispatch<SetStateAction<string>>
  updatedStyles: CSSProperties
  setUpdatedStyles: Dispatch<SetStateAction<CSSProperties>>
}

export default createContext<CssClassesContextType>({
  className: '',
  setClassName: () => {},
  updatedStyles: {},
  setUpdatedStyles: () => {},
})
