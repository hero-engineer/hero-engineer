import { CssAttributeType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

// In place
// Delete attributes with the value `cssValueReset`
// Convert attributes that require conversion
function deleteAndConvertCssAttributes(attributes: CssAttributeType[]) {
  for (const key of Object.keys(attributes)) {
    const index = parseInt(key)
    const attribute = attributes[index]

    if (attribute.value === cssValueReset) {
      attributes.splice(index, 1)

      continue
    }

    const { converter } = cssAttributesMap[attribute.cssName]

    if (typeof converter === 'function') {
      attributes.splice(index, 1)
      attributes.push(...converter(attribute.value, attribute.isImportant))
    }
  }

  return attributes
}

export default deleteAndConvertCssAttributes
