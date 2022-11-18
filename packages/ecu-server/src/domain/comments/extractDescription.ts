import { descriptionEndComment, descriptionStartComment } from '../../configuration.js'

import extractBetweenComments from './extractBetweenComments.js'
import extractBetweenNormalizedComments from './extractBetweenNormalizedComments.js'

function extractDescription(code: string) {
  return extractBetweenNormalizedComments(extractBetweenComments(code, descriptionStartComment, descriptionEndComment))
}

export default extractDescription
