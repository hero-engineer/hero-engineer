import { CSsAttributesMapType, CssValuesType } from '../types'

function filterInvalidCssValues(cssValues: CssValuesType, cssAttributesMap: CSsAttributesMapType) {
  return Object.entries(cssValues).reduce<CssValuesType>((acc, [key, value]) => {
    if (cssAttributesMap[key].isValueValid(value)) {
      acc[key] = value
    }

    return acc
  }, {})
}

export default filterInvalidCssValues
