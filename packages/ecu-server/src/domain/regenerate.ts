import fs from 'node:fs'

import { ParseResult } from '@babel/core'

import { FileNodeType } from '../types.js'

import generate from './generate.js'
import lintCode from './lintCode.js'

async function regenerate(fileNode: FileNodeType, astOrCode: ParseResult | string | null) {
  if (!astOrCode) return false

  let code = typeof astOrCode === 'string' ? astOrCode : generate(astOrCode).code

  code = await lintCode(code)

  if (code === fileNode.payload.code) return false

  fs.writeFileSync(fileNode.payload.path, code, 'utf8')

  return true
}

export default regenerate
