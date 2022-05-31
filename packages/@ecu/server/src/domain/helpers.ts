import fs from 'fs'
import path from 'path'

import { ExpressionStatement, JSXElement, Program } from '@babel/types'
import { ParserOptions, parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import generate, { GeneratorOptions } from '@babel/generator'

import { ESLint } from 'eslint'

import configuration from '../configuration'

import babelConfig from './babel.config'

// !!!
// Rewrite everything to use babel
// !!!

export function getFileLocation(fileName: string) {
  return path.join(configuration.rootPath, configuration.appRoot, `src/${fileName}.tsx`)
}

export function parseJsx(code: string) {
  return (parse(code, babelConfig as ParserOptions).program.body[0] as ExpressionStatement).expression as JSXElement
}

export function getFileAst(location: string) {
  return parse(
    fs.readFileSync(location, 'utf8'),
    babelConfig as ParserOptions
  )
}

export async function regenerateFile(ast: Program, fileLocation: string) {
  const text = generate(ast, babelConfig as GeneratorOptions).code
  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintText(text)

  // await ESLint.outputFixes(results)

  console.log('results', results[0].output)
}
