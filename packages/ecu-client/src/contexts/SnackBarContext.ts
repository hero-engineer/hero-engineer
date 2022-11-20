import { Dispatch, SetStateAction, createContext } from 'react'

import { SnackBarItemType } from '../types'

export type SnackBarContextType = {
  snackBarItems: SnackBarItemType[]
  setSnackBarItems: Dispatch<SetStateAction<SnackBarItemType[]>>
}

export default createContext<SnackBarContextType>({
  snackBarItems: [],
  setSnackBarItems: () => {},
})
