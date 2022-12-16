import { Dispatch, SetStateAction, createContext } from 'react'

import { WarningsType } from '~types'

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
