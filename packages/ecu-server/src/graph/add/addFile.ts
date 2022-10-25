import fs from 'fs'
import path from 'path'

import { parse } from '@babel/parser'
import shortId from 'shortid'

import { appPath } from '../../configuration'
import { FileNodeType, GraphType } from '../../types'

import { addNode } from '../helpers'

function addFile(graph: GraphType, filePath: string) {
  const relativePath = path.relative(appPath, filePath)
  const nameArray = path.basename(filePath).split('.')
  const extension = nameArray.pop() || ''
  const name = nameArray.join('.')

  const fileNode: FileNodeType = {
    address: shortId(),
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
