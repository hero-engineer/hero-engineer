import { CssAttributeType } from '~types'

import { cssAttributesMap } from '~constants'

function areAttributesValid(attributes: CssAttributeType[]) {
  return attributes.every(attribute => cssAttributesMap[attribute.name].isValueValid(attribute.value))
}

export default areAttributesValid
