import { CssAttributeType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

// In place
// Delete attributes with the value `cssValueReset`
// Convert attributes that require conversion
function deleteAndConvertCssAttributes(attributes: CssAttributeType[]) {
  const nextAttributes = attributes.filter(attribute => attribute.value !== cssValueReset)

  nextAttributes.forEach((attribute, i) => {
    const { converter } = cssAttributesMap[attribute.cssName]

    if (typeof converter === 'function') {
      nextAttributes.splice(i, 1)
      nextAttributes.push(...converter(attribute.value, attribute.isImportant))
    }
  })

  return nextAttributes
}

export default deleteAndConvertCssAttributes
