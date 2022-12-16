import { CSSProperties, Dispatch, SetStateAction, createContext } from 'react'

export type CssClassesContextType = {
  className: string
  setClassName: Dispatch<SetStateAction<string>>
  selectedClassName: string
  setSelectedClassName: Dispatch<SetStateAction<string>>
  style: CSSProperties
  setStyle: Dispatch<SetStateAction<CSSProperties>>
}

export default createContext<CssClassesContextType>({
  className: '',
  setClassName: () => {},
  selectedClassName: '',
  setSelectedClassName: () => {},
  style: {},
  setStyle: () => {},
})
