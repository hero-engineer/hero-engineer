import fs from 'node:fs'
import path from 'node:path'

import shortId from 'shortid'

import { appPath, ecuFileIdCommentPrefix } from '../../configuration.js'

import { addNode } from '../index.js'
import createFileNode from '../models/createFileNode.js'

function addFile(fileLocation: string) {
  const relativePath = path.relative(appPath, fileLocation)
  const nameArray = path.basename(fileLocation).split('.')
  const extension = nameArray.pop() || ''
  const name = nameArray.join('.')

  const address = extractFileId(fileLocation, extension) || appendFileId(fileLocation, extension)

  const fileNode = createFileNode({
    address,
    role: 'File',
    state: null,
    payload: {
      name,
      extension,
      path: fileLocation,
      relativePath,
    },
  })

  addNode(fileNode)

  return fileNode
}

function extractFileId(fileLocation: string, extension: string) {
  const fileContent = fs.readFileSync(fileLocation, 'utf8')
  const comment = extension === 'css' ? `/* ${ecuFileIdCommentPrefix} ` : `// ${ecuFileIdCommentPrefix} `
  const firstLine = fileContent.split('\n')[0]

  if (typeof firstLine === 'string' && firstLine.startsWith(comment)) {
    return firstLine.replace(comment, '').replace(' */', '').trim()
  }

  return ''
}

function appendFileId(fileLocation: string, extension: string) {
  const fileContent = fs.readFileSync(fileLocation, 'utf8')
  const id = shortId()
  const comment = extension === 'css' ? `/* ${ecuFileIdCommentPrefix} ${id} */` : `// ${ecuFileIdCommentPrefix} ${id}`

  fs.writeFileSync(fileLocation, `${comment}\n${fileContent}`)

  return id
}

export default addFile
