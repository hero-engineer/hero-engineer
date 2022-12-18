import { CSsAttributesMapType, CssValuesType } from '~types'

function removeCssDefaults(cssValues: CssValuesType, cssAttributeMap: CSsAttributesMapType) {
  const nextAttributes = { ...cssValues }

  Object.entries(cssValues).forEach(([attributeName, value]) => {
    const { defaultValue } = cssAttributeMap[attributeName]

    if (value.toString() === defaultValue.toString()) {
      delete nextAttributes[attributeName]
    }
  })

  return nextAttributes
}

export default removeCssDefaults
