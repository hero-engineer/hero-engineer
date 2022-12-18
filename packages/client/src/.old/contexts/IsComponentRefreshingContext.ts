import { Dispatch, SetStateAction, createContext } from 'react'

export type IsComponentRefreshingContextType = {
  isComponentRefreshing: boolean
  setIsComponentRefreshing: Dispatch<SetStateAction<boolean>>
}

export default createContext<IsComponentRefreshingContextType>({
  isComponentRefreshing: false,
  setIsComponentRefreshing: () => {},
})
