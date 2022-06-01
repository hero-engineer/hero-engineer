import fs from 'fs'
import path from 'path'

import { ExpressionStatement, JSXElement, Program } from '@babel/types'
import { ParserOptions, parse } from '@babel/parser'
import generate, { GeneratorOptions } from '@babel/generator'
import { ESLint } from 'eslint'

import { FileType } from '../../types'

import configuration from '../configuration'

import babelConfig from './babel.config'

const eslint = new ESLint({ fix: true })

export function getFileLocation(file: FileType) {
  return path.join(configuration.srcLocation, `${file.location}/${file.name}`)
}

export function parseJsx(code: string) {
  return (parse(code, babelConfig as ParserOptions).program.body[0] as ExpressionStatement).expression as JSXElement
}

export function getFileAst(file: FileType) {
  const fileLocation = getFileLocation(file)

  return parse(
    fs.readFileSync(fileLocation, 'utf8'),
    babelConfig as ParserOptions
  )
}

export function regenerateFile(ast: Program, file: FileType) {
  const fileLocation = getFileLocation(file)
  const { code } = generate(ast, babelConfig as GeneratorOptions)

  fs.writeFileSync(fileLocation, code, 'utf8')
}

export async function lintFile(file: FileType) {
  const fileLocation = getFileLocation(file)
  const text = fs.readFileSync(fileLocation, 'utf8')
  const results = await eslint.lintText(text)

  await ESLint.outputFixes(results)

  fs.writeFileSync(fileLocation, results[0].output, 'utf8')
}
