import { CSsAttributesMapType, CssAttributeType } from '@types'

function areAttributesValid(attributes: CssAttributeType[], cssAttributesMap: CSsAttributesMapType) {
  return attributes.every(attribute => cssAttributesMap[attribute.name].isValueValid(attribute.value))
}

export default areAttributesValid
