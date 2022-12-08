import { Dispatch, SetStateAction, createContext } from 'react'

import { AstsType } from '~types'

export type AstsContextType = {
  asts: AstsType
  setAsts: Dispatch<SetStateAction<AstsType>>
}

export default createContext<AstsContextType>({
  asts: {},
  setAsts: () => {},
})
