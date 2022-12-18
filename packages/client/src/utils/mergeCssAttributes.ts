import { CssAttributeType } from '~types'

// Merge b into a with b having the priority over a
function mergeCssAttributes(a: CssAttributeType[], b: CssAttributeType[]) {
  const attributes = [...b]

  a.forEach(attribute => {
    if (attributes.find(existingAttribute => existingAttribute.cssName === attribute.cssName)) return

    attributes.push(attribute)
  })

  return attributes
}

export default mergeCssAttributes
