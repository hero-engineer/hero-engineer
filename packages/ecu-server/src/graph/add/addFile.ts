import path from 'path'

import shortId from 'shortid'

import { appPath } from '../../configuration'

import { addNode } from '..'
import createFileNode from '../models/createFileNode'

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
