import { useMemo } from 'react'

import { CSsAttributesMapType, CssClassType, CssValuesType } from '../types'

import extractValueFromClasses from '../utils/extractValueFromClasses'

function useCssValues(classes: CssClassType[], attributeMap: CSsAttributesMapType) {
  return useMemo(() => {
    const values: CssValuesType = {}

    Object.entries(attributeMap).forEach(([key, { attributes, extractValue }]) => {
      const extractedRawValue = extractValueFromClasses(classes, ...attributes)

      if (extractedRawValue !== null) {
        values[key] = typeof extractValue === 'function' ? extractValue(extractedRawValue) : extractedRawValue
      }
    })

    return values
  }, [classes, attributeMap])
}

export default useCssValues
