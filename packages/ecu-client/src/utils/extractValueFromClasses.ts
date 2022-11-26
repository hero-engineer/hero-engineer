import { CssClassType } from '../types'

function extractValueFromClasses(classes: CssClassType[], ...propNames: string[]) {
  let value = ''

  classes.forEach(cssClass => {
    cssClass.attributes.forEach(attribute => {
      if (propNames.includes(attribute.name)) {
        value = attribute.value
      }
    })
  })

  return value || null
}

export default extractValueFromClasses
