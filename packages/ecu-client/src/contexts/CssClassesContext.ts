import { Dispatch, SetStateAction, createContext } from 'react'

export type CssClassesContextType = {
  className: string
  setClassName: Dispatch<SetStateAction<string>>
  updatedClassName: string | null
  setUpdatedClassName: Dispatch<SetStateAction<string | null>>
}

export default createContext<CssClassesContextType>({
  className: '',
  setClassName: () => {},
  updatedClassName: null,
  setUpdatedClassName: () => {},
})
