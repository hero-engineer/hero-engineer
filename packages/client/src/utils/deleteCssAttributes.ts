import { CssAttributeType } from '~types'

import { cssValueReset } from '~constants'

// Delete attributes with the value `cssValueReset`
function deleteCssAttributes(attributes: CssAttributeType[]) {
  return attributes.filter(attribute => attribute.value !== cssValueReset)
}

export default deleteCssAttributes
