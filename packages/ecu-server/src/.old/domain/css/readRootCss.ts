import { rootCssEndComment, rootCssStartComment } from '../../configuration.js'
import extractBetweenComments from '../comments/extractBetweenComments.js'

import getIndexCssNode from './getIndexCssNode.js'

function readRootCss() {
  const indexCssNode = getIndexCssNode()

  return extractBetweenComments(indexCssNode.payload.code, rootCssStartComment, rootCssEndComment)
}

export default readRootCss
