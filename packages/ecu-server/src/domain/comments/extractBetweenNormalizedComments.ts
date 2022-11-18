import extractBetweenComments from './extractBetweenComments.js'

function extractBetweenNormalizedComments(code: string) {
  return extractBetweenComments(code, '/*', '*/')
}

export default extractBetweenNormalizedComments
