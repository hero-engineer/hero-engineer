import { Dispatch, SetStateAction, createContext } from 'react'

export type WarningsType = {
  cssClassOrdering: boolean
}

export type WarningsContextType = {
  warnings: WarningsType
  setWarnings: Dispatch<SetStateAction<WarningsType>>
}

export default createContext<WarningsContextType>({
  warnings: {
    cssClassOrdering: true,
  },
  setWarnings: () => {},
})
