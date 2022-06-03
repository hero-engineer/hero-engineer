import fs from 'fs'

import { ExpressionStatement, JSXElement, Program } from '@babel/types'
import { ParserOptions, parse } from '@babel/parser'
import generate, { GeneratorOptions } from '@babel/generator'
import { ESLint } from 'eslint'

import { FileType } from '../../types'

import babelConfig from './babel.config'

const eslint = new ESLint({ fix: true })

export function parseJsx(code: string) {
  return (parse(code, babelConfig as ParserOptions).program.body[0] as ExpressionStatement).expression as JSXElement
}

export function getFileAst(file: FileType) {
  return parse(
    fs.readFileSync(file.path, 'utf8'),
    babelConfig as ParserOptions
  )
}

export function regenerateFile(ast: Program, file: FileType) {
  const { code } = generate(ast, babelConfig as GeneratorOptions)

  fs.writeFileSync(file.path, code, 'utf8')
}

export async function lintFile(file: FileType) {
  const text = fs.readFileSync(file.path, 'utf8')
  const results = await eslint.lintText(text)

  await ESLint.outputFixes(results)

  fs.writeFileSync(file.path, results[0].output, 'utf8')
}
