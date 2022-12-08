import { Dispatch, SetStateAction, createContext } from 'react'
import { TypeType } from '~types'

export type GlobalTypesContextType = {
  globalTypes: TypeType[]
  setGlobalTypes: Dispatch<SetStateAction<TypeType[]>>
}

export default createContext<GlobalTypesContextType>({
  globalTypes: [],
  setGlobalTypes: () => {},
})
