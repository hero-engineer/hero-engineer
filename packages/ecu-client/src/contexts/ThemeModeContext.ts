import { Dispatch, SetStateAction, createContext } from 'react'

export type ThemeModeContextType = {
  themeMode: 'light' | 'dark'
  setThemeMode: Dispatch<SetStateAction<'light' | 'dark'>>
}

export default createContext<ThemeModeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
})
