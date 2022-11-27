import { CSsAttributesMapType, CssValueType } from '../types'

function removeCssDefaults(attributes: Record<string, CssValueType>, cssAttributeMap: CSsAttributesMapType) {
  const nextAttributes = { ...attributes }

  Object.entries(attributes).forEach(([attributeName, value]) => {
    const { defaultValue } = cssAttributeMap[attributeName]

    if (value.toString() === defaultValue.toString()) {
      delete nextAttributes[attributeName]
    }
  })

  return nextAttributes
}

export default removeCssDefaults
