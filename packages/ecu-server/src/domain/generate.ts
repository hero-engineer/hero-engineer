import { ParseResult } from '@babel/core'
import generate from '@babel/generator'

// Fixed in babel v8
// @ts-expect-error
export default ((astOrCode: ParseResult | string | null) => generate.default(astOrCode, { jsescOption: { minimal: true } })) as typeof generate // jsescOption: { minimal: true } to prevent escaping unicode characters
