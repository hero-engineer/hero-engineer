import { Dispatch, SetStateAction, createContext } from 'react'

export type ComponentRemountContextType = {
  key: number
  setKey: Dispatch<SetStateAction<number>>
}

export default createContext<ComponentRemountContextType>({
  key: 0,
  setKey: () => {},
})
