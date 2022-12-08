import { CssClassType, CssValueType } from '~types'

function extractValueFromClasses(classes: CssClassType[], ...propNames: string[]) {
  let value: CssValueType | null = null

  classes.forEach(cssClass => {
    cssClass.attributes.forEach(attribute => {
      if (propNames.includes(attribute.name)) {
        value = attribute.value
      }
    })
  })

  return value as CssValueType | null
}

export default extractValueFromClasses
