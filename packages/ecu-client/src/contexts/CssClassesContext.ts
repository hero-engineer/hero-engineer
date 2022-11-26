import { Dispatch, SetStateAction, createContext } from 'react'

export type CssClassesContextType = {
  className: string
  setClassName: Dispatch<SetStateAction<string>>
}

export default createContext<CssClassesContextType>({
  className: '',
  setClassName: () => {},
})
