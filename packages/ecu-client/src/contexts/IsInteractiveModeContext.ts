import { Dispatch, SetStateAction, createContext } from 'react'

export type IsInteractiveModeContextType = {
  isInteractiveMode: boolean
  setIsInteractiveMode: Dispatch<SetStateAction<boolean>>
}

export default createContext<IsInteractiveModeContextType>({
  isInteractiveMode: false,
  setIsInteractiveMode: () => {},
})
