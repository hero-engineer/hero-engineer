import path from 'node:path'

import shortId from 'shortid'

import { appPath } from '../../configuration.js'

import { addNode } from '../index.js'
import createFileNode from '../models/createFileNode.js'

function addFile(filePath: string) {
  const relativePath = path.relative(appPath, filePath)
  const nameArray = path.basename(filePath).split('.')
  const extension = nameArray.pop() || ''
  const name = nameArray.join('.')

  const fileNode = createFileNode({
    address: shortId(),
    role: 'File',
    state: null,
    payload: {
      name,
      extension,
      path: filePath,
      relativePath,
    },
  })

  addNode(fileNode)

  return fileNode
}

export default addFile
