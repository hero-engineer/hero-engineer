import { useMemo } from 'react'
import { CssClassType, CssValuesType } from '~types'

import { cssAttributesMap } from '~constants'

import extractValueFromClasses from '~utils/extractValueFromClasses'

function useCssValues(classes: CssClassType[]) {
  return useMemo(() => {
    const values: CssValuesType = {}

    Object.entries(cssAttributesMap).forEach(([key, { attributes, extractValue }]) => {
      const extractedRawValue = extractValueFromClasses(classes, ...attributes)

      if (extractedRawValue !== null) {
        values[key] = typeof extractValue === 'function' ? extractValue(extractedRawValue) : extractedRawValue
      }
    })

    return values
  }, [classes])
}

export default useCssValues
