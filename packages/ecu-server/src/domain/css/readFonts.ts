import { fontsEndComment, fontsStartComment } from '../../configuration.js'
import { FontType } from '../../types.js'
import extractBetweenComments from '../comments/extractBetweenComments.js'

import getIndexCssNode from './getIndexCssNode.js'

const extractRegex = /^@import\s*url\('(.*)'\);\s*\/\*\s*(.*)\s*~~~\s*(.*)\s*~~~\s*(.*)\s+\*\//

function readFonts() {
  const indexCssNode = getIndexCssNode()

  const rawImports = extractBetweenComments(indexCssNode.payload.code, fontsStartComment, fontsEndComment)

  return rawImports.split('\n').map(line => {
    const match = line.match(extractRegex)

    if (!match) return null

    const [, url, id, name, weights] = match
    const isVariable = weights === 'variable'

    return {
      id,
      name,
      url,
      isVariable,
      weights: isVariable ? [] : weights.split(',').map(Number).filter(Boolean),
    } as FontType
  }).filter(Boolean) as FontType[]
}

export default readFonts
