import fs from 'node:fs'

import { FileNodePayloadType, FileNodeType } from '../../types.js'

import parseCode from '../../domain/parseCode.js'

type CreateFileNodeDataType = Omit<FileNodeType, 'payload'> & { payload: Omit<FileNodePayloadType, 'code' | 'ast'> }

function createFileNode(data: CreateFileNodeDataType): FileNodeType {
  return {
    ...data,
    payload: {
      ...data.payload,
      get code() {
        return fs.readFileSync(data.payload.path, 'utf8')
      },
      get ast() {
        return parseCode(this.code)
      },
    },
  }
}

export default createFileNode
