import { FileNodeType } from '../../types.js'
import { indexCssFileRelativePath } from '../../configuration.js'

import { findNode } from '../../graph/index.js'

function getIndexCssNode() {
  const indexCssNode = findNode<FileNodeType>(n => n.payload.relativePath === indexCssFileRelativePath)
  if (!indexCssNode) {
    throw new Error('index.css file not found')
  }

  return indexCssNode
}

export default getIndexCssNode
