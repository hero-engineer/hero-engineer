import traverse from '@babel/traverse'

// Fixed in babel v8
// @ts-expect-error
export default traverse.default as typeof traverse
