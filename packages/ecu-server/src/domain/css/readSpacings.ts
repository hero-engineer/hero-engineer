import { spacingsEndComment, spacingsStartComment } from '../../configuration.js'
import { SpacingType } from '../../types.js'
import extractBetweenComments from '../comments/extractBetweenComments.js'

import getIndexCssNode from './getIndexCssNode.js'

const extractRegex = /^\s*--spacing-(\w*):\s*(.*);\s*\/\*\s*(.*)\s+\*\//

function readSpacings() {
  const indexCssNode = getIndexCssNode()

  const rawVariables = extractBetweenComments(indexCssNode.payload.code, spacingsStartComment, spacingsEndComment)

  console.log('rawVariables', rawVariables)

  return rawVariables.split('\n').map(line => {
    const match = line.match(extractRegex)

    if (!match) return null

    const [, id, value, name] = match

    return {
      id,
      variableName: `--spacing-${id}`,
      value,
      name,
    } as SpacingType
  }).filter(Boolean) as SpacingType[]
}

export default readSpacings
