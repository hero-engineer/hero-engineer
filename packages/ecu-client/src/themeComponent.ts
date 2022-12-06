import { mergeTheme } from 'honorable'

import theme from './theme'

// Needed for the Text input to be styled as its parent
const inputStyles = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  fontStyle: 'inherit',
  textAlign: 'inherit',
  textDecoration: 'inherit',
  textTransform: 'inherit',
  textShadow: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  wordSpacing: 'inherit',
  color: 'inherit',
}

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
  Input: {
    Root: [
      inputStyles,
    ],
    InputBase: [
      inputStyles,
    ],
    TextArea: [
      inputStyles,
    ],
  },
  InputBase: {
    Root: [
      inputStyles,
    ],
  },
})

export default themeComponent
