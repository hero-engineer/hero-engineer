import { Dispatch, SetStateAction, createContext } from 'react'

export type EditionContextType = {
  selectedId: string | null
  setSelectedId: Dispatch<SetStateAction<string | null>>
}

export default createContext<EditionContextType>({
  selectedId: null,
  setSelectedId: () => {},
})
