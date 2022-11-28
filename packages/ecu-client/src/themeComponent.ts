import { mergeTheme } from 'honorable'

import theme from './theme'

const themeComponent = mergeTheme(theme, {
  name: 'Ecu-Component',
  stylesheet: {
    html: [
      {
        fontSize: 16,
        fontFamily: null,
      },
    ],
  },
})

export default themeComponent
