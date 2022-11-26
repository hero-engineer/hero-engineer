import fs from 'node:fs'

import { FileNodePayloadType, FileNodeType } from '../../types.js'

import parseCode from '../../domain/parseCode.js'
import extractDescription from '../../domain/comments/extractDescription.js'
import extractEmoji from '../../domain/comments/extractEmoji.js'

type CreateFileNodeDataType = Omit<FileNodeType, 'payload'> & { payload: Omit<FileNodePayloadType, 'code' | 'ast' | 'description' | 'emoji'> }

function createFileNode(data: CreateFileNodeDataType): FileNodeType {
  return {
    ...data,
    payload: {
      ...data.payload,
      get code() {
        return fs.readFileSync(data.payload.path, 'utf8')
      },
      get ast() {
        return data.payload.extension === 'css' ? null : parseCode(this.code)
      },
      get description() {
        return extractDescription(this.code)
      },
      get emoji() {
        return extractEmoji(this.code)
      },
    },
  }
}

export default createFileNode
