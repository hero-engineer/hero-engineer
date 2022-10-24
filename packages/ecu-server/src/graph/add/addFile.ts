import fs from 'fs'
import path from 'path'

import { parse } from '@babel/parser'
import { nanoid } from 'nanoid'

import configuration from '../../configuration'
import { FileNodeType, GraphType } from '../../types'

import { addNode } from '../helpers'

function addFile(graph: GraphType, filePath: string) {
  const relativePath = path.relative(configuration.appPath, filePath)
  const nameArray = path.basename(filePath).split('.')
  const extension = nameArray.pop() || ''
  const name = nameArray.join('.')

  const fileNode: FileNodeType = {
    address: nanoid(),
    role: 'File',
    state: null,
    payload: {
      name,
      extension,
      path: filePath,
      relativePath,
      get text() {
        return fs.readFileSync(filePath, 'utf8')
      },
      get ast() {
        return parse(
          this.text,
          {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          }
        )
      },
    },
  }

  addNode(graph, fileNode)

  return fileNode
}

export default addFile
