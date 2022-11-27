import { useMemo } from 'react'

import { CSsAttributesMapType, CssClassType } from '../types'

import extractValueFromClasses from '../utils/extractValueFromClasses'

function useCssValues(classes: CssClassType[], attributeMap: CSsAttributesMapType) {
  return useMemo(() => {
    const values: Record<string, string | number> = {}

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
