import fs from 'fs'

import { transformSync } from '@babel/core'

import { FileNodeType } from '../types'

function transformFileCode(fileNode: FileNodeType, plugin: any) {
  const output = transformSync(fileNode.payload.text, {
    plugins: [
      ['@babel/plugin-syntax-typescript', { isTSX: true }],
      '@babel/plugin-syntax-jsx',
      plugin,
    ],
  })

  console.log('output.code', output?.code)

  fs.writeFileSync(fileNode.payload.path, output?.code || '', 'utf-8')
}

export default transformFileCode
