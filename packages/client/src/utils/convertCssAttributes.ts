import { CssAttributeType } from '~types'

import { cssAttributesMap } from '~constants'

// In place
// Convert attributes that require conversion
function convertCssAttributes(attributes: CssAttributeType[]) {
  attributes.forEach((attribute, i) => {
    const { converter } = cssAttributesMap[attribute.cssName]

    if (typeof converter === 'function') {
      attributes.splice(i, 1)
      attributes.push(...converter(attribute.value, attribute.isImportant))
    }
  })

  return attributes
}

export default convertCssAttributes
