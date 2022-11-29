import { CSSProperties } from 'react'

import { CSsAttributesMapType, CssValuesType } from '../types'

import convertJsAttributeNameToCss from '../utils/convertJsAttributeNameToCss'

function useJsCssValues(cssValues: CssValuesType, style: CSSProperties, cssAttributesMap: CSsAttributesMapType) {
  const nextCssValues = { ...cssValues }

  Object.entries(style).forEach(([attributeName, value]) => {
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
