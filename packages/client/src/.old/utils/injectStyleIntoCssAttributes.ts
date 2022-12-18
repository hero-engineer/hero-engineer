import { CSSProperties } from 'react'

import { CssAttributeType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

import { extractCssImportant } from '~utils/cssImportantUtils'

function injectStyleIntoCssAttributes(attributes: CssAttributeType[], style: CSSProperties) {
  const nextAttributes = [...attributes]

  nextAttributes.forEach((attribute, i) => {
    if (typeof style[attribute.jsName as keyof typeof style] === 'undefined') return

    const [workingValue, isImportant] = extractCssImportant(style[attribute.jsName as keyof typeof style]!)

    if (workingValue === cssValueReset) {
      nextAttributes.splice(i, 1)

      return
    }

    const { converter } = cssAttributesMap[attribute.cssName]

    if ()

    attribute.value = workingValue
    attribute.isImportant = isImportant
  })

  return nextAttributes
}

// if (value === cssValueReset) {
//   delete nextCssValues[cssAttributeName]

//   return
// }

// const { converter } = cssAttributesMap[cssAttributeName]

// if (typeof converter === 'function') {
//   Object.assign(nextCssValues, converter(value))
// }
// else {
//   nextCssValues[cssAttributeName] = value
// }

export default injectStyleIntoCssAttributes
