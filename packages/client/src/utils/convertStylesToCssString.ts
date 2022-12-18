import { CSSProperties } from 'react'

import convertCssAttributeJsNameToCss from './convertCssAttributeJsNameToCss'

function convertStylesToCssString(style: CSSProperties) {
  let css = ''

  Object.entries(style).forEach(([name, value]) => {
    css += `${convertCssAttributeJsNameToCss(name)}:${value};`
  })

  return css
}

export default convertStylesToCssString
