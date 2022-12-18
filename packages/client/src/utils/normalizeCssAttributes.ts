import { CssAttributeType, NormalizedCssAttributesType } from '~types'

function normalizeCssAttributes(attributes: CssAttributeType[]) {
  const normalizedAttributes: NormalizedCssAttributesType = {}

  attributes.forEach(attribute => {
    normalizedAttributes[attribute.cssName] = attribute
  })

  return normalizedAttributes
}

export default normalizeCssAttributes
