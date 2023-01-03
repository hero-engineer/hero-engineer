import { Dispatch, SetStateAction, createContext } from 'react'

export type ComponentPanelsContextType = {
  leftKey: string,
  setLeftKey: Dispatch<SetStateAction<string>>,
  rightKey: string,
  setRightKey: Dispatch<SetStateAction<string>>,
}

export default createContext<ComponentPanelsContextType>({
  leftKey: '',
  setLeftKey: () => {},
  rightKey: '',
  setRightKey: () => {},
})
