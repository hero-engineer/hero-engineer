import { CSSProperties } from 'react'

import convertJsAttributeNameToCss from './convertJsAttributeNameToCss'

function convertStylesToCssString(style: CSSProperties) {
  let css = ''

  Object.entries(style).forEach(([name, value]) => {
    css += `${convertJsAttributeNameToCss(name)}:${value};`
  })

  return css
}

export default convertStylesToCssString
