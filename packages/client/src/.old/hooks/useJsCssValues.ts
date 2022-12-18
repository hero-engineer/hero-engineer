import { CSSProperties, useMemo } from 'react'

import { CssValuesType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

import convertCssAttributeJsNameToCss from '~utils/convertCssAttributeJsNameToCss'

function useJsCssValues(cssValues: CssValuesType, style: CSSProperties) {
  return useMemo(() => {
    const nextCssValues = { ...cssValues }

    Object.entries(style).forEach(([attributeName, value]) => {
      const cssAttributeName = convertCssAttributeJsNameToCss(attributeName)

      if (value === cssValueReset) {
        delete nextCssValues[cssAttributeName]

        return
      }

      const { converter } = cssAttributesMap[cssAttributeName]

      if (typeof converter === 'function') {
        Object.assign(nextCssValues, converter(value))
      }
      else {
        nextCssValues[cssAttributeName] = value
      }
    })

    return nextCssValues
  }, [cssValues, style])
}

export default useJsCssValues
