import { useMemo } from 'react'

import { CssClassType } from '../types'

import extractValueFromClasses from '../utils/extractValueFromClasses'

function useCssValues(classes: CssClassType[], attributeMap: Record<string, { attributes: readonly string[], defaultValue: string | number }>) {
  return useMemo(() => {
    const values: Record<string, string | number> = {}

    Object.entries(attributeMap).forEach(([key, { attributes, defaultValue }]) => {
      values[key] = extractValueFromClasses(classes, ...attributes) ?? defaultValue
    })

    return values
  }, [classes, attributeMap])
}

export default useCssValues
