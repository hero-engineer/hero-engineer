import { createContext } from 'react'

export type RefetchContextType = {
  refetch: (key: string) => void
  register: (key: string, refetch: () => void) => () => void
}

export default createContext<RefetchContextType>({
  refetch: () => {},
  register: () => () => {},
})
