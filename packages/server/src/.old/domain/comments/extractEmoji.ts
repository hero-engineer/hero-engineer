import { emojiEndComment, emojiStartComment } from '../../configuration.js'

import extractBetweenComments from './extractBetweenComments.js'
import extractBetweenNormalizedComments from './extractBetweenNormalizedComments.js'

function extractEmoji(code: string) {
  return extractBetweenNormalizedComments(extractBetweenComments(code, emojiStartComment, emojiEndComment))
}

export default extractEmoji
