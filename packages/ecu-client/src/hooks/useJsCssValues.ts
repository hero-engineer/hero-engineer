import { CSSProperties } from 'react'

import { CSsAttributesMapType, CssValueType } from '../types'

import convertJsAttributeNameToCss from '../utils/convertJsAttributeNameToCss'

function useJsCssValues(cssValues: Record<string, CssValueType>, styles: CSSProperties, cssAttributesMap: CSsAttributesMapType) {
  const nextCssValues = { ...cssValues }

  Object.entries(styles).forEach(([attributeName, value]) => {
    const cssAttributeName = convertJsAttributeNameToCss(attributeName)

    const { converter } = cssAttributesMap[cssAttributeName]

    if (typeof converter === 'function') {
      Object.assign(nextCssValues, converter(value))
    }
    else {
      nextCssValues[cssAttributeName] = value
    }
  })

  return nextCssValues
}

export default useJsCssValues
