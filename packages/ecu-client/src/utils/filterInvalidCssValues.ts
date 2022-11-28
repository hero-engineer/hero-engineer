import { CSsAttributesMapType, CssValueType } from '../types'

function filterInvalidCssValues(cssValues: Record<string, CssValueType>, cssAttributesMap: CSsAttributesMapType) {
  return Object.entries(cssValues).reduce<Record<string, CssValueType>>((acc, [key, value]) => {
    if (cssAttributesMap[key].isValueValid(value)) {
      acc[key] = value
    }

    return acc
  }, {})
}

export default filterInvalidCssValues
