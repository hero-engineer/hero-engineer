import { Dispatch, SetStateAction, createContext } from 'react'

export type AstContextType = {
  ast: string
  setAst: Dispatch<SetStateAction<string>>
}

export default createContext<AstContextType>({
  ast: '',
  setAst: () => {},
})
