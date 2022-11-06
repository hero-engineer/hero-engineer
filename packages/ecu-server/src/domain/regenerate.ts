import fs from 'fs'

import { ParseResult } from '@babel/core'
import generate from '@babel/generator'

import { FileNodeType } from '../types'

import lintCode from './lintCode'

async function regenerate(fileNode: FileNodeType, ast: ParseResult) {
  let { code } = generate(ast)

  code = await lintCode(code)

  if (code === fileNode.payload.code) return false

  fs.writeFileSync(fileNode.payload.path, code, 'utf8')

  return true
}

export default regenerate
