import { colorsEndComment, colorsStartComment } from '../../configuration.js'
import { ColorType } from '../../types.js'
import extractBetweenComments from '../comments/extractBetweenComments.js'

import getIndexCssNode from './getIndexCssNode.js'

const extractRegex = /^\s*--color-(\w*):\s*(.*);\s*\/\*\s*(.*)\s+\*\//

function readColors() {
  const indexCssNode = getIndexCssNode()

  const rawVariables = extractBetweenComments(indexCssNode.payload.code, colorsStartComment, colorsEndComment)

  return rawVariables.split('\n').map(line => {
    const match = line.match(extractRegex)

    if (!match) return null

    const [, id, value, name] = match

    return {
      id,
      variableName: `--color-${id}`,
      value,
      name,
    } as ColorType
  }).filter(Boolean) as ColorType[]
}

export default readColors
