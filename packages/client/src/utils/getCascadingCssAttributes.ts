import { CssAttributeType, CssClassType } from '~types'

function getCascadingCssAttributes(classes: CssClassType[]) {
  const cssNameToAttribute: Record<string, CssAttributeType> = {}

  classes.forEach(cssClass => {
    cssClass.attributes.forEach(attribute => {
      if (cssNameToAttribute[attribute.cssName]?.isImportant && !attribute.isImportant) return

      cssNameToAttribute[attribute.cssName] = attribute
    })
  })

  return Object.values(cssNameToAttribute)
}

export default getCascadingCssAttributes
