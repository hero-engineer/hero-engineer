import { Dispatch, SetStateAction, createContext } from 'react'

export type EditionOverlayContextType = {
  elementRegistry: Record<string, HTMLElement | null>
  setElementRegistry: Dispatch<SetStateAction<Record<string, HTMLElement | null>>>
}

export default createContext<EditionOverlayContextType>({
  elementRegistry: {},
  setElementRegistry: () => {},
})
