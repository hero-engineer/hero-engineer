import { Particule, createAddress } from 'ecu-particule'
import { CssBaseline, ThemeProvider } from 'honorable'
import theme from 'honorable-theme-default'

const masterBlockParticule: Particule = {
  address: createAddress(),
  role: 'Block:Master',
  payload: {},
  workload: function MasterBlock({ children }: any) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    )
  },
}

export default masterBlockParticule
