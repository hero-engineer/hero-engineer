import { ReactNode, useContext } from 'react'
import { CssBaseline, ThemeProvider, mergeTheme } from 'honorable'

import ThemeModeContext from '~contexts/ThemeModeContext'

import theme from '../../../theme'

type ProviderThemePropsType = {
  children: ReactNode
}

function ProviderTheme({ children }: ProviderThemePropsType) {
  const { themeMode } = useContext(ThemeModeContext)

  return (
    <ThemeProvider theme={mergeTheme(theme, { mode: themeMode })}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default ProviderTheme
