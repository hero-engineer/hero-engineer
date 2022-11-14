import generate from '@babel/generator'

// Fixed in babel v8
// @ts-expect-error
export default generate.default as typeof generate
